import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Gift, Ticket } from 'lucide-react';
import { useCoupons } from '@/hooks/useCoupons';

interface ClaimCouponDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClaimCouponDialog({ open, onOpenChange }: ClaimCouponDialogProps) {
  const [couponCode, setCouponCode] = useState('');
  const { claimCoupon, claiming } = useCoupons();

  const handleClaim = async () => {
    if (!couponCode.trim()) return;

    const success = await claimCoupon(couponCode.trim().toUpperCase());
    if (success) {
      setCouponCode('');
      onOpenChange(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleClaim();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-primary" />
            領取優惠券
          </DialogTitle>
          <DialogDescription>
            輸入優惠券代碼來領取專屬優惠
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="couponCode">優惠券代碼</Label>
            <Input
              id="couponCode"
              placeholder="請輸入優惠券代碼"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              onKeyPress={handleKeyPress}
              className="font-mono"
            />
          </div>

          <div className="text-sm text-muted-foreground space-y-1">
            <p>• 優惠券代碼不區分大小寫</p>
            <p>• 每張優惠券只能領取一次</p>
            <p>• 請在有效期限內使用</p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button 
            onClick={handleClaim}
            disabled={!couponCode.trim() || claiming}
            className="bg-gradient-to-r from-primary to-secondary"
          >
            {claiming ? (
              <>
                <Gift className="w-4 h-4 mr-2 animate-spin" />
                領取中...
              </>
            ) : (
              <>
                <Gift className="w-4 h-4 mr-2" />
                領取優惠券
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}