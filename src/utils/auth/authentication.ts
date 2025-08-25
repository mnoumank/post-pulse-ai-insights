
import { supabase } from "@/integrations/supabase/client";
import { User } from "./types";

export async function login(email: string, password: string): Promise<User> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error("No user returned from login");
  }

  // Get or create user profile
  let profileData = null;
  try {
    const { data: existingProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .maybeSingle();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error("Error fetching profile:", profileError);
    }

    profileData = existingProfile;

    // If no profile exists or email is missing, create/update it
    if (!profileData || !profileData.email) {
      const { data: upsertedProfile, error: upsertError } = await supabase
        .from('profiles')
        .upsert({
          id: data.user.id,
          email: data.user.email,
          full_name: profileData?.full_name || data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'User',
          avatar_url: profileData?.avatar_url || data.user.user_metadata?.avatar_url
        })
        .select()
        .single();

      if (upsertError) {
        console.error("Error upserting profile:", upsertError);
      } else {
        profileData = upsertedProfile;
      }
    }
  } catch (profileError) {
    console.error("Profile handling error:", profileError);
  }

  return {
    id: data.user.id,
    name: profileData?.full_name || data.user.email?.split('@')[0] || 'User',
    email: data.user.email || '',
    avatarUrl: profileData?.avatar_url,
  };
}

export async function register(email: string, password: string, name: string): Promise<User> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
      emailRedirectTo: `${window.location.origin}/`,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error("No user returned from registration");
  }

  // Create profile with email immediately
  try {
    await supabase
      .from('profiles')
      .upsert({
        id: data.user.id,
        email: data.user.email,
        full_name: name,
      });
  } catch (profileError) {
    console.error("Error creating profile during registration:", profileError);
  }

  return {
    id: data.user.id,
    name: name || data.user.email?.split('@')[0] || 'User',
    email: data.user.email || '',
    avatarUrl: undefined,
  };
}

export async function logout(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    throw new Error(error.message);
  }
}
