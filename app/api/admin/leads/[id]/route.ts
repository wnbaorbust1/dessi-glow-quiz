import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServer } from "@/lib/supabase/server";
import { cookies } from "next/headers";

async function isAuthorized(): Promise<boolean> {
  const jar = await cookies();
  const session = jar.get("admin_session")?.value;
  return !!process.env.ADMIN_PASSWORD && session === process.env.ADMIN_PASSWORD;
}

const patchSchema = z.object({
  status: z
    .enum(["new", "contacted", "consultation_scheduled", "booked", "not_ready", "follow_up_later"])
    .optional(),
  notes: z.string().max(5000).optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const { id } = await params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const supabase = getSupabaseServer();
  if (!supabase) return NextResponse.json({ ok: false }, { status: 503 });

  const { error } = await supabase.from("leads").update(parsed.data).eq("id", id);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
