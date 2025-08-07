import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { RotateCcw, AlertCircle, CheckCircle, Package } from 'lucide-react';

interface ReturnRequestDialogProps {
  order: {
    id: string;
    order_number: string;
    items: Array<{
      id?: string;
      name: string;
      price: number;
      quantity: number;
    }>;
    total_amount: number;
    delivered_date?: string;
  };
  children: React.ReactNode;
}

export function ReturnRequestDialog({ order, children }: ReturnRequestDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [returnReason, setReturnReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [description, setDescription] = useState('');
  const { toast } = useToast();

  const returnReasons = [
    '商品有瑕疵或損壞',
    '商品與描述不符',
    '收到錯誤商品',
    '不滿意商品品質',
    '尺寸或規格不合適',
    '重複訂購',
    '改變主意不想要了',
    '其他原因'
  ];

  const handleItemSelect = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, itemId]);
    } else {
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    }
  };

  const calculateRefundAmount = () => {
    return order.items
      .filter(item => selectedItems.includes(item.id || item.name))
      .reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const isWithinReturnPeriod = () => {
    if (!order.delivered_date) return true;
    const deliveredDate = new Date(order.delivered_date);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - deliveredDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff <= 7; // 7天鑑賞期
  };

  const handleSubmitReturn = async () => {
    if (selectedItems.length === 0) {
      toast({
        title: "請選擇退貨商品",
        description: "至少需要選擇一項商品進行退貨",
        variant: "destructive"
      });
      return;
    }

    if (!returnReason) {
      toast({
        title: "請選擇退貨原因",
        description: "請選擇退貨原因以便我們改善服務",
        variant: "destructive"
      });
      return;
    }

    if (returnReason === '其他原因' && !customReason.trim()) {
      toast({
        title: "請填寫退貨原因",
        description: "請詳細說明退貨的具體原因",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // 模擬提交退貨申請
      await new Promise(resolve => setTimeout(resolve, 2000));

      const refundAmount = calculateRefundAmount();
      const returnItems = order.items.filter(item => selectedItems.includes(item.id || item.name));

      // 實際應用中會呼叫API提交退貨申請
      console.log('Return request submitted:', {
        orderId: order.id,
        orderNumber: order.order_number,
        returnItems,
        reason: returnReason === '其他原因' ? customReason : returnReason,
        description,
        refundAmount
      });

      toast({
        title: "退貨申請已提交",
        description: `退貨申請已成功提交，預計退款金額 NT$ ${refundAmount.toLocaleString()}。客服將於1-2個工作天內聯繫您確認退貨細節。`,
      });

      setIsOpen(false);
      // 重置表單
      setSelectedItems([]);
      setReturnReason('');
      setCustomReason('');
      setDescription('');

    } catch (error) {
      console.error('Return request error:', error);
      toast({
        title: "提交失敗",
        description: "無法提交退貨申請，請稍後再試或聯繫客服",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isWithinReturnPeriod()) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              無法申請退貨
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">
              此訂單已超過7天鑑賞期，無法申請退貨。
            </p>
            <p className="text-sm text-muted-foreground">
              如有商品品質問題，請聯繫客服 0800-123-456
            </p>
          </div>
          <Button onClick={() => setIsOpen(false)} className="w-full">
            我知道了
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RotateCcw className="w-5 h-5" />
            申請退貨
          </DialogTitle>
          <DialogDescription>
            訂單 #{order.order_number} | 7天鑑賞期內可申請退貨
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* 選擇退貨商品 */}
          <div>
            <Label className="text-base font-medium">選擇退貨商品 *</Label>
            <p className="text-sm text-muted-foreground mb-3">請選擇要退貨的商品</p>
            
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <Card key={index} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Checkbox
                        id={`item-${index}`}
                        checked={selectedItems.includes(item.id || item.name)}
                        onCheckedChange={(checked) => 
                          handleItemSelect(item.id || item.name, checked as boolean)
                        }
                      />
                      <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Package className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          數量: {item.quantity} | 單價: NT$ {item.price.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          NT$ {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {selectedItems.length > 0 && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-medium">
                    預計退款金額: NT$ {calculateRefundAmount().toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 退貨原因 */}
          <div>
            <Label className="text-base font-medium">退貨原因 *</Label>
            <p className="text-sm text-muted-foreground mb-3">請選擇退貨原因以便我們改善服務</p>
            
            <RadioGroup value={returnReason} onValueChange={setReturnReason}>
              {returnReasons.map((reason) => (
                <div key={reason} className="flex items-center space-x-2">
                  <RadioGroupItem value={reason} id={reason} />
                  <Label htmlFor={reason} className="cursor-pointer">
                    {reason}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {returnReason === '其他原因' && (
              <div className="mt-3">
                <Label htmlFor="custom-reason">請說明具體原因 *</Label>
                <Textarea
                  id="custom-reason"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="請詳細說明退貨原因..."
                  className="mt-2"
                />
              </div>
            )}
          </div>

          {/* 詳細說明 */}
          <div>
            <Label htmlFor="description" className="text-base font-medium">
              詳細說明 (選填)
            </Label>
            <p className="text-sm text-muted-foreground mb-3">
              請提供更多詳細資訊，有助於我們快速處理您的退貨申請
            </p>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="如：商品外觀、包裝狀況、使用感受等..."
              rows={4}
            />
          </div>

          {/* 退貨說明 */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h4 className="font-medium text-blue-800 mb-2">退貨須知</h4>
              <div className="space-y-1 text-sm text-blue-700">
                <p>• 商品須保持原包裝完整，未使用或損壞</p>
                <p>• 個人衛生用品、食品等商品不接受退貨</p>
                <p>• 退貨運費由買方負擔，商品瑕疵除外</p>
                <p>• 退款將於收到退貨商品後3-5個工作天內處理</p>
                <p>• 客服將於1-2個工作天內聯繫您確認退貨細節</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              取消
            </Button>
            <Button 
              onClick={handleSubmitReturn}
              disabled={isLoading || selectedItems.length === 0}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  提交中...
                </div>
              ) : (
                <>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  提交退貨申請
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}