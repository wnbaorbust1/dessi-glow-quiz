import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServer } from "@/lib/supabase/server";
import { cookies } from "next/headers";

async function isAuthorized(): Promise<boolean> {
  const jar = await cookies();
  const session = jar.get("admin_session")?.value;
  return !!process.env.ADMIN_PASSWORD && session === process.env.ADMIN_PASSWORD;
}

const createSchema = z.object({
  name: z.string().min(1).max(100),
  ref_code: z.string().min(1).max(30).regex(/^[A-Z0-9_-]+$/, "Code must be uppercase letters/numbers"),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().max(20).optional(),
  reward_per_lead: z.number().min(0).max(10000),
  reward_per_booking: z.number().min(0).max(10000),
});

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

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, issues: parsed.error.issues }, { status: 400 });
  }

  const supabase = getSupabaseServer();
  if (!supabase) return NextResponse.json({ ok: false }, { status: 503 });

  const { data, error } = await supabase
    .from("ambassadors")
    .insert(parsed.data)
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: data.id });
}
