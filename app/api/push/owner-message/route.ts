import { NextResponse } from "next/server";
import webpush from "web-push";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 15;

const WP_URL = process.env.WORDPRESS_URL || "https://cms.lmn516.com";

type OwnerMessageRequest = {
  conversationId?: string;
  content?: string;
};

type StoredSubscription = {
  endpoint?: string;
  p256dh?: string;
  auth?: string;
  expiration_time?: number | string | null;
};

export async function POST(request: Request) {
  const apiSecret = process.env.LMN516_PUSH_API_SECRET?.trim();
  const providedSecret = request.headers.get("x-lmn516-push-secret")?.trim();
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.trim();
  const privateKey = process.env.VAPID_PRIVATE_KEY?.trim();
  const subject = process.env.VAPID_SUBJECT?.trim() || "mailto:hello@lmn516.com";
  const inboxUrl =
    process.env.LMN516_OWNER_INBOX_URL?.trim() ||
    `${WP_URL}/wp-admin/admin.php?page=lmn516-garden-mailbox`;

  if (!apiSecret || !providedSecret || providedSecret !== apiSecret) {
    return NextResponse.json({ error: "推送请求未通过验证。" }, { status: 403 });
  }
  if (!publicKey || !privateKey) {
    return NextResponse.json({ error: "服务器尚未配置 VAPID 密钥。" }, { status: 503 });
  }

  let body: OwnerMessageRequest;
  try {
    body = (await request.json()) as OwnerMessageRequest;
  } catch {
    return NextResponse.json({ error: "请求内容无效。" }, { status: 400 });
  }

  const content = body.content?.trim() || "";
  const conversationId = body.conversationId?.trim() || "";
  const preview = content.length > 80 ? `${content.slice(0, 80)}…` : content;

  webpush.setVapidDetails(subject, publicKey, privateKey);

  try {
    const listResponse = await fetch(
      `${WP_URL}/wp-json/lmn516/v1/push/subscriptions?role=owner`,
      {
        headers: { "X-LMN516-Push-Secret": apiSecret },
        cache: "no-store",
      }
    );
    const listResult = await listResponse.json().catch(() => null);
    if (!listResponse.ok || !listResult?.ok) {
      return NextResponse.json(
        { error: listResult?.message || "无法读取站长推送设备。" },
        { status: listResponse.status || 502 }
      );
    }

    const subscriptions = (listResult.subscriptions || []) as StoredSubscription[];
    let sent = 0;
    let removed = 0;
    let failed = 0;

    for (const item of subscriptions) {
      if (!item.endpoint || !item.p256dh || !item.auth) {
        failed += 1;
        continue;
      }

      const subscription: webpush.PushSubscription = {
        endpoint: item.endpoint,
        expirationTime:
          item.expiration_time === null || item.expiration_time === undefined
            ? null
            : Number(item.expiration_time),
        keys: { p256dh: item.p256dh, auth: item.auth },
      };

      try {
        await webpush.sendNotification(
          subscription,
          JSON.stringify({
            title: "花园收到一封新信",
            body: preview || "有人给你留下了一封新信。",
            url: inboxUrl,
            icon: "/icons/icon-192.png",
            badge: "/icons/badge-96.png",
            tag: `lmn516-owner-message-${conversationId || Date.now()}`,
          })
        );
        sent += 1;
      } catch (error) {
        const statusCode =
          typeof error === "object" && error && "statusCode" in error
            ? Number(error.statusCode)
            : 0;

        if (statusCode === 404 || statusCode === 410) {
          const deleteResponse = await fetch(`${WP_URL}/wp-json/lmn516/v1/push/subscriptions`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "X-LMN516-Push-Secret": apiSecret,
            },
            body: JSON.stringify({ endpoint: item.endpoint }),
            cache: "no-store",
          });
          if (deleteResponse.ok) removed += 1;
        } else {
          failed += 1;
          console.error("Owner push send failed:", error);
        }
      }
    }

    return NextResponse.json({ ok: true, total: subscriptions.length, sent, removed, failed });
  } catch (error) {
    console.error("Owner push pipeline failed:", error);
    return NextResponse.json({ error: "站长推送发送失败。" }, { status: 502 });
  }
}
