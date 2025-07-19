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
    const { idea } = await req.json();
    
    if (!idea) {
      return new Response(
        JSON.stringify({ error: 'Idea is required' }),
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

    const hookPrompt = `
      Based on this LinkedIn post idea: "${idea}"
      
      Generate 5 different viral hook options that would maximize engagement. Each hook should be 1-2 sentences maximum and use different psychological triggers.
      
      Create hooks using these proven viral techniques:
      1. Provocative Question Hook - Start with a thought-provoking question
      2. Bold Statement Hook - Make a bold, attention-grabbing claim  
      3. Vulnerability Hook - Share something personal or vulnerable
      4. Statistic/Fact Hook - Use surprising data or facts
      5. Contrarian Hook - Challenge conventional wisdom
      
      For each hook, provide:
      - The hook text (1-2 sentences max)
      - The technique type
      - A brief explanation of why it works
      
      Format as JSON array with objects containing: text, type, description
      
      Focus on hooks that create curiosity, emotion, or controversy while staying professional and authentic.
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
            content: 'You are a LinkedIn virality expert who specializes in creating hooks that maximize engagement. You understand psychology, social media algorithms, and what makes content go viral on professional platforms.'
          },
          {
            role: 'user',
            content: hookPrompt
          }
        ],
        temperature: 0.8,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', await response.text());
      return new Response(
        JSON.stringify({ error: 'Failed to generate hooks' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiResponse = await response.json();
    let hooksData;
    
    try {
      hooksData = JSON.parse(aiResponse.choices[0].message.content);
    } catch {
      // Fallback if JSON parsing fails
      const content = aiResponse.choices[0].message.content;
      hooksData = [
        {
          id: '1',
          text: content.split('\n')[0] || "What if I told you there's a better way?",
          type: 'Provocative Question',
          description: 'Creates curiosity and engagement'
        }
      ];
    }

    // Ensure each hook has an ID
    const hooks = hooksData.map((hook: any, index: number) => ({
      ...hook,
      id: hook.id || `hook-${index + 1}`
    }));

    return new Response(
      JSON.stringify({ hooks }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-hooks function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});