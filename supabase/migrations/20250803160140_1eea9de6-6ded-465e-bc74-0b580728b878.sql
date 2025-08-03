-- 為當前登入用戶添加一些測試優惠券
-- 注意：這些SQL語句將為任何執行的用戶創建測試數據

-- 首先檢查是否已經有測試數據，避免重複插入
INSERT INTO public.user_coupons (user_id, coupon_id)
SELECT 
    auth.uid(),
    c.id
FROM public.coupons c
WHERE c.code IN ('BIRTHDAY2024', 'WELCOME50')
  AND NOT EXISTS (
    SELECT 1 FROM public.user_coupons uc 
    WHERE uc.user_id = auth.uid() AND uc.coupon_id = c.id
  );