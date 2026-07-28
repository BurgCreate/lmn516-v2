import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.trim();

  if (!publicKey) {
    return NextResponse.json(
      { ok: false, error: "服务器没有读取到 VAPID 公钥。" },
      { status: 503 }
    );
  }

  return NextResponse.json(
    { ok: true, publicKey },
    { headers: { "Cache-Control": "no-store" } }
  );
}
