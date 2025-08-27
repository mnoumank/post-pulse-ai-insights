-- Create table for tracking IP-based usage for demo users
CREATE TABLE public.ip_usage_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address INET NOT NULL,
  creates_used INTEGER NOT NULL DEFAULT 0,
  comparisons_used INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create unique index on ip_address
CREATE UNIQUE INDEX idx_ip_usage_tracking_ip ON public.ip_usage_tracking(ip_address);

-- Enable RLS
ALTER TABLE public.ip_usage_tracking ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read and insert their own IP usage
CREATE POLICY "Anyone can manage their IP usage" 
ON public.ip_usage_tracking 
FOR ALL
USING (true)
WITH CHECK (true);

-- Create function to update timestamps
CREATE TRIGGER update_ip_usage_tracking_updated_at
BEFORE UPDATE ON public.ip_usage_tracking
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();