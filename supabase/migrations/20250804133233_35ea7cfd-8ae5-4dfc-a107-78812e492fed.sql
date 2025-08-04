-- 修復函數的 search_path 安全問題
CREATE OR REPLACE FUNCTION public.claim_test_coupons()
RETURNS TEXT AS $$
DECLARE
    user_uuid UUID;
    result_text TEXT := '';
BEGIN
    -- 獲取當前用戶 ID
    user_uuid := auth.uid();
    
    IF user_uuid IS NULL THEN
        RETURN 'Error: User not authenticated';
    END IF;
    
    -- 為用戶添加測試優惠券（如果還沒有的話）
    INSERT INTO public.user_coupons (user_id, coupon_id)
    SELECT 
        user_uuid,
        c.id
    FROM public.coupons c
    WHERE c.code IN ('BIRTHDAY2024', 'WELCOME50')
      AND NOT EXISTS (
        SELECT 1 FROM public.user_coupons uc 
        WHERE uc.user_id = user_uuid AND uc.coupon_id = c.id
      );
    
    result_text := 'Test coupons claimed successfully for user: ' || user_uuid::text;
    RETURN result_text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';