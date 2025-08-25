-- Add is_admin column to profiles table
ALTER TABLE public.profiles ADD COLUMN is_admin BOOLEAN NOT NULL DEFAULT false;

-- Create security definer function to check admin status
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT COALESCE(is_admin, false) 
  FROM profiles 
  WHERE id = auth.uid();
$$;

-- Update admin policy to use the secure function
DROP POLICY IF EXISTS "Admin can view all profiles" ON public.profiles;
CREATE POLICY "Admin can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (public.is_current_user_admin());

-- Strengthen profile update policy to prevent is_admin changes
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id) 
WITH CHECK (auth.uid() = id AND (is_admin IS NOT DISTINCT FROM (SELECT is_admin FROM profiles WHERE id = auth.uid())));

-- Set the admin user (replace with actual admin user ID if known)
-- This will need to be done manually in Supabase dashboard for the real admin account