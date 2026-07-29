import { NextResponse } from "next/server";
import webpush from "web-push";
import { getLatestMomentFresh } from "@/lib/wordpress";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 15;

type PushRequest = {
  subscription?: webpush.PushSubscription;
};

type WordPressSubscriptionRow = {
  endpoint: string;
  p256dh: string;
  auth: string;
  expiration_time?: number | null;
};

type WordPressSubscriptionResponse = {
  ok?: boolean;
  subscriptions?: WordPressSubscriptionRow[];
  message?: string;
};

const WP_URL = process.env.WORDPRESS_URL || "https://cms.lmn516.com";

function plainTextFromHtml(html: string) {
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/p>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#8217;/g, "’")
    .replace(/&#8220;|&#8221;/g, "“")
    .replace(/\s+/g, " ")
    .trim();
}

function notificationBody(content: string) {
  const text = plainTextFromHtml(content);

  if (!text) {
    return "🫧 刚刚更新了一条新的碎碎念。";
  }

  const shortText = text.length > 60 ? `${text.slice(0, 60)}…` : text;
  return `🫧 ${shortText}`;
}

function toPushSubscription(
  row: WordPressSubscriptionRow
): webpush.PushSubscription {
  return {
    endpoint: row.endpoint,
    expirationTime: row.expiration_time ?? null,
    keys: {
      p256dh: row.p256dh,
      auth: row.auth,
    },
  };
}

async function readSavedSubscriptions(secret: string) {
  const response = await fetch(
    `${WP_URL}/wp-json/lmn516/v1/push/subscriptions`,
    {
      method: "GET",
      headers: {
        "X-LMN516-Push-Secret": secret,
      },
      cache: "no-store",
    }
  );

  const result = (await response.json().catch(() => null)) as
    | WordPressSubscriptionResponse
    | null;

  if (!response.ok || !result?.ok) {
    throw new Error(
      result?.message || `WordPress 读取订阅失败（${response.status}）。`
    );
  }

  return (result.subscriptions || []).map(toPushSubscription);
}

async function deleteExpiredSubscription(endpoint: string, secret: string) {
  try {
    await fetch(`${WP_URL}/wp-json/lmn516/v1/push/subscriptions`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-LMN516-Push-Secret": secret,
      },
      body: JSON.stringify({ endpoint }),
      cache: "no-store",
    });
  } catch (error) {
    console.error("Expired subscription cleanup failed:", error);
  }
}

export async function POST(request: Request) {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.trim();
  const privateKey = process.env.VAPID_PRIVATE_KEY?.trim();
  const subject =
    process.env.VAPID_SUBJECT?.trim() || "mailto:hello@lmn516.com";
  const secret = process.env.LMN516_PUSH_API_SECRET?.trim();

  if (!publicKey || !privateKey) {
    return NextResponse.json(
      { error: "服务器尚未配置 VAPID 密钥。" },
      { status: 503 }
    );
  }

  let body: PushRequest = {};

  try {
    const rawBody = await request.text();
    body = rawBody ? (JSON.parse(rawBody) as PushRequest) : {};
  } catch {
    return NextResponse.json({ error: "请求内容无效。" }, { status: 400 });
  }

  let subscriptions: webpush.PushSubscription[] = [];
  const isSingleDeviceTest = Boolean(
    body.subscription?.endpoint && body.subscription.keys
  );

  if (isSingleDeviceTest && body.subscription) {
    subscriptions = [body.subscription];
  } else {
    if (!secret) {
      return NextResponse.json(
        { error: "服务器尚未配置 LMN516_PUSH_API_SECRET。" },
        { status: 503 }
      );
    }

    const providedSecret = request.headers
      .get("x-lmn516-push-secret")
      ?.trim();

    if (!providedSecret || providedSecret !== secret) {
      return NextResponse.json({ error: "推送请求未通过验证。" }, { status: 403 });
    }

    try {
      subscriptions = await readSavedSubscriptions(secret);
    } catch (error) {
      console.error("Reading saved subscriptions failed:", error);
      return NextResponse.json(
        {
          error:
            error instanceof Error
              ? error.message
              : "无法从 WordPress 读取推送订阅。",
        },
        { status: 502 }
      );
    }
  }

  if (subscriptions.length === 0) {
    return NextResponse.json(
      { error: "目前没有可用的推送订阅。" },
      { status: 404 }
    );
  }

  const moment = await getLatestMomentFresh();

  if (!moment) {
    return NextResponse.json(
      {
        error:
          "没有读取到最新碎碎念，请确认 WordPress 中已经发布并归入 moments 分类。",
      },
      { status: 404 }
    );
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);

  const payload = JSON.stringify({
    body: notificationBody(moment.content),
    url: `/moments#moment-${moment.id}`,
    icon: "/icons/icon-192.png",
    badge: "/icons/badge-96.png",
    tag: `lmn516-moment-${moment.id}`,
  });

  const results = await Promise.allSettled(
    subscriptions.map(async (subscription) => {
      try {
        await webpush.sendNotification(subscription, payload);
        return { ok: true, endpoint: subscription.endpoint };
      } catch (error) {
        const statusCode =
          typeof error === "object" && error && "statusCode" in error
            ? Number(error.statusCode)
            : 500;

        if ((statusCode === 404 || statusCode === 410) && secret) {
          await deleteExpiredSubscription(subscription.endpoint, secret);
        }

        throw error;
      }
    })
  );

  const sent = results.filter((result) => result.status === "fulfilled").length;
  const failed = results.length - sent;

  if (sent === 0) {
    console.error("Latest moment push failed for every subscription:", results);
    return NextResponse.json(
      { error: "碎碎念推送失败，没有设备成功收到。", sent, failed },
      { status: 502 }
    );
  }

  return NextResponse.json({
    ok: true,
    momentId: moment.id,
    mode: isSingleDeviceTest ? "single" : "saved-subscriptions",
    total: subscriptions.length,
    sent,
    failed,
  });
}
