import { getSupabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

interface Stat {
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
}

function pct(num: number, den: number) {
  if (!den) return "0%";
  return `${Math.round((num / den) * 100)}%`;
}

export default async function AdminDashboard() {
  const supabase = getSupabaseServer();

  if (!supabase) {
    return (
      <div
        className="rounded-md px-6 py-8 text-center"
        style={{ background: "rgba(198,160,107,0.06)", border: "1px solid rgba(198,160,107,0.2)" }}
      >
        <p className="font-serif text-xl" style={{ color: "#c6a06b" }}>Supabase Not Configured</p>
        <p className="mt-2 text-sm" style={{ color: "#8a7a6e" }}>
          Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment to
          enable the admin dashboard.
        </p>
      </div>
    );
  }

  // Fetch stats in parallel
  const [
    { count: totalLeads },
    { count: hotLeads },
    { count: warmLeads },
    { count: bookingClicks },
    { data: eventCounts },
    { data: serviceBreakdown },
    { data: tempBreakdown },
    { data: sourceBreakdown },
    { count: ambassadorLeads },
  ] = await Promise.all([
    supabase.from("leads").select("*", { count: "exact", head: true }),
    supabase.from("leads").select("*", { count: "exact", head: true }).eq("lead_temp", "hot"),
    supabase.from("leads").select("*", { count: "exact", head: true }).eq("lead_temp", "warm"),
    supabase.from("leads").select("*", { count: "exact", head: true }).eq("booking_clicked", true),
    supabase.from("quiz_events").select("event").then(({ data }) => ({
      data: data?.reduce(
        (acc, { event }) => {
          acc[event] = (acc[event] ?? 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      ),
    })),
    supabase.from("leads").select("service_interest").then(({ data }) => {
      const counts: Record<string, number> = {};
      data?.forEach(({ service_interest }) => {
        counts[service_interest] = (counts[service_interest] ?? 0) + 1;
      });
      return {
        data: Object.entries(counts).sort(([, a], [, b]) => b - a).map(([k, v]) => ({ key: k, count: v })),
      };
    }),
    supabase.from("leads").select("lead_temp").then(({ data }) => {
      const counts: Record<string, number> = {};
      data?.forEach(({ lead_temp }) => {
        counts[lead_temp] = (counts[lead_temp] ?? 0) + 1;
      });
      return { data: counts };
    }),
    supabase.from("leads").select("lead_source").then(({ data }) => {
      const counts: Record<string, number> = {};
      data?.forEach(({ lead_source }) => {
        const src = lead_source ?? "direct";
        counts[src] = (counts[src] ?? 0) + 1;
      });
      return {
        data: Object.entries(counts).sort(([, a], [, b]) => b - a).map(([k, v]) => ({ key: k, count: v })),
      };
    }),
    supabase.from("leads").select("*", { count: "exact", head: true }).not("ambassador_id", "is", null),
  ]);

  const starts = (eventCounts as Record<string, number> | undefined)?.quiz_start ?? 0;
  const completions = (eventCounts as Record<string, number> | undefined)?.lead_submitted ?? 0;
  const views = (eventCounts as Record<string, number> | undefined)?.landing_view ?? 0;

  const stats: Stat[] = [
    { label: "Total Leads", value: totalLeads ?? 0, color: "#c6a06b" },
    { label: "Hot Leads", value: hotLeads ?? 0, sub: "Ready now", color: "#ef4444" },
    { label: "Warm Leads", value: warmLeads ?? 0, sub: "Within 30 days", color: "#f59e0b" },
    { label: "Quiz Starts", value: starts, color: "#c6a06b" },
    { label: "Completions", value: completions, color: "#c6a06b" },
    {
      label: "Completion Rate",
      value: pct(completions, starts),
      sub: "Starts → Leads",
      color: "#10b981",
    },
    { label: "Booking Clicks", value: bookingClicks ?? 0, color: "#c6a06b" },
    {
      label: "Booking Click Rate",
      value: pct(bookingClicks ?? 0, totalLeads ?? 0),
      sub: "Leads → Booking",
      color: "#10b981",
    },
    { label: "Ambassador Leads", value: ambassadorLeads ?? 0, color: "#a78bfa" },
  ];

  const tempColors: Record<string, string> = {
    hot: "#ef4444",
    warm: "#f59e0b",
    nurture: "#10b981",
    education: "#6366f1",
  };

  return (
    <div className="space-y-8">
      <h1 className="font-serif text-3xl" style={{ color: "#f3e3d5" }}>Dashboard</h1>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-md p-4"
            style={{ background: "#141414", border: "1px solid rgba(198,160,107,0.15)" }}
          >
            <p className="text-xs uppercase tracking-wide" style={{ color: "#8a7a6e" }}>
              {s.label}
            </p>
            <p className="mt-1 font-serif text-3xl font-bold" style={{ color: s.color ?? "#f3e3d5" }}>
              {s.value}
            </p>
            {s.sub && (
              <p className="mt-0.5 text-xs" style={{ color: "#8a7a6e" }}>
                {s.sub}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Funnel */}
      <div
        className="rounded-md p-6"
        style={{ background: "#141414", border: "1px solid rgba(198,160,107,0.15)" }}
      >
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest" style={{ color: "#c6a06b" }}>
          Quiz Funnel
        </h2>
        <div className="space-y-3">
          {[
            { label: "Landing Views", value: views },
            { label: "Quiz Starts", value: starts, rate: pct(starts, views) },
            { label: "Completions (Leads)", value: completions, rate: pct(completions, starts) },
            { label: "Booking Clicks", value: bookingClicks ?? 0, rate: pct(bookingClicks ?? 0, completions) },
          ].map(({ label, value, rate }) => (
            <div key={label} className="flex items-center gap-4">
              <div
                className="h-2 rounded-full"
                style={{
                  width: `${Math.min(100, views ? (value / views) * 100 : 0)}%`,
                  background: "linear-gradient(90deg, #c17e6c, #c6a06b)",
                  minWidth: 4,
                }}
              />
              <span className="text-sm min-w-0" style={{ color: "#c9c9c9" }}>
                {label}:{" "}
                <strong style={{ color: "#f3e3d5" }}>{value}</strong>
                {rate && (
                  <span className="ml-2 text-xs" style={{ color: "#8a7a6e" }}>
                    ({rate})
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Service breakdown */}
        <div
          className="rounded-md p-6"
          style={{ background: "#141414", border: "1px solid rgba(198,160,107,0.15)" }}
        >
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest" style={{ color: "#c6a06b" }}>
            By Service
          </h2>
          <div className="space-y-2">
            {(serviceBreakdown ?? []).slice(0, 10).map(({ key, count }) => (
              <div key={key} className="flex items-center justify-between text-sm">
                <span style={{ color: "#c9c9c9" }}>{key}</span>
                <span className="font-semibold" style={{ color: "#f3e3d5" }}>
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Lead temp breakdown */}
        <div
          className="rounded-md p-6"
          style={{ background: "#141414", border: "1px solid rgba(198,160,107,0.15)" }}
        >
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest" style={{ color: "#c6a06b" }}>
            By Temperature
          </h2>
          <div className="space-y-2">
            {Object.entries(tempBreakdown ?? {}).map(([temp, count]) => (
              <div key={temp} className="flex items-center justify-between text-sm">
                <span
                  className="rounded-sm px-2 py-0.5 text-xs"
                  style={{ background: `${tempColors[temp]}22`, color: tempColors[temp] ?? "#c9c9c9" }}
                >
                  {temp}
                </span>
                <span className="font-semibold" style={{ color: "#f3e3d5" }}>
                  {count as number}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Source breakdown */}
        <div
          className="rounded-md p-6"
          style={{ background: "#141414", border: "1px solid rgba(198,160,107,0.15)" }}
        >
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest" style={{ color: "#c6a06b" }}>
            By Source
          </h2>
          <div className="space-y-2">
            {(sourceBreakdown ?? []).slice(0, 10).map(({ key, count }) => (
              <div key={key} className="flex items-center justify-between text-sm">
                <span style={{ color: "#c9c9c9" }}>{key || "direct"}</span>
                <span className="font-semibold" style={{ color: "#f3e3d5" }}>
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
