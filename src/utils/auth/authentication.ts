
import { supabase } from "@/integrations/supabase/client";
import { User } from "./types";
import { getCurrentUser } from "./profiles";

export async function login(email: string, password: string): Promise<User> {
  // Special handling for demo account
  if (email === "demo@example.com" && password === "password123") {
    return {
      id: "demo-user-id",
      name: "Demo User",
      email: "demo@example.com",
      avatarUrl: undefined,
    };
  }

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

  // Get user profile from profiles table
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();

  if (profileError) {
    console.error("Error fetching profile:", profileError);
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
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error("No user returned from registration");
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

export async function isLoggedIn(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}
