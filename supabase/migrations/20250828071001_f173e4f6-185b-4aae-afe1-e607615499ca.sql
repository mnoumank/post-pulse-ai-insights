
-- Table: public.ip_usage_tracking
-- Purpose: Track per-IP demo usage (1 create, 1 comparison) without requiring signup

CREATE TABLE IF NOT EXISTS public.ip_usage_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address INET NOT NULL,
  creates_used INTEGER NOT NULL DEFAULT 0,
  comparisons_used INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ensure one row per IP
CREATE UNIQUE INDEX IF NOT EXISTS idx_ip_usage_tracking_ip ON public.ip_usage_tracking(ip_address);

-- Keep updated_at current
CREATE TRIGGER update_ip_usage_tracking_updated_at
BEFORE UPDATE ON public.ip_usage_tracking
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.ip_usage_tracking ENABLE ROW LEVEL SECURITY;

-- NOTE:
-- We intentionally add NO public policies here.
-- All reads/writes will happen from Edge Functions using the Service Role key,
-- which bypasses RLS. This prevents direct client-side tampering.

