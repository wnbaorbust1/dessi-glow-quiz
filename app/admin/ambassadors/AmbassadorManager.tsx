"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Copy } from "lucide-react";
import type { Database } from "@/lib/supabase/types";

type Ambassador = Database["public"]["Tables"]["ambassadors"]["Row"];

interface Props {
  ambassadors: Ambassador[];
  leadsByAmb: Record<string, { total: number; booked: number }>;
  rewardsByAmb: Record<string, { owed: number; paid: number }>;
}

export default function AmbassadorManager({ ambassadors, leadsByAmb, rewardsByAmb }: Props) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    ref_code: "",
    email: "",
    phone: "",
    reward_per_lead: "5",
    reward_per_booking: "25",
  });
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState("");

  function copyLink(refCode: string) {
    const url = `${window.location.origin}/glow-quiz?ref=${refCode}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(refCode);
      setTimeout(() => setCopied(""), 2000);
    });
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch("/api/admin/ambassadors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          ref_code: form.ref_code.toUpperCase(),
          reward_per_lead: parseFloat(form.reward_per_lead),
          reward_per_booking: parseFloat(form.reward_per_booking),
        }),
      });
      setShowForm(false);
      setForm({ name: "", ref_code: "", email: "", phone: "", reward_per_lead: "5", reward_per_booking: "25" });
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => setShowForm((v) => !v)}
        className="flex items-center gap-2 rounded-sm px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-80"
        style={{ background: "rgba(193,126,108,0.15)", border: "1px solid rgba(193,126,108,0.3)", color: "#c17e6c" }}
      >
        <Plus size={15} />
        {showForm ? "Cancel" : "Add Ambassador"}
      </button>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="grid gap-4 rounded-md p-6 sm:grid-cols-2"
          style={{ background: "#141414", border: "1px solid rgba(198,160,107,0.2)" }}
        >
          <h2 className="col-span-2 font-serif text-lg" style={{ color: "#f3e3d5" }}>New Ambassador</h2>
          {[
            { id: "name", label: "Name *", required: true },
            { id: "ref_code", label: "Referral Code *", required: true, placeholder: "e.g. DESTINY25" },
            { id: "email", label: "Email" },
            { id: "phone", label: "Phone" },
            { id: "reward_per_lead", label: "Reward Per Lead ($)", type: "number" },
            { id: "reward_per_booking", label: "Reward Per Booking ($)", type: "number" },
          ].map(({ id, label, required, placeholder, type }) => (
            <div key={id}>
              <label className="mb-1 block text-xs font-semibold" style={{ color: "#8a7a6e" }}>{label}</label>
              <input
                type={type ?? "text"}
                value={form[id as keyof typeof form]}
                onChange={(e) => setForm((p) => ({ ...p, [id]: e.target.value }))}
                required={required}
                placeholder={placeholder}
                className="w-full rounded-sm px-3 py-2 text-sm"
                style={{ background: "#0a0a0a", border: "1px solid rgba(198,160,107,0.25)", color: "#f3e3d5" }}
              />
            </div>
          ))}
          <div className="col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-sm px-6 py-2.5 text-sm font-semibold disabled:opacity-60"
              style={{ background: "var(--color-rose)", color: "#f3e3d5" }}
            >
              {saving ? "Creating…" : "Create Ambassador"}
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-md" style={{ border: "1px solid rgba(198,160,107,0.15)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "#141414", borderBottom: "1px solid rgba(198,160,107,0.15)" }}>
              {["Ambassador", "Code", "Quiz Leads", "Booking Clicks", "Rewards Owed", "Rewards Paid", "Link"].map((h) => (
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
            {ambassadors.length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-sm" style={{ color: "#8a7a6e" }}>
                  No ambassadors yet.
                </td>
              </tr>
            )}
            {ambassadors.map((amb) => {
              const l = leadsByAmb[amb.id] ?? { total: 0, booked: 0 };
              const r = rewardsByAmb[amb.id] ?? { owed: 0, paid: 0 };
              return (
                <tr key={amb.id} style={{ borderBottom: "1px solid rgba(198,160,107,0.08)", background: "rgba(10,10,10,0.4)" }}>
                  <td className="px-3 py-3" style={{ color: "#f3e3d5" }}>{amb.name}</td>
                  <td className="px-3 py-3">
                    <span
                      className="rounded-sm px-2 py-0.5 font-mono text-xs"
                      style={{ background: "rgba(167,139,250,0.1)", color: "#a78bfa" }}
                    >
                      {amb.ref_code}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center" style={{ color: "#c9c9c9" }}>{l.total}</td>
                  <td className="px-3 py-3 text-center" style={{ color: "#c9c9c9" }}>{l.booked}</td>
                  <td className="px-3 py-3 text-right" style={{ color: "#f59e0b" }}>
                    ${r.owed.toFixed(2)}
                  </td>
                  <td className="px-3 py-3 text-right" style={{ color: "#10b981" }}>
                    ${r.paid.toFixed(2)}
                  </td>
                  <td className="px-3 py-3">
                    <button
                      onClick={() => copyLink(amb.ref_code)}
                      className="flex items-center gap-1.5 text-xs transition-opacity hover:opacity-70"
                      style={{ color: copied === amb.ref_code ? "#10b981" : "#c6a06b" }}
                    >
                      <Copy size={12} />
                      {copied === amb.ref_code ? "Copied!" : "Copy link"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
