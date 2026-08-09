import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { z } from "zod";
import { cookies } from "next/headers";

async function isAuthorized(): Promise<boolean> {
  const jar = await cookies();
  const session = jar.get("admin_session")?.value;
  return !!process.env.ADMIN_PASSWORD && session === process.env.ADMIN_PASSWORD;
}

const schema = z.object({ url: z.string().url().max(2000) });

export async function POST(request: Request) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  try {
    const dataUrl = await QRCode.toDataURL(parsed.data.url, {
      width: 400,
      margin: 2,
      color: {
        dark: "#0a0a0a",
        light: "#ffffff",
      },
      errorCorrectionLevel: "M",
    });

    return NextResponse.json({ ok: true, dataUrl });
  } catch (err) {
    console.error("[qr] generation error:", err);
    return NextResponse.json({ ok: false, error: "QR generation failed" }, { status: 500 });
  }
}
