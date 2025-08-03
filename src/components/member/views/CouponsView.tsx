import { Gift, Calendar, Percent, Tag, Copy, Check, Plus, Ticket } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';
import { useCoupons, UserCoupon } from '@/hooks/useCoupons';
import { UseCouponDialog } from '@/components/member/dialogs/UseCouponDialog';
import { ClaimCouponDialog } from '@/components/member/dialogs/ClaimCouponDialog';
import { format } from 'date-fns';

export function CouponsView() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedCoupon, setSelectedCoupon] = useState<UserCoupon | null>(null);
  const [showUseCouponDialog, setShowUseCouponDialog] = useState(false);
  const [showClaimDialog, setShowClaimDialog] = useState(false);
  
  const { availableCoupons, usedCoupons, loading } = useCoupons();

  // 計算過期的優惠券 (在前端過濾)
  const expiredCoupons = availableCoupons.filter(coupon => 
    new Date(coupon.coupons.end_date) <= new Date()
  );

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatDiscount = (coupon: any) => {
    if (coupon.coupons) {
      // 來自資料庫的格式
      const { type, discount_value } = coupon.coupons;
      return type === 'percentage' ? `${discount_value}% OFF` : `NT$ ${discount_value.toLocaleString()}`;
    }
    return coupon.discount; // 舊格式兼容
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'yyyy-MM-dd');
  };

  const handleUseCoupon = (coupon: UserCoupon) => {
    setSelectedCoupon(coupon);
    setShowUseCouponDialog(true);
  };

  const CouponCard = ({ coupon, type }: { coupon: UserCoupon | any; type: 'available' | 'used' | 'expired' }) => {
    const couponData = coupon.coupons || coupon; // 支援新舊格式
    const isFromDB = !!coupon.coupons;
    
    return (
    <Card className={`border-0 shadow-soft bg-card/50 backdrop-blur-sm relative overflow-hidden ${
      couponData.is_special ? 'ring-2 ring-secondary/50' : ''
    }`}>
      {couponData.is_special && (
        <div className="absolute -top-1 -right-8 bg-secondary text-secondary-foreground text-xs px-8 py-1 rotate-12 transform">
          特別優惠
        </div>
      )}
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-full ${
              type === 'available' ? 'bg-primary/10' :
              type === 'used' ? 'bg-green-100' : 'bg-gray-100'
            }`}>
              {type === 'available' ? (
                <Gift className="w-6 h-6 text-primary" />
              ) : type === 'used' ? (
                <Check className="w-6 h-6 text-green-600" />
              ) : (
                <Calendar className="w-6 h-6 text-gray-500" />
              )}
            </div>
            <div>
              <CardTitle className="text-lg">{couponData.title}</CardTitle>
              <CardDescription>{couponData.description}</CardDescription>
            </div>
          </div>
          <div className="text-right">
            <Badge className={`text-lg font-bold px-3 py-1 ${
              type === 'available' ? 'bg-secondary/10 text-secondary' :
              type === 'used' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
            }`}>
              {formatDiscount(coupon)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* 優惠券代碼 */}
          <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg border-2 border-dashed border-border">
            <div>
              <p className="text-sm text-muted-foreground mb-1">優惠券代碼</p>
              <p className="font-mono font-bold text-lg">{couponData.code}</p>
            </div>
            {type === 'available' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopyCode(couponData.code)}
                className="shrink-0"
              >
                {copiedCode === couponData.code ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    已複製
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    複製
                  </>
                )}
              </Button>
            )}
          </div>

          {/* 使用條件 */}
          <div className="space-y-2">
            {(couponData.min_amount || couponData.minAmount) && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Tag className="w-4 h-4" />
                最低消費: NT$ {(couponData.min_amount || couponData.minAmount).toLocaleString()}
              </div>
            )}
            
            {type === 'available' && couponData.end_date && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                有效期限: {formatDate(couponData.end_date)}
              </div>
            )}

            {type === 'used' && (
              <>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <Check className="w-4 h-4" />
                  使用日期: {coupon.used_at ? formatDate(coupon.used_at) : coupon.usedDate}
                </div>
                {(coupon.order_id || coupon.orderNumber) && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Tag className="w-4 h-4" />
                    訂單號碼: {coupon.order_id || coupon.orderNumber}
                  </div>
                )}
              </>
            )}

            {type === 'expired' && couponData.end_date && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <Calendar className="w-4 h-4" />
                已過期: {formatDate(couponData.end_date)}
              </div>
            )}
          </div>

          {/* 操作按鈕 */}
          {type === 'available' && isFromDB && (
            <Button 
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              onClick={() => handleUseCoupon(coupon as UserCoupon)}
            >
              立即使用
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* 頁面標題 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">優惠券管理</h2>
          <p className="text-muted-foreground">查看和使用您的專屬優惠券</p>
        </div>
        <Button 
          onClick={() => setShowClaimDialog(true)}
          className="bg-gradient-to-r from-primary to-secondary"
        >
          <Plus className="w-4 h-4 mr-2" />
          領取優惠券
        </Button>
      </div>

      {/* 優惠券統計 */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-0 shadow-soft">
              <CardContent className="p-6 text-center">
                <Skeleton className="w-8 h-8 mx-auto mb-2" />
                <Skeleton className="w-8 h-8 mx-auto mb-2" />
                <Skeleton className="w-20 h-4 mx-auto" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-soft bg-gradient-to-br from-primary/10 to-primary-light/10">
            <CardContent className="p-6 text-center">
              <Gift className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-primary">{availableCoupons.length}</p>
              <p className="text-sm text-muted-foreground">可用優惠券</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-soft bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6 text-center">
              <Check className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">{usedCoupons.length}</p>
              <p className="text-sm text-muted-foreground">已使用</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-soft bg-gradient-to-br from-gray-50 to-gray-100">
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 text-gray-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-500">{expiredCoupons.length}</p>
              <p className="text-sm text-muted-foreground">已過期</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="available" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="available">可用 ({availableCoupons.length})</TabsTrigger>
          <TabsTrigger value="used">已使用 ({usedCoupons.length})</TabsTrigger>
          <TabsTrigger value="expired">已過期 ({expiredCoupons.length})</TabsTrigger>
        </TabsList>

        {/* 可用優惠券 */}
        <TabsContent value="available" className="space-y-4">
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="border-0 shadow-soft">
                  <CardContent className="p-6">
                    <Skeleton className="w-full h-32" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : availableCoupons.length === 0 ? (
            <Card className="border-0 shadow-soft bg-card/50 backdrop-blur-sm">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Ticket className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">沒有可用的優惠券</h3>
                <p className="text-muted-foreground text-center mb-4">
                  點擊右上角「領取優惠券」按鈕來獲取專屬優惠！
                </p>
                <Button 
                  onClick={() => setShowClaimDialog(true)}
                  className="bg-gradient-to-r from-primary to-secondary"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  領取優惠券
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {availableCoupons.map((coupon) => (
                <CouponCard key={coupon.id} coupon={coupon} type="available" />
              ))}
            </div>
          )}
        </TabsContent>

        {/* 已使用優惠券 */}
        <TabsContent value="used" className="space-y-4">
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <Card key={i} className="border-0 shadow-soft">
                  <CardContent className="p-6">
                    <Skeleton className="w-full h-32" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : usedCoupons.length === 0 ? (
            <Card className="border-0 shadow-soft bg-card/50 backdrop-blur-sm">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Check className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">尚未使用任何優惠券</h3>
                <p className="text-muted-foreground text-center">
                  使用過的優惠券紀錄會顯示在這裡
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {usedCoupons.map((coupon) => (
                <CouponCard key={coupon.id} coupon={coupon} type="used" />
              ))}
            </div>
          )}
        </TabsContent>

        {/* 已過期優惠券 */}
        <TabsContent value="expired" className="space-y-4">
          {expiredCoupons.length === 0 ? (
            <Card className="border-0 shadow-soft bg-card/50 backdrop-blur-sm">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">沒有過期的優惠券</h3>
                <p className="text-muted-foreground text-center">
                  過期的優惠券會顯示在這裡
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {expiredCoupons.map((coupon) => (
                <CouponCard key={coupon.id} coupon={coupon} type="expired" />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* 對話框 */}
      <UseCouponDialog
        open={showUseCouponDialog}
        onOpenChange={setShowUseCouponDialog}
        userCoupon={selectedCoupon}
      />
      
      <ClaimCouponDialog
        open={showClaimDialog}
        onOpenChange={setShowClaimDialog}
      />
    </div>
  );
}