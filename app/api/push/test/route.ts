import { NextResponse } from "next/server";
import * as webpush from "web-push";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const VAPID_PUBLIC_KEY =
  "BGjxlcfPMgoW-k0VNhMbQml2UP4tkyHFAQhbI2qPnj-H32zqhJIUH_yVC_ibKMoJKcBzl6PHa3xLU9hNi8q0dV0";

type PushRequestBody = {
  subscription?: {
    endpoint?: string;
    expirationTime?: number | null;
    keys?: {
      p256dh?: string;
      auth?: string;
    };
  };
  delaySeconds?: number;
};

function cleanEnvironmentValue(value: string | undefined) {
  return value
    ?.trim()
    .replace(/^['"]|['"]$/g, "")
    .replace(/\s+/g, "");
}

export async function POST(request: Request) {
  try {
    const privateKey = cleanEnvironmentValue(
      process.env.VAPID_PRIVATE_KEY
    );
    const subject =
      process.env.VAPID_SUBJECT?.trim().replace(/^['"]|['"]$/g, "") ||
      "mailto:hello@lmn516.com";

    if (!privateKey) {
      return NextResponse.json(
        { ok: false, error: "服务器没有读取到 VAPID_PRIVATE_KEY。" },
        { status: 503 }
      );
    }

    if (
      !subject.startsWith("mailto:") &&
      !subject.startsWith("https://")
    ) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "VAPID_SUBJECT 格式错误，必须以 mailto: 或 https:// 开头。"
        },
        { status: 500 }
      );
    }

    const body = (await request.json()) as PushRequestBody;
    const subscription = body.subscription;

    if (
      !subscription?.endpoint ||
      !subscription.keys?.p256dh ||
      !subscription.keys?.auth
    ) {
      return NextResponse.json(
        { ok: false, error: "浏览器推送订阅信息不完整，请重新开启通知。" },
        { status: 400 }
      );
    }

    if (!subscription.endpoint.startsWith("https://")) {
      return NextResponse.json(
        { ok: false, error: "推送订阅 endpoint 格式无效。" },
        { status: 400 }
      );
    }

    webpush.setVapidDetails(
      subject,
      VAPID_PUBLIC_KEY,
      privateKey
    );

    const delaySeconds = Math.min(
      Math.max(Number(body.delaySeconds) || 0, 0),
      10
    );

    if (delaySeconds > 0) {
      await new Promise((resolve) =>
        setTimeout(resolve, delaySeconds * 1000)
      );
    }

    const payload = JSON.stringify({
      title: "LMN516",
      body: "测试通知发送成功。",
      url: "/pwa-test",
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png"
    });

    await webpush.sendNotification(
      {
        endpoint: subscription.endpoint,
        expirationTime: subscription.expirationTime ?? null,
        keys: {
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth
        }
      },
      payload,
      {
        TTL: 60
      }
    );

    return NextResponse.json(
      { ok: true },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Push test failed:", error);

    const name =
      error instanceof Error ? error.name : "UnknownError";
    const message =
      error instanceof Error ? error.message : String(error);

    return NextResponse.json(
      {
        ok: false,
        error: `发送通知失败 [${name}]：${message}`
      },
      { status: 500 }
    );
  }
}
