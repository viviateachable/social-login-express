import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, XCircle, Clock, Receipt, ArrowLeft, Home } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface PaymentResult {
  status: 'success' | 'failed' | 'pending';
  orderNumber?: string;
  amount?: number;
  tradeNo?: string;
  paymentType?: string;
  message?: string;
  orderDetails?: {
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
    shippingInfo: {
      name: string;
      phone: string;
      address: string;
    };
  };
}

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [result, setResult] = useState<PaymentResult>({ status: 'pending' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkPaymentResult = async () => {
      try {
        // 從URL參數取得結果
        const status = searchParams.get('Status');
        const merchantOrderNo = searchParams.get('MerchantOrderNo');
        const tradeNo = searchParams.get('TradeNo');
        const amt = searchParams.get('Amt');
        const paymentType = searchParams.get('PaymentType');
        const respondCode = searchParams.get('RespondCode');
        const respondMsg = searchParams.get('RespondMsg');

        console.log('Payment result params:', {
          status, merchantOrderNo, tradeNo, amt, paymentType, respondCode, respondMsg
        });

        let paymentStatus: 'success' | 'failed' | 'pending' = 'pending';
        let message = '處理中...';

        if (status === 'SUCCESS' && respondCode === '00') {
          paymentStatus = 'success';
          message = '付款成功！';
        } else if (status === 'FAILED' || respondCode !== '00') {
          paymentStatus = 'failed';
          message = respondMsg || '付款失敗';
        }

        // 如果有訂單編號，嘗試從資料庫取得訂單詳情
        let orderDetails = null;
        if (merchantOrderNo) {
          const { data: order } = await supabase
            .from('orders')
            .select('*')
            .eq('order_number', merchantOrderNo)
            .single();

          if (order) {
            orderDetails = {
              items: order.items,
              shippingInfo: order.shipping_info
            };
          }
        }

        setResult({
          status: paymentStatus,
          orderNumber: merchantOrderNo || undefined,
          amount: amt ? parseFloat(amt) : undefined,
          tradeNo: tradeNo || undefined,
          paymentType: paymentType || undefined,
          message,
          orderDetails
        });

        // 清除購物車
        if (paymentStatus === 'success') {
          localStorage.removeItem('cartItems');
        }

      } catch (error) {
        console.error('Error checking payment result:', error);
        setResult({
          status: 'failed',
          message: '無法確認付款狀態，請聯繫客服'
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkPaymentResult();
  }, [searchParams]);

  const getStatusIcon = () => {
    switch (result.status) {
      case 'success':
        return <CheckCircle className="h-16 w-16 text-green-600" />;
      case 'failed':
        return <XCircle className="h-16 w-16 text-red-600" />;
      default:
        return <Clock className="h-16 w-16 text-yellow-600" />;
    }
  };

  const getStatusColor = () => {
    switch (result.status) {
      case 'success':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  const getStatusBadge = () => {
    switch (result.status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">付款成功</Badge>;
      case 'failed':
        return <Badge variant="destructive">付款失敗</Badge>;
      default:
        return <Badge variant="secondary">處理中</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-spa-cream via-background to-spa-warm flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Clock className="h-16 w-16 text-yellow-600 animate-spin" />
              <h2 className="text-xl font-semibold">確認付款狀態中...</h2>
              <p className="text-muted-foreground text-center">請稍候，正在處理您的付款資訊</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-spa-cream via-background to-spa-warm p-4">
      <div className="max-w-2xl mx-auto">
        {/* 付款狀態卡片 */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              {getStatusIcon()}
              <div>
                <h1 className={`text-2xl font-bold ${getStatusColor()}`}>
                  {result.message}
                </h1>
                {getStatusBadge()}
              </div>
              
              {result.orderNumber && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">訂單編號</p>
                  <p className="font-mono text-lg font-semibold">{result.orderNumber}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 交易詳情 */}
        {(result.amount || result.tradeNo || result.paymentType) && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                交易詳情
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {result.amount && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">交易金額</span>
                  <span className="font-semibold">NT$ {result.amount.toLocaleString()}</span>
                </div>
              )}
              
              {result.tradeNo && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">交易編號</span>
                  <span className="font-mono text-sm">{result.tradeNo}</span>
                </div>
              )}
              
              {result.paymentType && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">付款方式</span>
                  <span>{result.paymentType}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">交易時間</span>
                <span>{new Date().toLocaleString('zh-TW')}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 訂單明細 */}
        {result.orderDetails && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>訂單明細</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.orderDetails.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">數量: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">NT$ {(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
              
              <Separator />
              
              <div>
                <h4 className="font-semibold mb-2">配送資訊</h4>
                <div className="space-y-1 text-sm">
                  <p><span className="text-muted-foreground">收件人：</span>{result.orderDetails.shippingInfo.name}</p>
                  <p><span className="text-muted-foreground">聯絡電話：</span>{result.orderDetails.shippingInfo.phone}</p>
                  <p><span className="text-muted-foreground">配送地址：</span>{result.orderDetails.shippingInfo.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 後續動作 */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {result.status === 'success' && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">付款完成！</h3>
                  <p className="text-green-700 text-sm">
                    您的訂單已成功建立，我們會盡快為您處理並安排出貨。
                    相關通知將發送至您的信箱。
                  </p>
                </div>
              )}
              
              {result.status === 'failed' && (
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-red-800 mb-2">付款失敗</h3>
                  <p className="text-red-700 text-sm">
                    很抱歉，您的付款未能成功處理。請檢查付款資訊後重新嘗試，
                    或聯繫客服尋求協助。
                  </p>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={() => navigate('/member')}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  返回會員中心
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="flex items-center gap-2"
                >
                  <Home className="h-4 w-4" />
                  回到首頁
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentResult;