
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
    .single();

  if (profileError && profileError.code !== 'PGRST116') {
    console.error("Error fetching profile:", profileError);
  }

  return {
    id: userData.user.id,
    name: profileData?.full_name || userData.user.email?.split('@')[0] || 'User',
    email: userData.user.email || '',
    avatarUrl: profileData?.avatar_url,
  };
}
