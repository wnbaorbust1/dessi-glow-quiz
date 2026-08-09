import { getSupabaseServer } from "@/lib/supabase/server";
import AmbassadorManager from "./AmbassadorManager";

export default async function AdminAmbassadorsPage() {
  const supabase = getSupabaseServer();

  if (!supabase) {
    return (
      <div className="rounded-md px-6 py-8 text-center" style={{ background: "rgba(198,160,107,0.06)", border: "1px solid rgba(198,160,107,0.2)" }}>
        <p className="text-sm" style={{ color: "#8a7a6e" }}>Supabase not configured.</p>
      </div>
    );
  }

  const { data: ambassadors } = await supabase
    .from("ambassadors")
    .select("*")
    .order("created_at", { ascending: false });

  // Get lead counts and reward summaries per ambassador
  const { data: leads } = await supabase
    .from("leads")
    .select("ambassador_id, booking_clicked")
    .not("ambassador_id", "is", null);

  const { data: rewards } = await supabase
    .from("ambassador_rewards")
    .select("ambassador_id, amount, paid");

  const leadsByAmb: Record<string, { total: number; booked: number }> = {};
  (leads ?? []).forEach(({ ambassador_id, booking_clicked }) => {
    if (!ambassador_id) return;
    if (!leadsByAmb[ambassador_id]) leadsByAmb[ambassador_id] = { total: 0, booked: 0 };
    leadsByAmb[ambassador_id].total += 1;
    if (booking_clicked) leadsByAmb[ambassador_id].booked += 1;
  });

  const rewardsByAmb: Record<string, { owed: number; paid: number }> = {};
  (rewards ?? []).forEach(({ ambassador_id, amount, paid }) => {
    if (!rewardsByAmb[ambassador_id]) rewardsByAmb[ambassador_id] = { owed: 0, paid: 0 };
    if (paid) rewardsByAmb[ambassador_id].paid += Number(amount);
    else rewardsByAmb[ambassador_id].owed += Number(amount);
  });

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl" style={{ color: "#f3e3d5" }}>Ambassadors</h1>
      <AmbassadorManager
        ambassadors={ambassadors ?? []}
        leadsByAmb={leadsByAmb}
        rewardsByAmb={rewardsByAmb}
      />
    </div>
  );
}
