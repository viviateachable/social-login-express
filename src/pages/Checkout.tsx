import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Shield, Lock, CreditCard, Truck, Receipt } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface ShippingInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
}

const Checkout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    name: '',
    phone: '',
    email: user?.email || '',
    address: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 從localStorage或路由state取得購物車資料
    const items = location.state?.cartItems || JSON.parse(localStorage.getItem('cartItems') || '[]');
    setCartItems(items);

    if (items.length === 0) {
      toast({
        title: '購物車為空',
        description: '請先添加商品到購物車',
        variant: 'destructive'
      });
      navigate('/member');
    }
  }, [location.state, navigate, toast]);

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingFee = totalAmount >= 1000 ? 0 : 100;
  const finalAmount = totalAmount + shippingFee;

  const handleInputChange = (field: keyof ShippingInfo, value: string) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitOrder = async () => {
    if (!user) {
      toast({
        title: '請先登入',
        description: '需要登入才能進行結帳',
        variant: 'destructive'
      });
      navigate('/auth');
      return;
    }

    if (!shippingInfo.name || !shippingInfo.phone || !shippingInfo.address) {
      toast({
        title: '請填寫完整資訊',
        description: '請填寫所有必填欄位',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('create_payment', {
        body: {
          orderData: {
            items: cartItems,
            shippingInfo,
            totalAmount: finalAmount
          }
        }
      });

      if (error) throw error;

      console.log('Checkout response:', data);

      // 創建表單並自動提交到藍新金流
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = data.paymentUrl;
      form.target = '_self';

      Object.entries(data.newebpayData).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value as string;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();

    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: '結帳失敗',
        description: '請稍後再試或聯繫客服',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-spa-cream via-background to-spa-warm p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary mb-2">安全結帳</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>SSL加密保護您的個人資訊安全</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 訂單資訊 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                訂單明細
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">數量: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">NT$ {(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>商品小計</span>
                  <span>NT$ {totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>運費</span>
                  <span>{shippingFee === 0 ? '免運費' : `NT$ ${shippingFee}`}</span>
                </div>
                {shippingFee === 0 && (
                  <Badge variant="secondary" className="w-fit">
                    滿1000免運費
                  </Badge>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>總計</span>
                  <span className="text-primary">NT$ {finalAmount.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 配送資訊 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                配送資訊
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">收件人姓名 *</Label>
                <Input
                  id="name"
                  value={shippingInfo.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="請輸入收件人姓名"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">聯絡電話 *</Label>
                <Input
                  id="phone"
                  value={shippingInfo.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="請輸入聯絡電話"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">電子信箱</Label>
                <Input
                  id="email"
                  type="email"
                  value={shippingInfo.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="請輸入電子信箱"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">配送地址 *</Label>
                <Input
                  id="address"
                  value={shippingInfo.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="請輸入完整配送地址"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 安全資訊 */}
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center gap-2">
                <Shield className="h-8 w-8 text-green-600" />
                <h3 className="font-semibold">SSL安全加密</h3>
                <p className="text-sm text-muted-foreground">256位元SSL加密保護</p>
              </div>
              
              <div className="flex flex-col items-center gap-2">
                <Lock className="h-8 w-8 text-blue-600" />
                <h3 className="font-semibold">隱私保護</h3>
                <p className="text-sm text-muted-foreground">個人資料嚴格保密</p>
              </div>
              
              <div className="flex flex-col items-center gap-2">
                <CreditCard className="h-8 w-8 text-purple-600" />
                <h3 className="font-semibold">安全付款</h3>
                <p className="text-sm text-muted-foreground">藍新金流安全保障</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 結帳按鈕 */}
        <div className="mt-6 flex justify-center">
          <Button 
            onClick={handleSubmitOrder}
            disabled={isLoading}
            size="lg"
            className="w-full max-w-md"
          >
            {isLoading ? '處理中...' : `確認結帳 NT$ ${finalAmount.toLocaleString()}`}
          </Button>
        </div>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          點擊「確認結帳」即表示您同意我們的服務條款和隱私政策
        </div>
      </div>
    </div>
  );
};

export default Checkout;