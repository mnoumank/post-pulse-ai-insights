
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

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

export async function isLoggedIn(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}

// New functions to support the post comparison feature
export async function savePost(content: string): Promise<string> {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error("You must be logged in to save posts");
  }
  
  const { data, error } = await supabase
    .from('posts')
    .insert({
      user_id: user.id,
      content: content
    })
    .select()
    .single();
    
  if (error) {
    toast({
      title: "Error saving post",
      description: error.message,
      variant: "destructive",
    });
    throw new Error(error.message);
  }
  
  return data.id;
}

export async function saveComparison(
  post1Id: string,
  post2Id: string,
  winnerId: string | null,
  metrics: any,
  suggestions: any
): Promise<string> {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error("You must be logged in to save comparisons");
  }
  
  const { data, error } = await supabase
    .from('comparisons')
    .insert({
      user_id: user.id,
      post_a_id: post1Id,
      post_b_id: post2Id,
      winner_id: winnerId,
      metrics: metrics,
      suggestions: suggestions
    })
    .select()
    .single();
    
  if (error) {
    toast({
      title: "Error saving comparison",
      description: error.message,
      variant: "destructive",
    });
    throw new Error(error.message);
  }
  
  toast({
    title: "Comparison saved",
    description: "Your comparison has been saved successfully",
  });
  
  return data.id;
}

export async function getUserComparisons(): Promise<any[]> {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error("You must be logged in to view comparisons");
  }
  
  // Get comparisons with post content
  const { data, error } = await supabase
    .from('comparisons')
    .select(`
      id,
      created_at,
      metrics,
      winner_id,
      post_a_id,
      post_b_id,
      posts!comparisons_post_a_id_fkey(id, content),
      posts!comparisons_post_b_id_fkey(id, content)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error("Error fetching comparisons:", error);
    throw new Error(error.message);
  }
  
  // Transform the data to a more usable format
  return data.map(comp => {
    const post1 = comp.posts.filter((p: any) => p.id === comp.post_a_id)[0];
    const post2 = comp.posts.filter((p: any) => p.id === comp.post_b_id)[0];
    
    return {
      id: comp.id,
      date: comp.created_at,
      post1: post1?.content || '',
      post2: post2?.content || '',
      winnerId: comp.winner_id,
      winningPost: comp.winner_id === comp.post_a_id ? 1 : comp.winner_id === comp.post_b_id ? 2 : 0,
      metrics: comp.metrics
    };
  });
}
