/** TypeScript types matching the Supabase schema in supabase/migrations/001_initial.sql */

export interface LeadRow {
  id: string;
  created_at: string;
  first_name: string;
  email: string;
  phone: string | null;
  zip: string | null;
  dollhouse_result: string;
  service_interest: string;
  lead_temp: string;
  lead_source: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  ref_code: string | null;
  ambassador_id: string | null;
  quiz_answers: Record<string, string>;
  booking_clicked: boolean;
  booking_clicked_at: string | null;
  marketing_consent: boolean;
  status: string;
  notes: string | null;
}

export interface AmbassadorRow {
  id: string;
  created_at: string;
  name: string;
  ref_code: string;
  email: string | null;
  phone: string | null;
  reward_per_lead: number;
  reward_per_booking: number;
  active: boolean;
  notes: string | null;
}

export interface AmbassadorRewardRow {
  id: string;
  created_at: string;
  ambassador_id: string;
  lead_id: string | null;
  reward_type: string;
  amount: number;
  paid: boolean;
  paid_at: string | null;
  notes: string | null;
}

export interface QuizEventRow {
  id: string;
  created_at: string;
  event: string;
  session_id: string | null;
  lead_id: string | null;
  payload: Record<string, unknown>;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  ref_code: string | null;
}

export type Database = {
  public: {
    Tables: {
      leads: {
        Row: LeadRow;
        Insert: Omit<LeadRow, "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<LeadRow>;
        Relationships: [];
      };
      ambassadors: {
        Row: AmbassadorRow;
        Insert: Omit<AmbassadorRow, "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<AmbassadorRow>;
        Relationships: [];
      };
      ambassador_rewards: {
        Row: AmbassadorRewardRow;
        Insert: Omit<AmbassadorRewardRow, "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<AmbassadorRewardRow>;
        Relationships: [];
      };
      quiz_events: {
        Row: QuizEventRow;
        Insert: Omit<QuizEventRow, "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<QuizEventRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
