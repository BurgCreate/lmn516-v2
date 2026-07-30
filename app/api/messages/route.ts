import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WP_URL = process.env.WORDPRESS_URL || "https://cms.lmn516.com";

type MessageRequest = {
  visitorToken?: string;
  conversationId?: string | null;
  content?: string;
};

export async function POST(request: Request) {
  const secret = process.env.LMN516_PUSH_API_SECRET?.trim();
  if (!secret) {
    return NextResponse.json({ error: "服务器尚未配置留言接口密钥。" }, { status: 503 });
  }

  let body: MessageRequest;
  try {
    body = (await request.json()) as MessageRequest;
  } catch {
    return NextResponse.json({ error: "留言内容无效。" }, { status: 400 });
  }

  const visitorToken = body.visitorToken?.trim() || "";
  const content = body.content?.trim() || "";
  const conversationId = body.conversationId?.trim() || null;

  if (!/^[a-f0-9]{48}$/.test(visitorToken)) {
    return NextResponse.json({ error: "匿名身份无效，请刷新页面后再试。" }, { status: 400 });
  }
  if (!content || content.length > 1000) {
    return NextResponse.json({ error: "留言需要在 1 到 1000 个字之间。" }, { status: 400 });
  }
  if (conversationId && !/^[a-zA-Z0-9_-]{20,80}$/.test(conversationId)) {
    return NextResponse.json({ error: "对话编号无效。" }, { status: 400 });
  }

  try {
    const response = await fetch(`${WP_URL}/wp-json/lmn516/v1/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-LMN516-Push-Secret": secret,
      },
      body: JSON.stringify({ visitorToken, conversationId, content }),
      cache: "no-store",
    });
    const result = await response.json().catch(() => null);

    if (!response.ok || !result?.ok) {
      return NextResponse.json(
        { error: result?.message || "WordPress 暂时无法保存这封留言。" },
        { status: response.status || 502 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Message proxy failed:", error);
    return NextResponse.json({ error: "暂时无法连接花园信箱。" }, { status: 502 });
  }
}
