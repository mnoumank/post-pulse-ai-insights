
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUser } from "./profiles";

export interface ComparisonActualsInput {
  comparison_id: string;
  post_a_url?: string;
  post_b_url?: string;
  post_a_likes?: number;
  post_a_comments?: number;
  post_a_shares?: number;
  post_a_impressions?: number;
  post_b_likes?: number;
  post_b_comments?: number;
  post_b_shares?: number;
  post_b_impressions?: number;
  actual_winner?: number; // 0 = tie, 1 = A, 2 = B
  notes?: string;
}

export interface ComparisonActualsRow {
  id: string;
  user_id: string;
  comparison_id: string;
  post_a_url: string | null;
  post_b_url: string | null;
  post_a_likes: number | null;
  post_a_comments: number | null;
  post_a_shares: number | null;
  post_a_impressions: number | null;
  post_b_likes: number | null;
  post_b_comments: number | null;
  post_b_shares: number | null;
  post_b_impressions: number | null;
  actual_winner: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export async function saveComparisonActuals(input: ComparisonActualsInput): Promise<ComparisonActualsRow | null> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("You must be logged in to save reality check");
  }

  const payload = {
    user_id: user.id,
    ...input,
  };

  const { data, error } = await (supabase as any)
    .from('comparison_actuals')
    .upsert(payload, { onConflict: 'comparison_id' })
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error saving comparison actuals:', error);
    throw new Error(error.message);
  }

  return data as ComparisonActualsRow | null;
}

export async function getComparisonActuals(comparisonId: string): Promise<ComparisonActualsRow | null> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("You must be logged in to view reality check");
  }

  const { data, error } = await (supabase as any)
    .from('comparison_actuals')
    .select('*')
    .eq('comparison_id', comparisonId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching comparison actuals:', error);
    throw new Error(error.message);
  }

  return data as ComparisonActualsRow | null;
}

