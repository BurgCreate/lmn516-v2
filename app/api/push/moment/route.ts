import { NextResponse } from "next/server";
import webpush from "web-push";
import { getLatestMomentFresh } from "@/lib/wordpress";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 15;

type PushRequest = {
  subscription?: webpush.PushSubscription;
};

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
    return "刚刚更新了一条新的碎碎念。";
  }

  return text.length > 88 ? `${text.slice(0, 88)}…` : text;
}

export async function POST(request: Request) {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || "mailto:hello@lmn516.com";

  if (!publicKey || !privateKey) {
    return NextResponse.json(
      { error: "服务器尚未配置 VAPID 密钥。" },
      { status: 503 }
    );
  }

  let body: PushRequest;

  try {
    body = (await request.json()) as PushRequest;
  } catch {
    return NextResponse.json(
      { error: "请求内容无效。" },
      { status: 400 }
    );
  }

  if (!body.subscription?.endpoint || !body.subscription.keys) {
    return NextResponse.json(
      { error: "缺少有效的推送订阅。" },
      { status: 400 }
    );
  }

  const moment = await getLatestMomentFresh();

  if (!moment) {
    return NextResponse.json(
      { error: "没有读取到最新碎碎念，请确认 WordPress 中已经发布并归入 moments 分类。" },
      { status: 404 }
    );
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);

  try {
    await webpush.sendNotification(
      body.subscription,
      JSON.stringify({
        title: "LMN516 · 新的小泡泡",
        body: notificationBody(moment.content),
        url: `/moments#moment-${moment.id}`,
        icon: "/icons/icon-192.png",
        badge: "/icons/badge-96.png",
        tag: `lmn516-moment-${moment.id}`
      })
    );

    return NextResponse.json({
      ok: true,
      momentId: moment.id
    });
  } catch (error) {
    const statusCode =
      typeof error === "object" && error && "statusCode" in error
        ? Number(error.statusCode)
        : 500;

    console.error("Latest moment push failed:", error);

    return NextResponse.json(
      {
        error:
          statusCode === 404 || statusCode === 410
            ? "这条订阅已失效，请重新开启通知。"
            : "碎碎念推送失败，请检查 VAPID 配置或设备订阅。"
      },
      {
        status:
          statusCode >= 400 && statusCode < 600
            ? statusCode
            : 500
      }
    );
  }
}
