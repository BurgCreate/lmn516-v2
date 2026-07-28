import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

  if (!publicKey) {
    return NextResponse.json(
      {
        ok: false,
        error: "服务器没有读取到 NEXT_PUBLIC_VAPID_PUBLIC_KEY。"
      },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store"
        }
      }
    );
  }

  return NextResponse.json(
    {
      ok: true,
      publicKey
    },
    {
      headers: {
        "Cache-Control": "no-store"
      }
    }
  );
}
