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
      return new Response(
        JSON.stringify({ error: 'Content is required and must be a string' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Input validation for security and cost control
    if (content.length > 5000) {
      return new Response(
        JSON.stringify({ error: 'Content must be less than 5000 characters' }),
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

    const analysisPrompt = `
      Analyze this LinkedIn post and provide specific suggestions for improvement:
      
      "${content}"
      
      Evaluate the post on these virality factors and provide actionable suggestions:
      
      1. Hook Strength (20%): How attention-grabbing is the opening?
      2. Readability (15%): Is it well-formatted and easy to read?
      3. Storytelling (15%): Does it tell a compelling story?
      4. Value (15%): Does it provide actionable insights?
      5. Call-to-Action (10%): Does it encourage engagement?
      6. Visual Appeal (10%): Is it visually scannable?
      7. Engagement Bait (10%): Does it spark discussion?
      8. Personal Touch (5%): Is it authentic and personal?
      
      For each factor that scores below 7/10, provide a specific suggestion with:
      - Type (factor name)
      - Title (brief suggestion)
      - Description (what's wrong and why it matters)
      - Action (specific action to take)
      
      Focus on the top 3-5 most impactful improvements.
      
      Format as JSON array with objects containing: type, title, description, action
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
            content: 'You are a LinkedIn content analyst who provides specific, actionable suggestions for improving post virality. You focus on the most impactful changes that will drive engagement.'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', await response.text());
      return new Response(
        JSON.stringify({ error: 'Failed to analyze post' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiResponse = await response.json();
    let suggestions;
    
    try {
      suggestions = JSON.parse(aiResponse.choices[0].message.content);
    } catch {
      // Fallback if JSON parsing fails
      suggestions = [
        {
          type: 'hook',
          title: 'Improve Opening Hook',
          description: 'The opening could be more attention-grabbing',
          action: 'Rewrite with a question or bold statement'
        }
      ];
    }

    return new Response(
      JSON.stringify({ suggestions }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-post-suggestions function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});