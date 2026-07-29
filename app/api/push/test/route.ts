import { NextResponse } from "next/server";
import webpush from "web-push";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 15;

type PushRequest = {
  subscription?: webpush.PushSubscription;
  delaySeconds?: number;
};

function sleep(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function getEnvironmentDiagnostics() {
  const rawPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const rawPrivateKey = process.env.VAPID_PRIVATE_KEY;
  const rawSubject = process.env.VAPID_SUBJECT;

  const publicKey = rawPublicKey?.trim();
  const privateKey = rawPrivateKey?.trim();
  const subject = rawSubject?.trim() || "mailto:hello@lmn516.com";

  return {
    values: {
      publicKey,
      privateKey,
      subject,
    },
    debug: {
      publicKeyExists: Object.prototype.hasOwnProperty.call(
        process.env,
        "NEXT_PUBLIC_VAPID_PUBLIC_KEY"
      ),
      privateKeyExists: Object.prototype.hasOwnProperty.call(
        process.env,
        "VAPID_PRIVATE_KEY"
      ),
      subjectExists: Object.prototype.hasOwnProperty.call(
        process.env,
        "VAPID_SUBJECT"
      ),
      rawPublicKeyType: typeof rawPublicKey,
      rawPrivateKeyType: typeof rawPrivateKey,
      rawSubjectType: typeof rawSubject,
      rawPublicKeyLength: rawPublicKey?.length ?? 0,
      rawPrivateKeyLength: rawPrivateKey?.length ?? 0,
      rawSubjectLength: rawSubject?.length ?? 0,
      trimmedPublicKeyLength: publicKey?.length ?? 0,
      trimmedPrivateKeyLength: privateKey?.length ?? 0,
      trimmedSubjectLength: subject.length,
      publicKeyHasOuterWhitespace:
        typeof rawPublicKey === "string" && rawPublicKey !== publicKey,
      privateKeyHasOuterWhitespace:
        typeof rawPrivateKey === "string" && rawPrivateKey !== privateKey,
      subjectHasOuterWhitespace:
        typeof rawSubject === "string" && rawSubject !== rawSubject.trim(),
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV ?? null,
      vercelRegion: process.env.VERCEL_REGION ?? null,
    },
  };
}

export async function POST(request: Request) {
  const { values, debug } = getEnvironmentDiagnostics();
  const { publicKey, privateKey, subject } = values;

  if (!publicKey || !privateKey) {
    return NextResponse.json(
      {
        ok: false,
        stage: "读取 VAPID 环境变量",
        error: !privateKey
          ? "服务器没有读取到可用的 VAPID_PRIVATE_KEY。"
          : "服务器没有读取到可用的 NEXT_PUBLIC_VAPID_PUBLIC_KEY。",
        debug,
      },
      { status: 503 }
    );
  }

  let body: PushRequest;

  try {
    body = (await request.json()) as PushRequest;
  } catch {
    return NextResponse.json(
      {
        ok: false,
        stage: "解析请求内容",
        error: "请求内容无效。",
        debug,
      },
      { status: 400 }
    );
  }

  if (!body.subscription?.endpoint || !body.subscription.keys) {
    return NextResponse.json(
      {
        ok: false,
        stage: "检查推送订阅",
        error: "缺少有效的推送订阅。",
        debug,
      },
      { status: 400 }
    );
  }

  try {
    webpush.setVapidDetails(subject, publicKey, privateKey);
  } catch (error) {
    console.error("VAPID configuration failed:", error);

    return NextResponse.json(
      {
        ok: false,
        stage: "验证 VAPID 密钥",
        error:
          error instanceof Error
            ? error.message
            : "VAPID 密钥格式无效。",
        debug,
      },
      { status: 500 }
    );
  }

  const delaySeconds = Math.min(Math.max(Number(body.delaySeconds) || 5, 0), 8);

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
        tag: `lmn516-test-${Date.now()}`,
      })
    );

    return NextResponse.json({
      ok: true,
      stage: "推送发送完成",
      debug,
    });
  } catch (error) {
    const statusCode =
      typeof error === "object" && error && "statusCode" in error
        ? Number(error.statusCode)
        : 500;

    console.error("Web Push test failed:", error);

    return NextResponse.json(
      {
        ok: false,
        stage: "发送 Web Push",
        error:
          statusCode === 404 || statusCode === 410
            ? "这条订阅已失效，请重新开启通知。"
            : error instanceof Error
              ? error.message
              : "推送发送失败，请检查 VAPID 配置或设备订阅。",
        debug,
      },
      { status: statusCode >= 400 && statusCode < 600 ? statusCode : 500 }
    );
  }
}
