
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { getCurrentUser } from "./profiles";

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
