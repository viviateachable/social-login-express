import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, AlertCircle, Clock } from 'lucide-react';

interface ImmediatePaymentDialogProps {
  order: {
    id: string;
    order_number: string;
    total_amount: number;
    items: Array<{
      name: string;
      price: number;
      quantity: number;
    }>;
    shipping_info: {
      name: string;
      phone: string;
      address: string;
      email: string;
    };
  };
  children: React.ReactNode;
}

export function ImmediatePaymentDialog({ order, children }: ImmediatePaymentDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('newebpay-checkout', {
        body: {
          orderData: {
            items: order.items,
            shippingInfo: order.shipping_info,
            totalAmount: order.total_amount
          },
          orderId: order.id,
          orderNumber: order.order_number
        }
      });

      if (error) throw error;

      console.log('Payment response:', data);

      // 創建表單並自動提交到藍新金流
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = data.paymentUrl;
      form.target = '_blank'; // 在新視窗開啟

      Object.entries(data.newebpayData).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value as string;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);

      setIsOpen(false);
      
      toast({
        title: "付款頁面已開啟",
        description: "請在新視窗中完成付款程序",
      });

    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "付款失敗",
        description: "無法開啟付款頁面，請稍後再試",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            立即付款
          </DialogTitle>
          <DialogDescription>
            訂單 #{order.order_number}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">訂單編號</span>
                  <span className="font-mono text-sm">{order.order_number}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">訂單金額</span>
                  <span className="text-lg font-bold text-primary">
                    NT$ {order.total_amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">商品數量</span>
                  <span className="text-sm">
                    {order.items.reduce((total, item) => total + item.quantity, 0)} 件
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-amber-800 mb-1">付款說明</p>
                <p className="text-amber-700">
                  點擊「前往付款」將在新視窗開啟藍新金流付款頁面，請確保瀏覽器允許彈出視窗。
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-800 mb-1">付款時限</p>
                <p className="text-blue-700">
                  此付款連結將在 15 分鐘後過期，請盡快完成付款。
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              取消
            </Button>
            <Button 
              onClick={handlePayment}
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-primary to-secondary"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  處理中...
                </div>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  前往付款
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}