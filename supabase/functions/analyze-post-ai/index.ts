
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

    // Enhanced analysis prompt based on the 8-factor virality formula
    const analysisPrompt = `
      Analyze this LinkedIn post using advanced virality prediction criteria. Score each factor on 0-100 scale with REALISTIC expectations:

      Post Content: "${postContent}"
      Industry: ${industry || 'General'}

      Evaluate these 8 key factors:
      1. Hook Strength (20% weight) - Opening effectiveness, attention-grabbing
      2. Readability & Formatting (15% weight) - Visual appeal, paragraph structure
      3. Value & Relevance (15% weight) - Professional insights, actionability
      4. Author Credibility (15% weight) - Expertise indicators, authority
      5. Storytelling & Relatability (10% weight) - Personal connection, emotions
      6. Visual Appeal (10% weight) - Emojis, formatting, visual hierarchy
      7. Call-to-Action & Engagement (10% weight) - Questions, interaction prompts
      8. Timing & Frequency (5% weight) - Posting optimization

      SCORING GUIDELINES (be conservative and realistic):
      - 80-100: Exceptional, rare posts that truly excel
      - 60-79: Good posts with strong elements
      - 40-59: Average posts with some good qualities
      - 20-39: Below average, needs significant improvement
      - 0-19: Poor quality content

      Return JSON with this exact structure:
      {
        "engagementScore": number (realistic 0-100),
        "reachScore": number (realistic 0-100), 
        "viralityScore": number (realistic 0-100),
        "suggestions": [
          {
            "title": "Specific improvement area",
            "description": "Detailed actionable recommendation based on the 8 factors"
          }
        ],
        "recommendedHashtags": ["hashtag1", "hashtag2", "hashtag3"],
        "analysis": {
          "strengths": ["specific strength 1", "specific strength 2"],
          "weaknesses": ["specific weakness 1", "specific weakness 2"],
          "tone": "professional/casual/inspirational/motivational",
          "readability": "high/medium/low",
          "callToAction": "strong/moderate/weak/missing",
          "hookEffectiveness": "excellent/good/moderate/weak",
          "valueProposition": "high/medium/low",
          "factorBreakdown": {
            "hookStrength": number (0-100),
            "readabilityFormatting": number (0-100),
            "valueRelevance": number (0-100),
            "authorCredibility": number (0-100),
            "storytellingRelatability": number (0-100),
            "visualAppeal": number (0-100),
            "callToActionEngagement": number (0-100),
            "timingFrequency": number (0-100)
          }
        }
      }

      Focus on:
      - Real LinkedIn performance patterns (most posts get modest engagement)
      - Authentic professional value over generic advice
      - Specific, actionable improvements
      - Conservative scoring that reflects actual platform dynamics
      - Quality over quantity in suggestions
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Using proven model for consistency
        messages: [
          {
            role: 'system',
            content: `You are a LinkedIn content optimization expert with deep knowledge of viral content patterns. You analyze posts using an 8-factor scientific formula and provide realistic, conservative scoring based on actual LinkedIn engagement data. Your analysis helps professionals create authentically engaging content that resonates with their audience.

            Key principles:
            - Be realistic and conservative in scoring (most good posts score 40-70)
            - Focus on professional value and authenticity
            - Provide specific, actionable recommendations
            - Consider the 8-factor formula weights in your analysis
            - Avoid inflated scores that don't reflect real platform performance`
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        temperature: 0.2, // Lower temperature for more consistent analysis
        max_tokens: 2000,
        response_format: { type: "json_object" }
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

    // Parse and validate the JSON response
    let analysisResult;
    try {
      analysisResult = JSON.parse(analysisText);
      
      // Validate and ensure realistic scores
      analysisResult.engagementScore = Math.min(100, Math.max(0, analysisResult.engagementScore || 35));
      analysisResult.reachScore = Math.min(100, Math.max(0, analysisResult.reachScore || 30));
      analysisResult.viralityScore = Math.min(100, Math.max(0, analysisResult.viralityScore || 25));
      
      // Ensure required fields exist
      if (!analysisResult.suggestions) {
        analysisResult.suggestions = [{
          title: "Enhance Content Value",
          description: "Focus on providing specific, actionable insights that your professional audience can immediately apply."
        }];
      }
      
      if (!analysisResult.recommendedHashtags) {
        analysisResult.recommendedHashtags = ["#LinkedIn", "#Professional"];
      }
      
      if (!analysisResult.analysis) {
        analysisResult.analysis = {
          strengths: ["Clear communication"],
          weaknesses: ["Could be more engaging"],
          tone: "professional",
          readability: "medium",
          callToAction: "moderate"
        };
      }
      
    } catch (parseError) {
      console.error('Failed to parse AI response:', analysisText);
      console.error('Parse error:', parseError);
      
      // Enhanced fallback response with more realistic scoring
      analysisResult = {
        engagementScore: 40,
        reachScore: 35,
        viralityScore: 30,
        suggestions: [
          {
            title: "Strengthen Your Hook",
            description: "Start with a more compelling opening that immediately grabs attention - try a provocative question, surprising statistic, or bold statement."
          },
          {
            title: "Add Professional Value", 
            description: "Include specific tips, strategies, or insights that your audience can immediately apply in their professional lives."
          },
          {
            title: "Improve Call-to-Action",
            description: "End with a clear question or prompt that encourages meaningful discussion and engagement from your network."
          }
        ],
        recommendedHashtags: ["#LinkedIn", "#Professional", "#CareerTips"],
        analysis: {
          strengths: ["Professional tone", "Clear structure"],
          weaknesses: ["Hook could be stronger", "Needs more specific value", "Call-to-action could be clearer"],
          tone: "professional",
          readability: "medium",
          callToAction: "weak",
          hookEffectiveness: "moderate",
          valueProposition: "medium"
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
