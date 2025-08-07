import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Package, Plus, Minus, Check } from 'lucide-react';

interface RepurchaseDialogProps {
  order: {
    id: string;
    order_number: string;
    items: Array<{
      id?: string;
      name: string;
      price: number;
      quantity: number;
      image?: string;
    }>;
    total_amount: number;
  };
  children: React.ReactNode;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export function RepurchaseDialog({ order, children }: RepurchaseDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>(
    order.items.map(item => item.id || item.name)
  );
  const [quantities, setQuantities] = useState<Record<string, number>>(
    order.items.reduce((acc, item) => {
      acc[item.id || item.name] = item.quantity;
      return acc;
    }, {} as Record<string, number>)
  );
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleItemSelect = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, itemId]);
    } else {
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    }
  };

  const handleQuantityChange = (itemId: string, change: number) => {
    setQuantities(prev => {
      const newQuantity = Math.max(1, (prev[itemId] || 1) + change);
      return { ...prev, [itemId]: newQuantity };
    });
  };

  const calculateTotal = () => {
    return order.items
      .filter(item => selectedItems.includes(item.id || item.name))
      .reduce((total, item) => {
        const quantity = quantities[item.id || item.name] || item.quantity;
        return total + (item.price * quantity);
      }, 0);
  };

  const handleAddToCart = () => {
    const cartItems: CartItem[] = order.items
      .filter(item => selectedItems.includes(item.id || item.name))
      .map(item => ({
        id: item.id || `${item.name}-${Date.now()}`,
        name: item.name,
        price: item.price,
        quantity: quantities[item.id || item.name] || item.quantity,
        image: item.image
      }));

    if (cartItems.length === 0) {
      toast({
        title: "請選擇商品",
        description: "至少需要選擇一項商品加入購物車",
        variant: "destructive"
      });
      return;
    }

    // 將商品加入購物車 (存到localStorage或狀態管理)
    const existingCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const updatedCart = [...existingCart];

    cartItems.forEach(newItem => {
      const existingIndex = updatedCart.findIndex(item => item.id === newItem.id);
      if (existingIndex >= 0) {
        updatedCart[existingIndex].quantity += newItem.quantity;
      } else {
        updatedCart.push(newItem);
      }
    });

    localStorage.setItem('cartItems', JSON.stringify(updatedCart));

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = calculateTotal();

    toast({
      title: "已加入購物車",
      description: `${totalItems} 件商品已加入購物車，總金額 NT$ ${totalAmount.toLocaleString()}`,
    });

    setIsOpen(false);
  };

  const handleBuyNow = () => {
    const cartItems: CartItem[] = order.items
      .filter(item => selectedItems.includes(item.id || item.name))
      .map(item => ({
        id: item.id || `${item.name}-${Date.now()}`,
        name: item.name,
        price: item.price,
        quantity: quantities[item.id || item.name] || item.quantity,
        image: item.image
      }));

    if (cartItems.length === 0) {
      toast({
        title: "請選擇商品",
        description: "至少需要選擇一項商品才能結帳",
        variant: "destructive"
      });
      return;
    }

    // 直接前往結帳頁面
    navigate('/checkout', { state: { cartItems } });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            再次購買
          </DialogTitle>
          <DialogDescription>
            從訂單 #{order.order_number} 選擇要重新購買的商品
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* 商品選擇 */}
          <div>
            <Label className="text-base font-medium">選擇商品</Label>
            <p className="text-sm text-muted-foreground mb-4">
              勾選要重新購買的商品，可調整數量
            </p>
            
            <div className="space-y-3">
              {order.items.map((item, index) => {
                const itemId = item.id || item.name;
                const isSelected = selectedItems.includes(itemId);
                const currentQuantity = quantities[itemId] || item.quantity;
                
                return (
                  <Card key={index} className={`border transition-colors ${
                    isSelected ? 'border-primary bg-primary/5' : 'border-border'
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <Checkbox
                          id={`item-${index}`}
                          checked={isSelected}
                          onCheckedChange={(checked) => 
                            handleItemSelect(itemId, checked as boolean)
                          }
                        />
                        
                        <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Package className="w-6 h-6 text-primary" />
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            原訂購數量: {item.quantity}
                          </p>
                          <p className="text-sm font-medium text-primary">
                            NT$ {item.price.toLocaleString()}
                          </p>
                        </div>
                        
                        {isSelected && (
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-8 h-8 p-0"
                              onClick={() => handleQuantityChange(itemId, -1)}
                              disabled={currentQuantity <= 1}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            
                            <span className="w-8 text-center font-medium">
                              {currentQuantity}
                            </span>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-8 h-8 p-0"
                              onClick={() => handleQuantityChange(itemId, 1)}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                        
                        <div className="text-right min-w-[80px]">
                          <p className="font-semibold">
                            NT$ {(item.price * currentQuantity).toLocaleString()}
                          </p>
                          {isSelected && (
                            <Badge variant="secondary" className="text-xs">
                              已選
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* 小計 */}
            {selectedItems.length > 0 && (
              <Card className="mt-4 bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">
                        已選擇 {selectedItems.length} 種商品
                      </p>
                      <p className="text-sm text-muted-foreground">
                        總數量: {selectedItems.reduce((sum, itemId) => {
                          return sum + (quantities[itemId] || 0);
                        }, 0)} 件
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">
                        NT$ {calculateTotal().toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* 操作按鈕 */}
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              取消
            </Button>
            
            <Button 
              onClick={handleAddToCart}
              disabled={selectedItems.length === 0}
              variant="outline"
              className="flex-1"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              加入購物車
            </Button>
            
            <Button 
              onClick={handleBuyNow}
              disabled={selectedItems.length === 0}
              className="flex-1 bg-gradient-to-r from-primary to-secondary"
            >
              <Check className="w-4 h-4 mr-2" />
              立即購買
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}