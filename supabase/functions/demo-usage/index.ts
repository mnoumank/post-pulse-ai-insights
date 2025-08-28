import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Use service role key to bypass RLS for IP tracking
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

function getClientIP(request: Request): string {
  // Try various headers that might contain the real IP
  const xForwardedFor = request.headers.get('x-forwarded-for');
  const xRealIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (xForwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return xForwardedFor.split(',')[0].trim();
  }
  
  if (xRealIP) {
    return xRealIP;
  }
  
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  // Fallback to a default (this shouldn't happen in production)
  return '0.0.0.0';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action } = await req.json(); // 'check', 'increment_creates', 'increment_comparisons'
    
    if (!action || !['check', 'increment_creates', 'increment_comparisons'].includes(action)) {
      return new Response(JSON.stringify({ error: 'Invalid action' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const clientIP = getClientIP(req);
    console.log('Client IP:', clientIP, 'Action:', action);

    // Get or create IP usage record
    let { data: ipUsage, error: fetchError } = await supabase
      .from('ip_usage_tracking')
      .select('*')
      .eq('ip_address', clientIP)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Error fetching IP usage:', fetchError);
      return new Response(JSON.stringify({ error: 'Database error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create record if doesn't exist
    if (!ipUsage) {
      const { data: newRecord, error: insertError } = await supabase
        .from('ip_usage_tracking')
        .insert({
          ip_address: clientIP,
          creates_used: 0,
          comparisons_used: 0
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating IP usage record:', insertError);
        return new Response(JSON.stringify({ error: 'Failed to create usage record' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      ipUsage = newRecord;
    }

    // Handle different actions
    if (action === 'check') {
      return new Response(JSON.stringify({
        creates_used: ipUsage.creates_used,
        comparisons_used: ipUsage.comparisons_used,
        can_create: ipUsage.creates_used < 1,
        can_compare: ipUsage.comparisons_used < 1
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'increment_creates') {
      if (ipUsage.creates_used >= 1) {
        return new Response(JSON.stringify({ 
          error: 'Create limit reached', 
          creates_used: ipUsage.creates_used 
        }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { error: updateError } = await supabase
        .from('ip_usage_tracking')
        .update({ creates_used: ipUsage.creates_used + 1 })
        .eq('id', ipUsage.id);

      if (updateError) {
        console.error('Error updating creates:', updateError);
        return new Response(JSON.stringify({ error: 'Failed to update usage' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ 
        success: true, 
        creates_used: ipUsage.creates_used + 1 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'increment_comparisons') {
      if (ipUsage.comparisons_used >= 1) {
        return new Response(JSON.stringify({ 
          error: 'Comparison limit reached', 
          comparisons_used: ipUsage.comparisons_used 
        }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { error: updateError } = await supabase
        .from('ip_usage_tracking')
        .update({ comparisons_used: ipUsage.comparisons_used + 1 })
        .eq('id', ipUsage.id);

      if (updateError) {
        console.error('Error updating comparisons:', updateError);
        return new Response(JSON.stringify({ error: 'Failed to update usage' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ 
        success: true, 
        comparisons_used: ipUsage.comparisons_used + 1 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Error in demo-usage function:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});