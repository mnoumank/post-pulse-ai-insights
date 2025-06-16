
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
    const { postContent, industry } = await req.json();
    
    if (!postContent) {
      return new Response(
        JSON.stringify({ error: 'Post content is required' }),
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

    // Analyze the post content with OpenAI
    const analysisPrompt = `
      Analyze this LinkedIn post for engagement potential and provide specific recommendations:

      Post Content: "${postContent}"
      Industry: ${industry || 'General'}

      Please provide a JSON response with the following structure:
      {
        "engagementScore": number (0-100),
        "reachScore": number (0-100), 
        "viralityScore": number (0-100),
        "suggestions": [
          {
            "title": "Specific improvement title",
            "description": "Detailed actionable suggestion"
          }
        ],
        "recommendedHashtags": ["hashtag1", "hashtag2", "hashtag3"],
        "analysis": {
          "strengths": ["strength1", "strength2"],
          "weaknesses": ["weakness1", "weakness2"],
          "tone": "professional/casual/inspirational",
          "readability": "high/medium/low",
          "callToAction": "strong/weak/missing"
        }
      }

      Consider these LinkedIn best practices:
      - Posts with emojis get 25% more engagement
      - Questions increase comments by 100%
      - Posts with 1-3 hashtags perform better
      - Optimal length is 150-300 characters
      - Personal stories drive 300% more engagement
      - Visual content gets 2x more engagement
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
            content: 'You are a LinkedIn content optimization expert. Analyze posts and provide detailed, actionable insights to improve engagement. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      return new Response(
        JSON.stringify({ error: 'Failed to analyze post with AI' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiResponse = await response.json();
    const analysisText = aiResponse.choices[0].message.content;

    // Parse the JSON response
    let analysisResult;
    try {
      analysisResult = JSON.parse(analysisText);
    } catch (parseError) {
      console.error('Failed to parse AI response:', analysisText);
      // Fallback response if JSON parsing fails
      analysisResult = {
        engagementScore: 65,
        reachScore: 60,
        viralityScore: 55,
        suggestions: [
          {
            title: "Add Engaging Elements",
            description: "Consider adding emojis, questions, or personal anecdotes to increase engagement"
          }
        ],
        recommendedHashtags: ["#LinkedIn", "#Professional", "#Networking"],
        analysis: {
          strengths: ["Clear content"],
          weaknesses: ["Could be more engaging"],
          tone: "professional",
          readability: "medium",
          callToAction: "weak"
        }
      };
    }

    return new Response(
      JSON.stringify(analysisResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-post-ai function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
