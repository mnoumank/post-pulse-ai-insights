
import { supabase } from "@/integrations/supabase/client";
import { User } from "./types";

export async function getCurrentUser(): Promise<User | null> {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError) {
    console.error("Error getting session:", sessionError);
    return null;
  }
  
  if (!sessionData.session) {
    return null;
  }
  
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError) {
    console.error("Error getting user:", userError);
    return null;
  }
  
  if (!userData.user) {
    return null;
  }

  // Get user profile from profiles table
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userData.user.id)
    .maybeSingle();

  if (profileError && profileError.code !== 'PGRST116') {
    console.error("Error fetching profile:", profileError);
  }

  // If no profile exists or email is missing, create/update it
  if (!profileData || !profileData.email) {
    try {
      const { data: upsertedProfile, error: upsertError } = await supabase
        .from('profiles')
        .upsert({
          id: userData.user.id,
          email: userData.user.email,
          full_name: profileData?.full_name || userData.user.user_metadata?.full_name || userData.user.email?.split('@')[0] || 'User',
          avatar_url: profileData?.avatar_url || userData.user.user_metadata?.avatar_url
        })
        .select()
        .single();

      if (!upsertError && upsertedProfile) {
        return {
          id: userData.user.id,
          name: upsertedProfile.full_name || userData.user.email?.split('@')[0] || 'User',
          email: userData.user.email || '',
          avatarUrl: upsertedProfile.avatar_url,
        };
      }
    } catch (error) {
      console.error("Error upserting profile:", error);
    }
  }

  return {
    id: userData.user.id,
    name: profileData?.full_name || userData.user.email?.split('@')[0] || 'User',
    email: userData.user.email || '',
    avatarUrl: profileData?.avatar_url,
  };
}
