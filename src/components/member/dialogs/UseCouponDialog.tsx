import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  ShoppingCart, 
  Gift, 
  Calculator, 
  ArrowRight,
  Percent,
  DollarSign
} from 'lucide-react';
import { UserCoupon, useCoupons } from '@/hooks/useCoupons';
import { toast } from 'sonner';

interface UseCouponDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userCoupon: UserCoupon | null;
}

export function UseCouponDialog({ open, onOpenChange, userCoupon }: UseCouponDialogProps) {
  const navigate = useNavigate();
  const { calculateDiscount, useCoupon } = useCoupons();
  const [amount, setAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!userCoupon) return null;

  const { coupons: coupon } = userCoupon;
  const numericAmount = parseFloat(amount) || 0;
  const discount = calculateDiscount(coupon, numericAmount);
  const finalAmount = numericAmount - discount;
  const canUse = numericAmount >= coupon.min_amount && numericAmount > 0;

  const handleDirectUse = () => {
    // 直接使用 - 導向結帳頁面並帶上優惠券資訊
    const checkoutData = {
      selectedCoupon: userCoupon,
      items: [
        {
          id: 'spa-service',
          name: 'SPA 服務',
          price: coupon.min_amount,
          quantity: 1,
          image: '/placeholder.svg'
        }
      ]
    };
    
    localStorage.setItem('checkoutData', JSON.stringify(checkoutData));
    onOpenChange(false);
    navigate('/checkout');
  };

  const handleUseWithAmount = async () => {
    if (!canUse) {
      toast.error(`最低消費金額為 NT$ ${coupon.min_amount.toLocaleString()}`);
      return;
    }

    setIsProcessing(true);
    try {
      // 在實際應用中，這裡會創建訂單並使用優惠券
      // 目前先模擬使用優惠券
      await useCoupon(userCoupon.id);
      
      toast.success('優惠券使用成功！');
      onOpenChange(false);
      setAmount('');
    } catch (error) {
      console.error('Error using coupon:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDiscount = () => {
    if (coupon.type === 'percentage') {
      return `${coupon.discount_value}% OFF`;
    } else {
      return `NT$ ${coupon.discount_value.toLocaleString()}`;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-primary" />
            使用優惠券
          </DialogTitle>
          <DialogDescription>
            選擇使用方式來享受您的專屬優惠
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 優惠券資訊 */}
          <Card className="border-0 bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold">{coupon.title}</h4>
                  <p className="text-sm text-muted-foreground">{coupon.description}</p>
                </div>
                <Badge className="bg-secondary/10 text-secondary">
                  {formatDiscount()}
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign className="w-4 h-4" />
                  最低消費: NT$ {coupon.min_amount.toLocaleString()}
                </div>
                {coupon.max_discount_amount && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Percent className="w-4 h-4" />
                    最高折抵: NT$ {coupon.max_discount_amount.toLocaleString()}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 使用方式選擇 */}
          <div className="space-y-4">
            {/* 方式一：直接使用 */}
            <div className="space-y-3">
              <h5 className="font-medium">方式一：立即購物</h5>
              <Button 
                onClick={handleDirectUse}
                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                前往購物並使用優惠券
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <Separator />

            {/* 方式二：計算優惠 */}
            <div className="space-y-3">
              <h5 className="font-medium">方式二：計算優惠金額</h5>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="amount">輸入消費金額</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="請輸入金額"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="0"
                    step="1"
                  />
                </div>

                {numericAmount > 0 && (
                  <Card className="border-0 bg-accent/30">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Calculator className="w-4 h-4" />
                        <span className="text-sm font-medium">優惠計算</span>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>原價:</span>
                          <span>NT$ {numericAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-green-600">
                          <span>優惠:</span>
                          <span>- NT$ {discount.toLocaleString()}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-medium">
                          <span>實付:</span>
                          <span>NT$ {finalAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          {amount && (
            <Button 
              onClick={handleUseWithAmount}
              disabled={!canUse || isProcessing}
            >
              {isProcessing ? '處理中...' : '確認使用'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}