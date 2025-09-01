import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content } = await req.json();
    
    if (!content || typeof content !== 'string') {
      return new Response(JSON.stringify({ error: 'Content is required and must be a string' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Input validation for security and cost control
    if (content.length > 3000) {
      return new Response(JSON.stringify({ error: 'Content must be less than 3000 characters' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const cleanupPrompt = `You are an expert LinkedIn content editor. Your job is to clean up and enhance the provided text while maintaining its core message and authenticity.

CRITICAL FORMATTING RULES:
1. Remove ALL existing hashtags from the text
2. Add 2-3 line breaks between major sections for better readability
3. Add relevant emojis to enhance visual appeal (1-2 per paragraph max)
4. Fix grammar, spelling, and punctuation
5. Improve sentence flow and clarity
6. Make the tone more engaging and professional
7. Keep the same general length and structure
8. Add 3-5 highly relevant hashtags at the very end, on separate lines with proper spacing

OUTPUT FORMAT:
- Clean, well-formatted text with proper line breaks
- Strategic emoji placement for visual appeal
- Professional but engaging tone
- Hashtags at the end only, each on its own line

Text to clean up:
"${content}"

Return ONLY the cleaned up text, no explanations or additional commentary.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are a professional LinkedIn content editor. Return only the cleaned up text with no additional commentary.' 
          },
          { role: 'user', content: cleanupPrompt }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      return new Response(JSON.stringify({ error: 'Failed to process content with AI' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const cleanedContent = data.choices[0].message.content;

    return new Response(JSON.stringify({ cleanedContent }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in cleanup-post function:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});