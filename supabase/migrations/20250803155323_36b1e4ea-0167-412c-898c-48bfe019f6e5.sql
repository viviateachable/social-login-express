-- 建立優惠券相關表格

-- 優惠券類型枚舉
CREATE TYPE public.coupon_type AS ENUM ('percentage', 'fixed');
CREATE TYPE public.coupon_status AS ENUM ('active', 'inactive', 'expired');

-- 優惠券主表
CREATE TABLE public.coupons (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    type coupon_type NOT NULL,
    discount_value NUMERIC NOT NULL,
    min_amount NUMERIC DEFAULT 0,
    max_discount_amount NUMERIC,
    usage_limit INTEGER,
    used_count INTEGER DEFAULT 0,
    status coupon_status DEFAULT 'active',
    start_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    is_special BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 用戶優惠券關聯表 (用戶領取的優惠券)
CREATE TABLE public.user_coupons (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    coupon_id UUID NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
    is_used BOOLEAN DEFAULT false,
    used_at TIMESTAMP WITH TIME ZONE,
    order_id UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, coupon_id)
);

-- 啟用 RLS
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_coupons ENABLE ROW LEVEL SECURITY;

-- 優惠券表政策 (所有人可以查看有效的優惠券)
CREATE POLICY "Everyone can view active coupons" 
ON public.coupons 
FOR SELECT 
USING (status = 'active' AND end_date > now());

-- 用戶優惠券政策
CREATE POLICY "Users can view their own coupons" 
ON public.user_coupons 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own coupons" 
ON public.user_coupons 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own coupons" 
ON public.user_coupons 
FOR UPDATE 
USING (auth.uid() = user_id);

-- 更新時間觸發器
CREATE TRIGGER update_coupons_updated_at
    BEFORE UPDATE ON public.coupons
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- 插入一些測試數據
INSERT INTO public.coupons (code, title, description, type, discount_value, min_amount, end_date, is_special) VALUES
('BIRTHDAY2024', '生日專屬優惠', '全館商品享9折優惠', 'percentage', 10, 500, '2024-12-31', true),
('SPA300', 'SPA療程折扣券', 'SPA療程滿2000折300', 'fixed', 300, 2000, '2024-12-31', false),
('NEWMEMBER', '新會員專享', '首次購買享8折優惠', 'percentage', 20, 1000, '2024-12-31', false),
('WELCOME50', '新會員禮', '滿500折50元', 'fixed', 50, 500, '2024-12-31', false);