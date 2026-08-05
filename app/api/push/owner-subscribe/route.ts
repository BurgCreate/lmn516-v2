import { NextResponse } from "next/server";
import type webpush from "web-push";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type OwnerSubscribeRequest = {
  setupSecret?: string;
  subscription?: webpush.PushSubscription;
};

const WP_URL = process.env.WORDPRESS_URL || "https://cms.lmn516.com";

export async function POST(request: Request) {
  const apiSecret = process.env.LMN516_PUSH_API_SECRET?.trim();
  const ownerSecret = process.env.LMN516_OWNER_SETUP_SECRET?.trim();

  if (!apiSecret || !ownerSecret) {
    return NextResponse.json({ error: "服务器尚未配置站长推送密钥。" }, { status: 503 });
  }

  let body: OwnerSubscribeRequest;
  try {
    body = (await request.json()) as OwnerSubscribeRequest;
  } catch {
    return NextResponse.json({ error: "请求内容无效。" }, { status: 400 });
  }

  if (!body.setupSecret || body.setupSecret !== ownerSecret) {
    return NextResponse.json({ error: "站长绑定密码错误。" }, { status: 403 });
  }

  const subscription = body.subscription;
  if (!subscription?.endpoint || !subscription.keys?.p256dh || !subscription.keys?.auth) {
    return NextResponse.json({ error: "缺少有效的推送订阅。" }, { status: 400 });
  }

  try {
    const response = await fetch(`${WP_URL}/wp-json/lmn516/v1/push/subscriptions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-LMN516-Push-Secret": apiSecret,
      },
      body: JSON.stringify({ subscription, role: "owner" }),
      cache: "no-store",
    });

    const result = await response.json().catch(() => null);
    if (!response.ok || !result?.ok) {
      return NextResponse.json(
        { error: result?.message || "WordPress 未能保存站长设备。" },
        { status: response.status || 502 }
      );
    }

    return NextResponse.json({ ok: true, action: result.action });
  } catch (error) {
    console.error("Owner subscription save failed:", error);
    return NextResponse.json({ error: "无法连接 WordPress 推送接口。" }, { status: 502 });
  }
}
