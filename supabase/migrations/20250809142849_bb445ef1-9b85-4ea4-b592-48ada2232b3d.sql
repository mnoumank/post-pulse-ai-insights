
-- 1) Add foreign keys for post references in comparisons
-- Names match what your code expects: comparisons_post_a_id_fkey and comparisons_post_b_id_fkey
ALTER TABLE public.comparisons
  ADD CONSTRAINT comparisons_post_a_id_fkey FOREIGN KEY (post_a_id) REFERENCES public.posts(id) ON DELETE CASCADE,
  ADD CONSTRAINT comparisons_post_b_id_fkey FOREIGN KEY (post_b_id) REFERENCES public.posts(id) ON DELETE CASCADE;

-- Helpful index for user history queries
CREATE INDEX IF NOT EXISTS idx_comparisons_user_created ON public.comparisons(user_id, created_at DESC);

-- 2) Create Reality Check tracker table
CREATE TABLE public.comparison_actuals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  comparison_id uuid NOT NULL REFERENCES public.comparisons(id) ON DELETE CASCADE,
  -- Optional LinkedIn post URLs
  post_a_url text,
  post_b_url text,
  -- Actual metrics captured from LinkedIn
  post_a_likes integer DEFAULT 0,
  post_a_comments integer DEFAULT 0,
  post_a_shares integer DEFAULT 0,
  post_a_impressions integer DEFAULT 0,
  post_b_likes integer DEFAULT 0,
  post_b_comments integer DEFAULT 0,
  post_b_shares integer DEFAULT 0,
  post_b_impressions integer DEFAULT 0,
  -- Optional: if the user wants to explicitly mark the actual winner (0=tie, 1=A, 2=B)
  actual_winner integer,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Allow only one reality check entry per comparison (simplifies UI/UX)
ALTER TABLE public.comparison_actuals
  ADD CONSTRAINT unique_comparison_actuals UNIQUE (comparison_id);

-- Enable RLS
ALTER TABLE public.comparison_actuals ENABLE ROW LEVEL SECURITY;

-- Policies: users can only see and manage their own reality checks
CREATE POLICY "Users can view their own comparison_actuals"
  ON public.comparison_actuals
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own comparison_actuals"
  ON public.comparison_actuals
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.comparisons c
      WHERE c.id = comparison_id AND c.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own comparison_actuals"
  ON public.comparison_actuals
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comparison_actuals"
  ON public.comparison_actuals
  FOR DELETE
  USING (auth.uid() = user_id);
