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
    const body = await req.text();
    
    // Basic security: limit request body size (100KB)
    if (body.length > 100000) {
      return new Response(
        JSON.stringify({ error: 'Request body too large' }),
        { status: 413, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { content, optimizationType } = JSON.parse(body);
    
    if (!content || !optimizationType) {
      return new Response(
        JSON.stringify({ error: 'Content and optimization type are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Limit content length (10,000 characters)
    if (content.length > 10000) {
      return new Response(
        JSON.stringify({ error: 'Content too long (max 10,000 characters)' }),
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

    const optimizationPrompts = {
      hook: 'Rewrite the opening 1-2 sentences to be more attention-grabbing. Use psychological triggers like curiosity, controversy, or vulnerability. Make it scannable and emotionally engaging.',
      
      readability: 'Improve the formatting and readability. Add line breaks every 2-3 sentences, use bullet points where appropriate, add strategic emojis (1-3 total), and ensure mobile-friendly formatting.',
      
      storytelling: 'Enhance the narrative elements. Add more specific details, emotional language, sensory descriptions, and create a clearer story arc with tension and resolution.',
      
      vulnerability: 'Make the post more personal and relatable. Add vulnerable moments, authentic struggles, specific failures, and human elements that create emotional connection.',
      
      cta: 'Improve the call-to-action. Create a more engaging question that encourages meaningful discussion and detailed responses, not just yes/no answers.',
      
      value: 'Increase the actionable value. Add specific tips, frameworks, metrics, or insights that readers can immediately apply to their own situations.'
    };

    const optimizationPrompt = `
      Original LinkedIn post:
      "${content}"
      
      Optimization request: ${optimizationPrompts[optimizationType as keyof typeof optimizationPrompts]}
      
      Requirements:
      - Maintain the core message and authenticity
      - Keep it LinkedIn-appropriate and professional
      - Optimize for virality while staying genuine
      - Ensure the optimization significantly improves the specific factor requested
      - Keep word count similar (150-400 words)
      - Include hashtags if they were in the original
      
      Return only the optimized post content, no additional commentary.
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: 'You are a LinkedIn content optimization expert. You specialize in making small but impactful changes that dramatically improve engagement while maintaining authenticity and professionalism.'
          },
          {
            role: 'user',
            content: optimizationPrompt
          }
        ],
        temperature: 0.6,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', await response.text());
      return new Response(
        JSON.stringify({ error: 'Failed to optimize post' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiResponse = await response.json();
    const optimizedContent = aiResponse.choices[0].message.content;

    return new Response(
      JSON.stringify({ optimizedContent }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in optimize-post function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});