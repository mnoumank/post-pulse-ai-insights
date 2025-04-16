
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { getCurrentUser } from "./profiles";

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
    // First, handle the posts data properly
    const postsA = Array.isArray(comp.posts) 
      ? comp.posts 
      : (comp.posts ? [comp.posts] : []);
      
    const post1Content = postsA.find((p: any) => p.id === comp.post_a_id)?.content || '';
    
    // For post B, we need to handle it separately since it might be coming from a different key
    const postsB = Array.isArray(comp.posts) 
      ? comp.posts 
      : (comp.posts ? [comp.posts] : []);
      
    const post2Content = postsB.find((p: any) => p.id === comp.post_b_id)?.content || '';
    
    return {
      id: comp.id,
      date: comp.created_at,
      post1: post1Content,
      post2: post2Content,
      winnerId: comp.winner_id,
      winningPost: comp.winner_id === comp.post_a_id ? 1 : comp.winner_id === comp.post_b_id ? 2 : 0,
      metrics: comp.metrics
    };
  });
}
