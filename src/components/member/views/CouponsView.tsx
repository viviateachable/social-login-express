import { Gift, Calendar, Percent, Tag, Copy, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';

export function CouponsView() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const availableCoupons = [
    {
      id: 1,
      code: 'BIRTHDAY2024',
      title: '生日專屬優惠',
      description: '全館商品享9折優惠',
      discount: '10% OFF',
      minAmount: 500,
      expiryDate: '2024-02-29',
      type: 'percentage',
      isSpecial: true
    },
    {
      id: 2,
      code: 'SPA300',
      title: 'SPA療程折扣券',
      description: 'SPA療程滿2000折300',
      discount: 'NT$ 300',
      minAmount: 2000,
      expiryDate: '2024-03-15',
      type: 'fixed',
      isSpecial: false
    },
    {
      id: 3,
      code: 'NEWMEMBER',
      title: '新會員專享',
      description: '首次購買享8折優惠',
      discount: '20% OFF',
      minAmount: 1000,
      expiryDate: '2024-04-30',
      type: 'percentage',
      isSpecial: false
    }
  ];

  const usedCoupons = [
    {
      id: 4,
      code: 'WELCOME50',
      title: '新會員禮',
      description: '滿500折50元',
      discount: 'NT$ 50',
      usedDate: '2024-01-15',
      orderNumber: '#202401001'
    },
    {
      id: 5,
      code: 'XMAS2023',
      title: '聖誕特惠',
      description: '全館商品85折',
      discount: '15% OFF',
      usedDate: '2023-12-25',
      orderNumber: '#202312025'
    }
  ];

  const expiredCoupons = [
    {
      id: 6,
      code: 'SUMMER2023',
      title: '夏日清爽優惠',
      description: '精油商品7折',
      discount: '30% OFF',
      expiryDate: '2023-08-31'
    }
  ];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const CouponCard = ({ coupon, type }: { coupon: any; type: 'available' | 'used' | 'expired' }) => (
    <Card className={`border-0 shadow-soft bg-card/50 backdrop-blur-sm relative overflow-hidden ${
      coupon.isSpecial ? 'ring-2 ring-secondary/50' : ''
    }`}>
      {coupon.isSpecial && (
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
              <CardTitle className="text-lg">{coupon.title}</CardTitle>
              <CardDescription>{coupon.description}</CardDescription>
            </div>
          </div>
          <div className="text-right">
            <Badge className={`text-lg font-bold px-3 py-1 ${
              type === 'available' ? 'bg-secondary/10 text-secondary' :
              type === 'used' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
            }`}>
              {coupon.discount}
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
              <p className="font-mono font-bold text-lg">{coupon.code}</p>
            </div>
            {type === 'available' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopyCode(coupon.code)}
                className="shrink-0"
              >
                {copiedCode === coupon.code ? (
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
            {coupon.minAmount && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Tag className="w-4 h-4" />
                最低消費: NT$ {coupon.minAmount.toLocaleString()}
              </div>
            )}
            
            {type === 'available' && coupon.expiryDate && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                有效期限: {coupon.expiryDate}
              </div>
            )}

            {type === 'used' && (
              <>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <Check className="w-4 h-4" />
                  使用日期: {coupon.usedDate}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Tag className="w-4 h-4" />
                  訂單號碼: {coupon.orderNumber}
                </div>
              </>
            )}

            {type === 'expired' && coupon.expiryDate && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <Calendar className="w-4 h-4" />
                已過期: {coupon.expiryDate}
              </div>
            )}
          </div>

          {/* 操作按鈕 */}
          {type === 'available' && (
            <Button 
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            >
              立即使用
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* 頁面標題 */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">優惠券管理</h2>
        <p className="text-muted-foreground">查看和使用您的專屬優惠券</p>
      </div>

      {/* 優惠券統計 */}
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

      <Tabs defaultValue="available" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="available">可用 ({availableCoupons.length})</TabsTrigger>
          <TabsTrigger value="used">已使用 ({usedCoupons.length})</TabsTrigger>
          <TabsTrigger value="expired">已過期 ({expiredCoupons.length})</TabsTrigger>
        </TabsList>

        {/* 可用優惠券 */}
        <TabsContent value="available" className="space-y-4">
          {availableCoupons.length === 0 ? (
            <Card className="border-0 shadow-soft bg-card/50 backdrop-blur-sm">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Gift className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">沒有可用的優惠券</h3>
                <p className="text-muted-foreground text-center mb-4">
                  持續關注我們的最新活動，獲取更多優惠券！
                </p>
                <Button className="bg-gradient-to-r from-primary to-secondary">
                  瀏覽最新活動
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {usedCoupons.map((coupon) => (
              <CouponCard key={coupon.id} coupon={coupon} type="used" />
            ))}
          </div>
        </TabsContent>

        {/* 已過期優惠券 */}
        <TabsContent value="expired" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {expiredCoupons.map((coupon) => (
              <CouponCard key={coupon.id} coupon={coupon} type="expired" />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}