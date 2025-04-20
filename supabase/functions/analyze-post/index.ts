
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { postContent, industry } = await req.json();
    
    if (!postContent) {
      throw new Error('Post content is required');
    }

    const industryContext = industry ? `This post is targeted at the ${industry} industry.` : '';
    
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
            content: `You are an expert LinkedIn content analyzer. You analyze LinkedIn posts and provide accurate, specific feedback on their potential performance. ${industryContext}` 
          },
          { 
            role: 'user', 
            content: `Analyze this LinkedIn post and provide metrics on:
1. Engagement potential (0-100)
2. Reach potential (0-100)
3. Virality potential (0-100)
4. Three specific improvement suggestions
5. List potential hashtags that would perform well with this content (up to 5)

The post:
${postContent}

Return your response as a JSON object with these keys:
- engagementScore
- reachScore
- viralityScore
- suggestions (array of objects with 'title' and 'description')
- recommendedHashtags (array of strings)` 
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
      }),
    });

    const data = await response.json();
    const aiAnalysis = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify(aiAnalysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-post function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
