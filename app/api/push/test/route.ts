import { NextResponse } from "next/server";
import webpush from "web-push";

export const runtime = "nodejs";
export const maxDuration = 15;

type PushRequest = {
  subscription?: webpush.PushSubscription;
  delaySeconds?: number;
};

function sleep(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
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
    return NextResponse.json({ error: "请求内容无效。" }, { status: 400 });
  }

  if (!body.subscription?.endpoint || !body.subscription.keys) {
    return NextResponse.json({ error: "缺少有效的推送订阅。" }, { status: 400 });
  }

  const delaySeconds = Math.min(Math.max(Number(body.delaySeconds) || 5, 0), 8);

  webpush.setVapidDetails(subject, publicKey, privateKey);

  try {
    if (delaySeconds > 0) {
      await sleep(delaySeconds * 1000);
    }

    await webpush.sendNotification(
      body.subscription,
      JSON.stringify({
        title: "LMN516 · PWA 测试成功",
        body: "这是一条由服务器发送到 iPhone 的真实推送通知。",
        url: "/pwa-test",
        icon: "/icons/icon-192.png",
        badge: "/icons/badge-96.png",
        tag: `lmn516-test-${Date.now()}`
      })
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    const statusCode =
      typeof error === "object" && error && "statusCode" in error
        ? Number(error.statusCode)
        : 500;

    console.error("Web Push test failed:", error);

    return NextResponse.json(
      {
        error:
          statusCode === 404 || statusCode === 410
            ? "这条订阅已失效，请重新开启通知。"
            : "推送发送失败，请检查 VAPID 配置或设备订阅。"
      },
      { status: statusCode >= 400 && statusCode < 600 ? statusCode : 500 }
    );
  }
}
