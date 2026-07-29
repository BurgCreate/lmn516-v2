import { NextResponse } from "next/server";
import type webpush from "web-push";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SubscribeRequest = {
  subscription?: webpush.PushSubscription;
};

const WP_URL =
  process.env.WORDPRESS_URL ||
  "https://cms.lmn516.com";

export async function POST(request: Request) {
  const secret = process.env.LMN516_PUSH_API_SECRET;

  if (!secret) {
    return NextResponse.json(
      { error: "服务器尚未配置 LMN516_PUSH_API_SECRET。" },
      { status: 503 }
    );
  }

  let body: SubscribeRequest;

  try {
    body = (await request.json()) as SubscribeRequest;
  } catch {
    return NextResponse.json(
      { error: "请求内容无效。" },
      { status: 400 }
    );
  }

  if (
    !body.subscription?.endpoint ||
    !body.subscription.keys?.p256dh ||
    !body.subscription.keys?.auth
  ) {
    return NextResponse.json(
      { error: "缺少有效的推送订阅。" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${WP_URL}/wp-json/lmn516/v1/push/subscriptions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-LMN516-Push-Secret": secret,
        },
        body: JSON.stringify({
          subscription: body.subscription,
        }),
        cache: "no-store",
      }
    );

    const result = (await response.json().catch(() => null)) as
      | {
          ok?: boolean;
          action?: "created" | "updated";
          subscriptionId?: number;
          message?: string;
          code?: string;
        }
      | null;

    if (!response.ok || !result?.ok) {
      console.error("WordPress subscription save failed:", {
        status: response.status,
        result,
      });

      return NextResponse.json(
        {
          error:
            result?.message ||
            "WordPress 未能保存推送订阅。",
        },
        { status: response.status || 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      action: result.action,
      subscriptionId: result.subscriptionId,
    });
  } catch (error) {
    console.error("Push subscription proxy failed:", error);

    return NextResponse.json(
      { error: "无法连接 WordPress 推送订阅接口。" },
      { status: 502 }
    );
  }
}
