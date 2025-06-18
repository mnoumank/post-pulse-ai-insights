
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
    const { prompt } = await req.json();
    
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const linkedInPostPrompt = `
      Create a professional and engaging LinkedIn post based on the following prompt or story: "${prompt}"

      Please follow these LinkedIn best practices:
      - Keep it between 150-300 words for optimal engagement
      - Start with a hook that grabs attention
      - Use storytelling when appropriate
      - Include 1-3 relevant emojis naturally integrated
      - End with a question or call-to-action to encourage engagement
      - Use line breaks for better readability
      - Be authentic and professional
      - Include relevant insights or lessons learned
      - Use 2-5 relevant hashtags at the end

      The post should sound natural and human, not overly promotional. Focus on providing value, sharing insights, or telling a compelling story that resonates with a professional audience.

      Generate only the post content, no additional commentary.
    `;

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
            content: 'You are a professional LinkedIn content creator who specializes in writing engaging, authentic posts that drive meaningful professional conversations. You understand LinkedIn audience preferences and best practices for maximum engagement.'
          },
          {
            role: 'user',
            content: linkedInPostPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      return new Response(
        JSON.stringify({ error: 'Failed to generate LinkedIn post' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiResponse = await response.json();
    const generatedPost = aiResponse.choices[0].message.content;

    return new Response(
      JSON.stringify({ post: generatedPost }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-linkedin-post function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
