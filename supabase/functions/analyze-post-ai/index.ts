
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

    // Updated prompt for more realistic scoring
    const analysisPrompt = `
      Analyze this LinkedIn post for engagement potential with REALISTIC scoring. Most good posts score 40-60, excellent posts score 60-80, exceptional posts score 80+.

      Post Content: "${postContent}"
      Industry: ${industry || 'General'}

      Please provide a JSON response with the following structure:
      {
        "engagementScore": number (realistic 0-100, most posts 20-60),
        "reachScore": number (realistic 0-100, most posts 15-55), 
        "viralityScore": number (realistic 0-100, most posts 10-50),
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

      IMPORTANT SCORING GUIDELINES:
      - Be conservative: A score over 70 should be rare and exceptional
      - Consider real LinkedIn performance: most posts get modest engagement
      - Factor in content quality, not just keyword presence
      - Penalize generic or low-value content
      - Reward authentic storytelling, clear value propositions, and genuine insights
      - A post needs multiple strong elements to score above 60

      LinkedIn best practices to consider:
      - Authentic personal stories perform better than generic advice
      - Questions increase comments but don't guarantee virality
      - 1-3 hashtags optimal, more can hurt performance
      - 150-800 characters is ideal length
      - Value-driven content with specific insights scores higher
      - Professional tone with personality works best
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
            content: 'You are a LinkedIn content optimization expert with years of real performance data. You provide realistic, conservative scoring that reflects actual LinkedIn engagement patterns. Be tough but fair in your analysis.'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        temperature: 0.3, // Lower temperature for more consistent scoring
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
      
      // Validate and cap scores to ensure realism
      analysisResult.engagementScore = Math.min(100, Math.max(0, analysisResult.engagementScore));
      analysisResult.reachScore = Math.min(100, Math.max(0, analysisResult.reachScore));
      analysisResult.viralityScore = Math.min(100, Math.max(0, analysisResult.viralityScore));
      
    } catch (parseError) {
      console.error('Failed to parse AI response:', analysisText);
      // Conservative fallback response
      analysisResult = {
        engagementScore: 35,
        reachScore: 30,
        viralityScore: 25,
        suggestions: [
          {
            title: "Improve Content Quality",
            description: "Focus on providing specific value, personal insights, or actionable advice to increase engagement"
          },
          {
            title: "Add Engagement Elements", 
            description: "Consider adding a thoughtful question or call-to-action to encourage meaningful discussion"
          }
        ],
        recommendedHashtags: ["#LinkedIn", "#Professional"],
        analysis: {
          strengths: ["Clear communication"],
          weaknesses: ["Could be more engaging", "Needs more specific value"],
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
