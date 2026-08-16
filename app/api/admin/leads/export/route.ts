import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { cookies } from "next/headers";

async function isAuthorized(): Promise<boolean> {
  const jar = await cookies();
  const session = jar.get("admin_session")?.value;
  return !!process.env.ADMIN_PASSWORD && session === process.env.ADMIN_PASSWORD;
}

function escapeCsv(val: unknown): string {
  const s = val == null ? "" : String(val);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export async function GET() {
  if (!(await isAuthorized())) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const supabase = getSupabaseServer();
  if (!supabase) return new NextResponse("Supabase not configured", { status: 503 });

  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  const headers = [
    "Name", "Email", "Phone", "ZIP", "Dollhouse Match", "Service Interest",
    "Temperature", "Source", "UTM Source", "UTM Medium", "UTM Campaign",
    "Ref Code", "Date", "Booking Clicked", "Marketing Consent", "Status", "Notes",
  ];

  const rows = (leads ?? []).map((l) =>
    [
      l.first_name,
      l.email,
      l.phone,
      l.zip,
      l.dollhouse_result,
      l.service_interest,
      l.lead_temp,
      l.lead_source,
      l.utm_source,
      l.utm_medium,
      l.utm_campaign,
      l.ref_code,
      l.created_at,
      l.booking_clicked ? "Yes" : "No",
      l.marketing_consent ? "Yes" : "No",
      l.status,
      l.notes,
    ].map(escapeCsv).join(",")
  );

  const csv = [headers.join(","), ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="dessi-dollhouse-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
