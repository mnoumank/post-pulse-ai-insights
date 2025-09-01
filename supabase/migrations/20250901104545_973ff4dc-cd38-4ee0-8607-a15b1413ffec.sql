-- Fix security vulnerability: Restrict access to ip_usage_tracking table
-- Remove the overly permissive policy that allows anyone to access IP data

DROP POLICY IF EXISTS "Anyone can manage their IP usage" ON public.ip_usage_tracking;

-- Create restrictive policies that only allow:
-- 1. Admins to view all data for analytics
-- 2. Edge functions to manage data (they use service role which bypasses RLS)

-- Allow admins to view IP usage data for analytics purposes
CREATE POLICY "Admins can view IP usage data" 
ON public.ip_usage_tracking 
FOR SELECT 
USING (is_current_user_admin());

-- Note: Edge functions use service role key which bypasses RLS,
-- so the demo-usage function will continue to work normally
-- Regular users will no longer be able to access IP data directly