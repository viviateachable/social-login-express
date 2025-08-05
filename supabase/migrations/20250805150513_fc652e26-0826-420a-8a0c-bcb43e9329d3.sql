-- Create addresses table for user shipping addresses
CREATE TABLE public.addresses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  address_line_1 TEXT NOT NULL,
  address_line_2 TEXT,
  city TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create login_logs table for security tracking
CREATE TABLE public.login_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ip_address INET,
  user_agent TEXT,
  location TEXT,
  device_info JSONB,
  login_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.login_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for addresses
CREATE POLICY "Users can view their own addresses" 
ON public.addresses 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own addresses" 
ON public.addresses 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own addresses" 
ON public.addresses 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own addresses" 
ON public.addresses 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for login_logs
CREATE POLICY "Users can view their own login logs" 
ON public.login_logs 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can insert login logs" 
ON public.login_logs 
FOR INSERT 
WITH CHECK (true);

-- Create trigger for updating addresses timestamps
CREATE TRIGGER update_addresses_updated_at
  BEFORE UPDATE ON public.addresses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_addresses_user_id ON public.addresses(user_id);
CREATE INDEX idx_addresses_default ON public.addresses(user_id, is_default) WHERE is_default = true;
CREATE INDEX idx_login_logs_user_id ON public.login_logs(user_id);
CREATE INDEX idx_login_logs_login_at ON public.login_logs(login_at DESC);