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

type WebPushError = Error & {
  statusCode?: number;
  headers?: Record<string, string | string[] | undefined>;
  body?: string;
  endpoint?: string;
};

function cleanValue(value: string | undefined) {
  return value
    ?.trim()
    .replace(/^['"]|['"]$/g, "")
    .replace(/\s+/g, "");
}

function safeEndpoint(endpoint: string | undefined) {
  if (!endpoint) return null;

  try {
    const url = new URL(endpoint);
    return `${url.protocol}//${url.host}${url.pathname.slice(0, 24)}…`;
  } catch {
    return "invalid-endpoint";
  }
}

export async function POST(request: Request) {
  let stage = "开始处理请求";

  try {
    stage = "读取 VAPID 环境变量";

    const privateKey = cleanValue(process.env.VAPID_PRIVATE_KEY);
    const subject =
      process.env.VAPID_SUBJECT?.trim().replace(/^['"]|['"]$/g, "") ||
      "mailto:hello@lmn516.com";

    if (!privateKey) {
      return NextResponse.json(
        {
          ok: false,
          stage,
          error: "服务器没有读取到 VAPID_PRIVATE_KEY。",
          debug: {
            hasPrivateKey: false,
            hasSubject: Boolean(subject),
            nodeEnv: process.env.NODE_ENV
          }
        },
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
          stage,
          error: "VAPID_SUBJECT 格式错误。",
          debug: {
            subjectPrefix: subject.split(":")[0] || null
          }
        },
        { status: 500 }
      );
    }

    stage = "解析浏览器订阅信息";

    const body = (await request.json()) as PushRequestBody;
    const subscription = body.subscription;

    if (
      !subscription?.endpoint ||
      !subscription.keys?.p256dh ||
      !subscription.keys?.auth
    ) {
      return NextResponse.json(
        {
          ok: false,
          stage,
          error: "浏览器推送订阅信息不完整，请重新开启通知。",
          debug: {
            hasEndpoint: Boolean(subscription?.endpoint),
            hasP256dh: Boolean(subscription?.keys?.p256dh),
            hasAuth: Boolean(subscription?.keys?.auth)
          }
        },
        { status: 400 }
      );
    }

    stage = "校验订阅 endpoint";

    try {
      const endpointUrl = new URL(subscription.endpoint);

      if (endpointUrl.protocol !== "https:") {
        throw new Error("endpoint 不是 HTTPS 地址。");
      }
    } catch (error) {
      return NextResponse.json(
        {
          ok: false,
          stage,
          error:
            error instanceof Error
              ? error.message
              : "订阅 endpoint 格式无效。",
          debug: {
            endpoint: safeEndpoint(subscription.endpoint)
          }
        },
        { status: 400 }
      );
    }

    stage = "配置 VAPID 密钥";

    try {
      webpush.setVapidDetails(
        subject,
        VAPID_PUBLIC_KEY,
        privateKey
      );
    } catch (error) {
      const detail =
        error instanceof Error ? error.message : String(error);

      return NextResponse.json(
        {
          ok: false,
          stage,
          error: `VAPID 配置失败：${detail}`,
          debug: {
            errorName:
              error instanceof Error ? error.name : "UnknownError",
            publicKeyLength: VAPID_PUBLIC_KEY.length,
            privateKeyLength: privateKey.length,
            subject
          }
        },
        { status: 500 }
      );
    }

    const delaySeconds = Math.min(
      Math.max(Number(body.delaySeconds) || 0, 0),
      10
    );

    if (delaySeconds > 0) {
      stage = "等待测试延迟";

      await new Promise((resolve) =>
        setTimeout(resolve, delaySeconds * 1000)
      );
    }

    stage = "调用 Web Push 服务";

    const payload = JSON.stringify({
      title: "LMN516",
      body: "测试通知发送成功。",
      url: "/pwa-test",
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png"
    });

    const response = await webpush.sendNotification(
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
      {
        ok: true,
        stage: "发送完成",
        debug: {
          statusCode: response.statusCode,
          endpoint: safeEndpoint(subscription.endpoint)
        }
      },
      {
        headers: {
          "Cache-Control": "no-store"
        }
      }
    );
  } catch (error) {
    const pushError = error as WebPushError;

    console.error("Push test failed:", {
      stage,
      name: pushError?.name,
      message: pushError?.message,
      statusCode: pushError?.statusCode,
      body: pushError?.body,
      endpoint: safeEndpoint(pushError?.endpoint),
      stack: pushError?.stack
    });

    return NextResponse.json(
      {
        ok: false,
        stage,
        error: `发送通知失败 [${pushError?.name || "UnknownError"}]：${
          pushError?.message || String(error)
        }`,
        debug: {
          statusCode: pushError?.statusCode ?? null,
          responseBody: pushError?.body ?? null,
          endpoint: safeEndpoint(pushError?.endpoint),
          hasHeaders: Boolean(pushError?.headers)
        }
      },
      { status: 500 }
    );
  }
}
