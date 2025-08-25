
-- 1) Add email column to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS email text;

-- Optional but recommended: unique index on email (nulls allowed)
CREATE UNIQUE INDEX IF NOT EXISTS profiles_email_unique_idx
  ON public.profiles (email)
  WHERE email IS NOT NULL;

-- 2) Backfill emails for existing users from auth.users (one-time, server-side)
UPDATE public.profiles p
SET email = au.email
FROM auth.users au
WHERE p.id = au.id
  AND p.email IS NULL;

-- 3) Allow users to create their own profile rows (client-safe insertion when missing)
CREATE POLICY "Users can create their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 4) Let admin view all profiles (so they can export user emails)
-- Replace the admin email below if needed.
CREATE POLICY "Admin can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.profiles ap
      WHERE ap.id = auth.uid()
        AND ap.email = 'admin@postpulse.ai'
    )
  );
