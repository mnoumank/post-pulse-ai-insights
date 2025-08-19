import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";
import { getCurrentUser } from "./profiles";

export interface FeedbackInput {
  message: string;
  rating: number;
  page: string;
}

export interface UserPreferencesInput {
  never_show_feedback?: boolean;
  feedback_shown_count?: number;
  last_feedback_shown?: string;
}

export type FeedbackRow = Tables<'feedback'>;
export type UserPreferencesRow = Tables<'user_preferences'>;

export async function submitFeedback(input: FeedbackInput): Promise<FeedbackRow | null> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("You must be logged in to submit feedback");
  }

  const payload: TablesInsert<'feedback'> = {
    user_id: user.id,
    ...input,
  };

  const { data, error } = await supabase
    .from('feedback')
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error('Error submitting feedback:', error);
    throw new Error(error.message);
  }

  return data as FeedbackRow;
}

export async function getUserPreferences(): Promise<UserPreferencesRow | null> {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching user preferences:', error);
    throw new Error(error.message);
  }

  return data as UserPreferencesRow | null;
}

export async function updateUserPreferences(input: UserPreferencesInput): Promise<UserPreferencesRow | null> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("You must be logged in to update preferences");
  }

  const payload: TablesInsert<'user_preferences'> = {
    user_id: user.id,
    ...input,
  };

  const { data, error } = await supabase
    .from('user_preferences')
    .upsert(payload, { onConflict: 'user_id' })
    .select()
    .single();

  if (error) {
    console.error('Error updating user preferences:', error);
    throw new Error(error.message);
  }

  return data as UserPreferencesRow;
}

export async function incrementFeedbackCount(): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;

  const preferences = await getUserPreferences();
  const currentCount = preferences?.feedback_shown_count || 0;

  await updateUserPreferences({
    feedback_shown_count: currentCount + 1,
    last_feedback_shown: new Date().toISOString(),
  });
}

export async function shouldShowFeedback(): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;

  const preferences = await getUserPreferences();
  
  // Don't show if user opted out
  if (preferences?.never_show_feedback) {
    return false;
  }

  // Don't show more than once per day
  if (preferences?.last_feedback_shown) {
    const lastShown = new Date(preferences.last_feedback_shown);
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    
    if (lastShown > oneDayAgo) {
      return false;
    }
  }

  // Show after 3 operations if never shown before
  const shownCount = preferences?.feedback_shown_count || 0;
  return shownCount >= 3;
}