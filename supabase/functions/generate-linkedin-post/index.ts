
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

    // Detect if user wants a longer post/thread
    const wantsLongerContent = prompt.toLowerCase().includes('thread') || 
                              prompt.toLowerCase().includes('long') || 
                              prompt.toLowerCase().includes('detailed') ||
                              prompt.toLowerCase().includes('story') ||
                              prompt.toLowerCase().includes('series');

    const linkedInPostPrompt = `
      Create a professional and engaging LinkedIn post based on the following prompt: "${prompt}"

      ${wantsLongerContent ? 
        `Since this appears to be a request for longer content, create a comprehensive LinkedIn post (400-800 words) that could work as a mini-article or detailed story. Structure it with:
        - A compelling hook in the first 2 lines
        - Multiple sections with clear breaks
        - Numbered points or bullet points where appropriate
        - Personal insights and lessons learned
        - A strong call-to-action at the end` 
        : 
        `Create a concise but impactful LinkedIn post (150-300 words) that maximizes engagement.`
      }

      Follow these LinkedIn best practices:
      
      **Content Structure:**
      - Start with a hook that creates curiosity or relates to common professional experiences
      - Use line breaks frequently (every 1-2 sentences) for mobile readability
      - Include personal experiences or behind-the-scenes insights
      - Share specific, actionable advice or lessons learned
      - End with an engaging question that encourages meaningful comments

      **Engagement Optimization:**
      - Use 1-3 relevant emojis naturally (not at the start of every line)
      - Include specific numbers/metrics when possible (e.g., "increased by 40%", "in 6 months")
      - Share vulnerable moments or failures that led to growth
      - Ask questions that require more than yes/no answers
      - Use "you" language to directly address the reader

      **Professional Tone:**
      - Be authentic and conversational, not corporate-speak
      - Share insights that provide genuine value to professionals
      - Include industry-specific terminology when relevant
      - Balance confidence with humility
      - Make it relatable to a broad professional audience

      **Format Guidelines:**
      - Use short paragraphs (1-3 sentences max)
      - Include 3-7 relevant hashtags at the end
      - Bold key phrases using **text** when emphasizing important points
      - Use bullet points or numbered lists for clarity when listing items

      **Content Categories to Consider:**
      - Career lessons and growth stories
      - Industry insights and trends
      - Leadership and management experiences
      - Productivity and work-life balance tips
      - Team building and collaboration
      - Innovation and problem-solving
      - Professional development and learning

      Generate only the post content with hashtags, no additional commentary or quotation marks.
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
            content: 'You are a LinkedIn content strategist and professional writer who specializes in creating viral LinkedIn posts. You understand the LinkedIn algorithm, professional audience psychology, and what drives meaningful engagement. Your posts consistently get high engagement rates and help professionals build their personal brands.'
          },
          {
            role: 'user',
            content: linkedInPostPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1200,
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
