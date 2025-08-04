import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Gift, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';

interface Reward {
  id: number;
  name: string;
  points: number;
  description: string;
  type: 'coupon' | 'product' | 'service';
  stock: number | 'unlimited';
}

interface RedeemPointsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reward: Reward | null;
  userPoints: number;
  onRedeemSuccess: (pointsUsed: number, rewardName: string) => void;
}

export function RedeemPointsDialog({
  open,
  onOpenChange,
  reward,
  userPoints,
  onRedeemSuccess
}: RedeemPointsDialogProps) {
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redeemSuccess, setRedeemSuccess] = useState(false);
  const { toast } = useToast();

  const handleRedeem = async () => {
    if (!reward) return;

    setIsRedeeming(true);
    
    try {
      // 模擬API請求
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 模擬成功兌換
      setRedeemSuccess(true);
      
      // 延遲顯示成功狀態
      setTimeout(() => {
        onRedeemSuccess(reward.points, reward.name);
        setRedeemSuccess(false);
        onOpenChange(false);
        
        toast({
          title: "兌換成功！",
          description: `您已成功兌換 ${reward.name}`,
        });
      }, 1500);
      
    } catch (error) {
      toast({
        title: "兌換失敗",
        description: "系統暫時無法處理您的兌換請求，請稍後再試",
        variant: "destructive",
      });
    } finally {
      setIsRedeeming(false);
    }
  };

  const handleClose = () => {
    if (!isRedeeming && !redeemSuccess) {
      onOpenChange(false);
    }
  };

  if (!reward) return null;

  const canRedeem = userPoints >= reward.points && reward.stock !== 0;
  const isOutOfStock = reward.stock === 0;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-secondary" />
            點數兌換確認
          </DialogTitle>
          <DialogDescription>
            請確認您要兌換的商品資訊
          </DialogDescription>
        </DialogHeader>

        {redeemSuccess ? (
          <div className="py-8 text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <div>
              <h3 className="text-xl font-bold text-green-600">兌換成功！</h3>
              <p className="text-muted-foreground mt-2">
                您已成功兌換 {reward.name}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 商品資訊卡片 */}
            <Card className="border border-secondary/20">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{reward.name}</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      {reward.description}
                    </p>
                  </div>
                  <Badge 
                    className={`ml-2 ${
                      reward.type === 'coupon' ? 'bg-blue-100 text-blue-800' :
                      reward.type === 'product' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {reward.type === 'coupon' ? '優惠券' :
                     reward.type === 'product' ? '商品' : '服務'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-secondary" />
                    <span className="text-xl font-bold text-secondary">
                      {reward.points.toLocaleString()} 點
                    </span>
                  </div>
                  {reward.stock !== 'unlimited' && (
                    <span className={`text-sm ${isOutOfStock ? 'text-red-600' : 'text-muted-foreground'}`}>
                      {isOutOfStock ? '已售完' : `庫存: ${reward.stock}`}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 點數餘額檢查 */}
            <div className="bg-accent/30 p-4 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">您的可用點數</span>
                <span className="font-bold">{userPoints.toLocaleString()} 點</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">兌換所需點數</span>
                <span className="font-bold text-secondary">-{reward.points.toLocaleString()} 點</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">兌換後餘額</span>
                  <span className={`font-bold ${canRedeem ? 'text-green-600' : 'text-red-600'}`}>
                    {(userPoints - reward.points).toLocaleString()} 點
                  </span>
                </div>
              </div>
            </div>

            {/* 警告訊息 */}
            {!canRedeem && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <div className="text-sm">
                  {isOutOfStock ? (
                    <span className="text-red-700">此商品目前缺貨中</span>
                  ) : (
                    <span className="text-red-700">
                      您的點數不足，還需要 {(reward.points - userPoints).toLocaleString()} 點
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* 兌換須知 */}
            <div className="text-xs text-muted-foreground space-y-1 bg-accent/20 p-3 rounded-lg">
              <p>• 點數兌換後無法退換或取消</p>
              <p>• 優惠券將發送至您的會員中心</p>
              <p>• 實體商品將於3-5個工作日內寄出</p>
              <p>• 服務券請提前預約使用</p>
            </div>
          </div>
        )}

        {!redeemSuccess && (
          <DialogFooter>
            <Button variant="outline" onClick={handleClose} disabled={isRedeeming}>
              取消
            </Button>
            <Button 
              onClick={handleRedeem}
              disabled={!canRedeem || isRedeeming}
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            >
              {isRedeeming ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  兌換中...
                </>
              ) : (
                '確認兌換'
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}