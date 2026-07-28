import { NextResponse } from "next/server";

const publicKey =
  "BGjxlcfPMgoW-k0VNhMbQml2UP4tkyHFAQhbI2qPnj-H32zqhJIUH_yVC_ibKMoJKcBzl6PHa3xLU9hNi8q0dV0";

export async function GET() {
  return NextResponse.json({
    ok: true,
    publicKey,
  });
}