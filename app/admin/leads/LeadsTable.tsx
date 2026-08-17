"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Database } from "@/lib/supabase/types";

type Lead = Database["public"]["Tables"]["leads"]["Row"];

const STATUSES = [
  "new",
  "contacted",
  "consultation_scheduled",
  "booked",
  "not_ready",
  "follow_up_later",
] as const;

const TEMP_COLORS: Record<string, string> = {
  hot: "#ef4444",
  warm: "#f59e0b",
  nurture: "#10b981",
  education: "#6366f1",
  unknown: "#8a8a8a",
};

interface Props {
  leads: Lead[];
  total: number;
  page: number;
  perPage: number;
  currentQ: string;
  currentTemp: string;
  currentStatus: string;
}

export default function LeadsTable({
  leads,
  total,
  page,
  perPage,
  currentQ,
  currentTemp,
  currentStatus,
}: Props) {
  const router = useRouter();
  const [search, setSearch] = useState(currentQ);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const totalPages = Math.ceil(total / perPage);

  function applyFilters(overrides: Record<string, string>) {
    const params = new URLSearchParams();
    const q = overrides.q ?? search;
    const temp = overrides.temp ?? currentTemp;
    const status = overrides.status ?? currentStatus;
    const pg = overrides.page ?? "1";
    if (q) params.set("q", q);
    if (temp) params.set("temp", temp);
    if (status) params.set("status", status);
    if (pg !== "1") params.set("page", pg);
    router.push(`/admin/leads?${params.toString()}`);
  }

  async function updateStatus(id: string, status: string) {
    setUpdatingId(id);
    try {
      await fetch(`/api/admin/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      router.refresh();
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="search"
          placeholder="Search name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && applyFilters({ q: search })}
          className="rounded-sm px-3 py-2 text-sm"
          style={{
            background: "#141414",
            border: "1px solid rgba(198,160,107,0.25)",
            color: "#f3e3d5",
            width: 220,
          }}
        />
        <select
          value={currentTemp}
          onChange={(e) => applyFilters({ temp: e.target.value })}
          className="rounded-sm px-3 py-2 text-sm"
          style={{ background: "#141414", border: "1px solid rgba(198,160,107,0.25)", color: "#c9c9c9" }}
        >
          <option value="">All temperatures</option>
          <option value="hot">Hot</option>
          <option value="warm">Warm</option>
          <option value="nurture">Nurture</option>
          <option value="education">Education</option>
          <option value="unknown">Unknown</option>
        </select>
        <select
          value={currentStatus}
          onChange={(e) => applyFilters({ status: e.target.value })}
          className="rounded-sm px-3 py-2 text-sm"
          style={{ background: "#141414", border: "1px solid rgba(198,160,107,0.25)", color: "#c9c9c9" }}
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-md" style={{ border: "1px solid rgba(198,160,107,0.15)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "#141414", borderBottom: "1px solid rgba(198,160,107,0.15)" }}>
              {[
                "Name", "Email", "Phone", "ZIP", "Dollhouse Match", "Service",
                "Temp", "Source", "Date", "Booked", "Status",
              ].map((h) => (
                <th
                  key={h}
                  className="whitespace-nowrap px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "#8a7a6e" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 && (
              <tr>
                <td colSpan={11} className="px-3 py-8 text-center text-sm" style={{ color: "#8a7a6e" }}>
                  No leads found.
                </td>
              </tr>
            )}
            {leads.map((lead) => (
              <tr
                key={lead.id}
                style={{
                  borderBottom: "1px solid rgba(198,160,107,0.08)",
                  background: "rgba(10,10,10,0.4)",
                }}
              >
                <td className="px-3 py-3 font-medium" style={{ color: "#f3e3d5" }}>
                  {lead.first_name}
                </td>
                <td className="px-3 py-3" style={{ color: "#c9c9c9" }}>
                  <a href={`mailto:${lead.email}`} className="hover:underline" style={{ color: "#c6a06b" }}>
                    {lead.email}
                  </a>
                </td>
                <td className="px-3 py-3" style={{ color: "#c9c9c9" }}>
                  {lead.phone ?? "—"}
                </td>
                <td className="px-3 py-3" style={{ color: "#c9c9c9" }}>
                  {lead.zip ?? "—"}
                </td>
                <td className="whitespace-nowrap px-3 py-3" style={{ color: "#c9c9c9" }}>
                  {lead.dollhouse_result.replace(/_/g, " ")}
                </td>
                <td className="whitespace-nowrap px-3 py-3" style={{ color: "#c9c9c9" }}>
                  {lead.service_interest}
                </td>
                <td className="px-3 py-3">
                  <span
                    className="rounded-sm px-2 py-0.5 text-xs font-semibold"
                    style={{
                      background: `${TEMP_COLORS[lead.lead_temp] ?? "#8a7a6e"}22`,
                      color: TEMP_COLORS[lead.lead_temp] ?? "#8a7a6e",
                    }}
                  >
                    {lead.lead_temp}
                  </span>
                </td>
                <td className="px-3 py-3 text-xs" style={{ color: "#8a7a6e" }}>
                  {lead.lead_source ?? "direct"}
                  {lead.ref_code && (
                    <span className="ml-1" style={{ color: "#a78bfa" }}>
                      [{lead.ref_code}]
                    </span>
                  )}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-xs" style={{ color: "#8a7a6e" }}>
                  {new Date(lead.created_at).toLocaleDateString()}
                </td>
                <td className="px-3 py-3 text-center text-xs">
                  {lead.booking_clicked ? (
                    <span style={{ color: "#10b981" }}>✓</span>
                  ) : (
                    <span style={{ color: "#8a7a6e" }}>—</span>
                  )}
                </td>
                <td className="px-3 py-3">
                  <select
                    value={lead.status}
                    onChange={(e) => updateStatus(lead.id, e.target.value)}
                    disabled={updatingId === lead.id}
                    className="rounded-sm px-2 py-1 text-xs"
                    style={{
                      background: "#141414",
                      border: "1px solid rgba(198,160,107,0.2)",
                      color: "#c9c9c9",
                    }}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs" style={{ color: "#8a7a6e" }}>
            Page {page} of {totalPages} · {total} total
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <button
                onClick={() => applyFilters({ page: String(page - 1) })}
                className="rounded-sm px-3 py-1.5 text-xs"
                style={{ border: "1px solid rgba(198,160,107,0.25)", color: "#c9c9c9" }}
              >
                ← Prev
              </button>
            )}
            {page < totalPages && (
              <button
                onClick={() => applyFilters({ page: String(page + 1) })}
                className="rounded-sm px-3 py-1.5 text-xs"
                style={{ border: "1px solid rgba(198,160,107,0.25)", color: "#c9c9c9" }}
              >
                Next →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
