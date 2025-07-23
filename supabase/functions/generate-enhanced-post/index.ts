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
    const { idea, selectedHook, category, includeViralityOptimization } = await req.json();
    
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

    // Define category-specific optimizations
    const categoryOptimizations = {
      'personal-story': {
        structure: 'Challenge → Journey → Resolution → Lesson',
        tone: 'Vulnerable and authentic',
        elements: 'Include specific details, emotions, and universal lessons',
        cta: 'Ask about others\' similar experiences'
      },
      'knowledge-sharing': {
        structure: 'Problem → Solution → Steps → Results',
        tone: 'Authoritative but approachable',
        elements: 'Use numbered lists, specific metrics, actionable advice',
        cta: 'Ask for others to share their tips or experiences'
      },
      'hot-takes': {
        structure: 'Contrarian Statement → Evidence → Explanation → Implications',
        tone: 'Confident but respectful',
        elements: 'Use data, examples, and logical reasoning',
        cta: 'Ask for counterarguments or agree/disagree responses'
      },
      'motivational': {
        structure: 'Challenge → Reframe → Action → Outcome',
        tone: 'Inspiring and empowering',
        elements: 'Use positive language, specific examples, future-focused',
        cta: 'Encourage action or sharing success stories'
      },
      'industry-insights': {
        structure: 'Observation → Analysis → Implications → Predictions',
        tone: 'Expert and forward-thinking',
        elements: 'Include trends, data points, and industry context',
        cta: 'Ask for opinions on future implications'
      },
      'behind-scenes': {
        structure: 'Expectation → Reality → Details → Lessons',
        tone: 'Honest and transparent',
        elements: 'Include specific numbers, time, effort, and unexpected challenges',
        cta: 'Ask others to share their behind-the-scenes experiences'
      }
    };

    const categoryData = categoryOptimizations[category as keyof typeof categoryOptimizations] || categoryOptimizations['personal-story'];

    const enhancedPrompt = `
      Create a highly viral LinkedIn post based on this idea: "${idea}"
      ${selectedHook ? `Start with this hook: "${selectedHook}"` : ''}
      
      Category: ${category}
      Structure: ${categoryData.structure}
      Tone: ${categoryData.tone}
      Key Elements: ${categoryData.elements}
      Call-to-Action Style: ${categoryData.cta}
      
      VIRALITY OPTIMIZATION REQUIREMENTS:
      
      **Hook Strength (20% weight):**
      - Create immediate curiosity or emotional response
      - Use pattern interrupts or surprising statements
      - Make it scannable for mobile users
      
      **Readability & Formatting (15% weight):**
      - Use short paragraphs (1-3 sentences max)
      - Add strategic line breaks every 2-3 sentences
      - Include bullet points or numbered lists where appropriate
      - Use emojis sparingly but effectively (1-3 total)
      
      **Storytelling & Relatability (15% weight):**
      - Include specific details (numbers, names, timeframes)
      - Show vulnerability or failure alongside success
      - Use sensory details and emotional language
      - Create a clear narrative arc
      
      **Value & Relevance (15% weight):**
      - Provide actionable insights or takeaways
      - Address common professional challenges
      - Include frameworks, tips, or lessons learned
      - Make it immediately applicable to readers' lives
      
      **Call-to-Action & Engagement (10% weight):**
      - End with a specific, engaging question
      - Encourage meaningful discussion, not just likes
      - Ask for personal experiences or opinions
      - Use inclusive language ("Have you experienced this?")
      
      **Visual Appeal (10% weight):**
      - Use formatting symbols (→, •, ✓) for visual breaks
      - Bold key phrases using **text** for emphasis
      - Create scannable structure with clear sections
      - Include strategic whitespace
      
      **Engagement Bait (10% weight):**
      - Include controversial but defensible opinions
      - Ask questions that require detailed responses
      - Reference trending topics or common experiences
      - Create discussion-worthy content
      
      **Personal Touch (5% weight):**
      - Use first-person perspective
      - Share personal insights or experiences
      - Include personality and authentic voice
      - Connect on human level beyond just professional
      
      POST REQUIREMENTS:
      - 150-400 words (optimal for LinkedIn algorithm)
      - Include 3-5 relevant hashtags at the end
      - Structure for mobile readability
      - Professional but conversational tone
      - Clear value proposition for the reader
      
      Generate only the final post content with hashtags, no additional commentary.
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
            content: 'You are an elite LinkedIn content strategist who has created hundreds of viral posts. You understand the precise psychological triggers, formatting techniques, and algorithmic factors that drive maximum engagement on LinkedIn. Your posts consistently achieve 10x average engagement rates.'
          },
          {
            role: 'user',
            content: enhancedPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1200,
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', await response.text());
      return new Response(
        JSON.stringify({ error: 'Failed to generate enhanced post' }),
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
    console.error('Error in generate-enhanced-post function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});