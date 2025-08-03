import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface Coupon {
  id: string;
  code: string;
  title: string;
  description: string;
  type: 'percentage' | 'fixed';
  discount_value: number;
  min_amount: number;
  max_discount_amount?: number;
  end_date: string;
  is_special: boolean;
}

export interface UserCoupon {
  id: string;
  coupon_id: string;
  is_used: boolean;
  used_at?: string;
  order_id?: string;
  created_at: string;
  coupons: Coupon;
}

export function useCoupons() {
  const { user } = useAuth();
  const [availableCoupons, setAvailableCoupons] = useState<UserCoupon[]>([]);
  const [usedCoupons, setUsedCoupons] = useState<UserCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);

  // 獲取用戶的優惠券
  const fetchUserCoupons = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_coupons')
        .select(`
          *,
          coupons (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const available = data?.filter(coupon => 
        !coupon.is_used && 
        new Date(coupon.coupons.end_date) > new Date()
      ) || [];
      
      const used = data?.filter(coupon => coupon.is_used) || [];

      setAvailableCoupons(available);
      setUsedCoupons(used);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      toast.error('載入優惠券失敗');
    } finally {
      setLoading(false);
    }
  };

  // 領取優惠券
  const claimCoupon = async (couponCode: string) => {
    if (!user) {
      toast.error('請先登入');
      return false;
    }

    setClaiming(true);
    try {
      // 先查詢優惠券是否存在且有效
      const { data: coupon, error: couponError } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode)
        .eq('status', 'active')
        .gt('end_date', new Date().toISOString())
        .single();

      if (couponError || !coupon) {
        toast.error('優惠券代碼無效或已過期');
        return false;
      }

      // 檢查是否已經領取過
      const { data: existingClaim } = await supabase
        .from('user_coupons')
        .select('id')
        .eq('user_id', user.id)
        .eq('coupon_id', coupon.id)
        .single();

      if (existingClaim) {
        toast.error('您已經領取過此優惠券');
        return false;
      }

      // 領取優惠券
      const { error: claimError } = await supabase
        .from('user_coupons')
        .insert({
          user_id: user.id,
          coupon_id: coupon.id
        });

      if (claimError) throw claimError;

      toast.success('優惠券領取成功！');
      fetchUserCoupons(); // 重新載入
      return true;
    } catch (error) {
      console.error('Error claiming coupon:', error);
      toast.error('領取優惠券失敗');
      return false;
    } finally {
      setClaiming(false);
    }
  };

  // 使用優惠券 (標記為已使用)
  const useCoupon = async (userCouponId: string, orderId?: string) => {
    try {
      const { error } = await supabase
        .from('user_coupons')
        .update({
          is_used: true,
          used_at: new Date().toISOString(),
          order_id: orderId
        })
        .eq('id', userCouponId)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast.success('優惠券使用成功！');
      fetchUserCoupons(); // 重新載入
      return true;
    } catch (error) {
      console.error('Error using coupon:', error);
      toast.error('使用優惠券失敗');
      return false;
    }
  };

  // 計算優惠金額
  const calculateDiscount = (coupon: Coupon, amount: number) => {
    if (amount < coupon.min_amount) {
      return 0;
    }

    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = amount * (coupon.discount_value / 100);
    } else {
      discount = coupon.discount_value;
    }

    // 如果有最大優惠金額限制
    if (coupon.max_discount_amount && discount > coupon.max_discount_amount) {
      discount = coupon.max_discount_amount;
    }

    return Math.min(discount, amount); // 優惠不能超過原價
  };

  useEffect(() => {
    fetchUserCoupons();
  }, [user]);

  return {
    availableCoupons,
    usedCoupons,
    loading,
    claiming,
    claimCoupon,
    useCoupon,
    calculateDiscount,
    refetch: fetchUserCoupons
  };
}