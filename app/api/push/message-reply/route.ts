import { NextResponse } from "next/server";
import webpush from "web-push";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 15;

type ReplyPushRequest = {
  conversationId?: string;
  content?: string;
  subscription?: webpush.PushSubscription;
};

export async function POST(request: Request) {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.trim();
  const privateKey = process.env.VAPID_PRIVATE_KEY?.trim();
  const subject = process.env.VAPID_SUBJECT?.trim() || "mailto:hello@lmn516.com";
  const secret = process.env.LMN516_PUSH_API_SECRET?.trim();
  const providedSecret = request.headers.get("x-lmn516-push-secret")?.trim();

  if (!secret || !providedSecret || providedSecret !== secret) {
    return NextResponse.json({ error: "推送请求未通过验证。" }, { status: 403 });
  }

  if (!publicKey || !privateKey) {
    return NextResponse.json({ error: "服务器尚未配置 VAPID 密钥。" }, { status: 503 });
  }

  let body: ReplyPushRequest;
  try {
    body = (await request.json()) as ReplyPushRequest;
  } catch {
    return NextResponse.json({ error: "请求内容无效。" }, { status: 400 });
  }

  const subscription = body.subscription;
  if (!subscription?.endpoint || !subscription.keys?.p256dh || !subscription.keys?.auth) {
    return NextResponse.json({ error: "缺少有效的访客推送订阅。" }, { status: 400 });
  }

  const content = body.content?.trim() || "";
  const preview = content.length > 70 ? `${content.slice(0, 70)}…` : content;

  webpush.setVapidDetails(subject, publicKey, privateKey);

  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: "🌿 LMN516 回复了你",
        body: preview || "你在花园信箱里收到了一封新回信。",
        url: "/",
        icon: "/icons/icon-192.png",
        badge: "/icons/badge-96.png",
        tag: `lmn516-message-reply-${body.conversationId || Date.now()}`,
      })
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    const statusCode =
      typeof error === "object" && error && "statusCode" in error
        ? Number(error.statusCode)
        : 500;

    console.error("Message reply push failed:", error);

    return NextResponse.json(
      {
        error:
          statusCode === 404 || statusCode === 410
            ? "这位访客的推送订阅已经失效。"
            : error instanceof Error
              ? error.message
              : "回复推送发送失败。",
      },
      { status: statusCode >= 400 && statusCode < 600 ? statusCode : 500 }
    );
  }
}
