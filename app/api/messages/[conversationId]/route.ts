import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WP_URL = process.env.WORDPRESS_URL || "https://cms.lmn516.com";

export async function GET(request: Request, context: { params: Promise<{ conversationId: string }> }) {
  const secret = process.env.LMN516_PUSH_API_SECRET?.trim();
  if (!secret) return NextResponse.json({ error: "服务器尚未配置留言接口密钥。" }, { status: 503 });

  const { conversationId } = await context.params;
  const visitorToken = new URL(request.url).searchParams.get("visitorToken")?.trim() || "";

  if (!/^[a-zA-Z0-9_-]{20,80}$/.test(conversationId) || !/^[a-f0-9]{48}$/.test(visitorToken)) {
    return NextResponse.json({ error: "对话身份无效。" }, { status: 400 });
  }

  try {
    const url = new URL(`${WP_URL}/wp-json/lmn516/v1/messages/${encodeURIComponent(conversationId)}`);
    url.searchParams.set("visitorToken", visitorToken);
    const response = await fetch(url, {
      headers: { "X-LMN516-Push-Secret": secret },
      cache: "no-store",
    });
    const result = await response.json().catch(() => null);

    if (!response.ok || !result?.ok) {
      return NextResponse.json({ error: result?.message || "暂时无法读取这段对话。" }, { status: response.status || 502 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Message read proxy failed:", error);
    return NextResponse.json({ error: "暂时无法连接花园信箱。" }, { status: 502 });
  }
}
