import { getSupabaseServer } from "@/lib/supabase/server";
import LeadsTable from "./LeadsTable";

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; temp?: string; status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const supabase = getSupabaseServer();

  if (!supabase) {
    return (
      <div className="rounded-md px-6 py-8 text-center" style={{ background: "rgba(198,160,107,0.06)", border: "1px solid rgba(198,160,107,0.2)" }}>
        <p className="text-sm" style={{ color: "#8a7a6e" }}>Supabase not configured.</p>
      </div>
    );
  }

  const page = Math.max(1, parseInt(params.page ?? "1"));
  const perPage = 50;
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = supabase
    .from("leads")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (params.q) {
    query = query.or(
      `first_name.ilike.%${params.q}%,email.ilike.%${params.q}%`
    );
  }
  if (params.temp) {
    query = query.eq("lead_temp", params.temp);
  }
  if (params.status) {
    query = query.eq("status", params.status);
  }

  const { data: leads, count } = await query;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-3xl" style={{ color: "#f3e3d5" }}>
          Leads{count != null ? ` (${count})` : ""}
        </h1>
        <a
          href="/api/admin/leads/export"
          download
          className="rounded-sm px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-opacity hover:opacity-80"
          style={{ border: "1px solid rgba(198,160,107,0.3)", color: "#c6a06b" }}
        >
          Export CSV
        </a>
      </div>

      <LeadsTable
        leads={leads ?? []}
        total={count ?? 0}
        page={page}
        perPage={perPage}
        currentQ={params.q ?? ""}
        currentTemp={params.temp ?? ""}
        currentStatus={params.status ?? ""}
      />
    </div>
  );
}
