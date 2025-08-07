import { useState } from 'react';
import { Package, Truck, Check, X, Star, RotateCcw, Eye, ShoppingCart, Info, CreditCard } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { ImmediatePaymentDialog } from '@/components/member/dialogs/ImmediatePaymentDialog';
import { TrackPackageDialog } from '@/components/member/dialogs/TrackPackageDialog';
import { ReturnRequestDialog } from '@/components/member/dialogs/ReturnRequestDialog';
import { RepurchaseDialog } from '@/components/member/dialogs/RepurchaseDialog';

export function OrderView() {
  const { toast } = useToast();

  const orders = [
    {
      id: '202401001',
      order_number: '202401001',
      date: '2024-01-22',
      status: 'pending',
      total_amount: 2850,
      items: [
        {
          id: 'item001',
          name: '薰衣草精油 10ml',
          price: 850,
          quantity: 2,
          image: '/placeholder.svg'
        },
        {
          id: 'item002', 
          name: '玫瑰果護膚油 30ml',
          price: 1150,
          quantity: 1,
          image: '/placeholder.svg'
        }
      ],
      shipping_info: {
        name: '王小明',
        phone: '0912345678',
        address: '台北市中正區忠孝東路一段100號',
        email: 'wang@example.com'
      }
    },
    {
      id: '202401002',
      order_number: '202401002',
      date: '2024-01-22',
      status: 'shipping',
      total_amount: 2850,
      items: [
        {
          id: 'item003',
          name: '薰衣草精油 10ml',
          price: 850,
          quantity: 2,
          image: '/placeholder.svg'
        },
        {
          id: 'item004',
          name: '玫瑰果護膚油 30ml',
          price: 1150,
          quantity: 1,
          image: '/placeholder.svg'
        }
      ],
      tracking_number: 'SF123456789',
      estimated_delivery: '2024-01-25',
      shipping_company: '黑貓宅急便',
      shipping_info: {
        name: '王小明',
        phone: '0912345678',
        address: '台北市中正區忠孝東路一段100號',
        email: 'wang@example.com'
      }
    },
    {
      id: '202401003',
      order_number: '202401003',
      date: '2024-01-18',
      status: 'delivered',
      total_amount: 1680,
      items: [
        {
          id: 'item005',
          name: '茶樹精油 15ml',
          price: 680,
          quantity: 1,
          image: '/placeholder.svg'
        },
        {
          id: 'item006',
          name: '有機護手霜',
          price: 500,
          quantity: 2,
          image: '/placeholder.svg'
        }
      ],
      delivered_date: '2024-01-20',
      rating: 5,
      review: '商品品質很好，包裝精美！',
      shipping_info: {
        name: '王小明',
        phone: '0912345678',
        address: '台北市中正區忠孝東路一段100號',
        email: 'wang@example.com'
      }
    },
    {
      id: '202401004',
      order_number: '202401004', 
      date: '2024-01-15',
      status: 'cancelled',
      total_amount: 920,
      items: [
        {
          id: 'item007',
          name: '橙花精油 10ml',
          price: 920,
          quantity: 1,
          image: '/placeholder.svg'
        }
      ],
      cancel_reason: '庫存不足，已全額退款',
      shipping_info: {
        name: '王小明',
        phone: '0912345678',
        address: '台北市中正區忠孝東路一段100號',
        email: 'wang@example.com'
      }
    }
  ];

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return { 
          badge: <Badge className="bg-yellow-100 text-yellow-800">處理中</Badge>,
          icon: <Package className="w-4 h-4 text-yellow-600" />
        };
      case 'shipping':
        return { 
          badge: <Badge className="bg-blue-100 text-blue-800">配送中</Badge>,
          icon: <Truck className="w-4 h-4 text-blue-600" />
        };
      case 'delivered':
        return { 
          badge: <Badge className="bg-green-100 text-green-800">已送達</Badge>,
          icon: <Check className="w-4 h-4 text-green-600" />
        };
      case 'cancelled':
        return { 
          badge: <Badge className="bg-red-100 text-red-800">已取消</Badge>,
          icon: <X className="w-4 h-4 text-red-600" />
        };
      default:
        return { 
          badge: <Badge variant="secondary">{status}</Badge>,
          icon: <Package className="w-4 h-4" />
        };
    }
  };

  const filterOrders = (status?: string) => {
    if (!status) return orders;
    return orders.filter(order => order.status === status);
  };

  // 再次購買功能
  const handleRepurchase = (order: typeof orders[0]) => {
    // 將商品加入購物車的邏輯
    const itemCount = order.items.reduce((total, item) => total + item.quantity, 0);
    
    toast({
      title: "已加入購物車", 
      description: `已將 ${itemCount} 件商品加入購物車，總金額 NT$ ${order.total_amount.toLocaleString()}`,
    });
  };

  // 查看詳情組件
  const OrderDetailsDialog = ({ order }: { order: typeof orders[0] }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="w-4 h-4 mr-1" />
          查看詳情
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>訂單詳情 #{order.id}</DialogTitle>
          <DialogDescription>
            完整的訂單資訊和商品詳情
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* 基本資訊 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">訂單編號</label>
              <p className="font-mono">{order.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">下單日期</label>
              <p>{order.date}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">訂單狀態</label>
              <div className="flex items-center gap-2 mt-1">
                {getStatusInfo(order.status).icon}
                {getStatusInfo(order.status).badge}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">訂單總額</label>
              <p className="text-lg font-semibold text-secondary">NT$ {order.total_amount.toLocaleString()}</p>
            </div>
          </div>

          {/* 配送資訊 */}
          {(order.tracking_number || order.estimated_delivery || order.delivered_date) && (
            <div className="border rounded-lg p-4 bg-accent/20">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Truck className="w-4 h-4" />
                配送資訊
              </h4>
              <div className="space-y-2">
                {order.tracking_number && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">物流單號:</span>
                    <span className="font-mono">{order.tracking_number}</span>
                  </div>
                )}
                {order.estimated_delivery && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">預計送達:</span>
                    <span>{order.estimated_delivery}</span>
                  </div>
                )}
                {order.delivered_date && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">送達日期:</span>
                    <span>{order.delivered_date}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 商品清單 */}
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Package className="w-4 h-4" />
              商品清單
            </h4>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="w-20 h-20 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Package className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium">{item.name}</h5>
                    <p className="text-sm text-muted-foreground">
                      單價: NT$ {item.price.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      數量: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      NT$ {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* 總計 */}
            <div className="flex justify-between items-center pt-4 border-t mt-4">
              <span className="font-medium">總計</span>
              <span className="text-xl font-bold text-secondary">
                NT$ {order.total_amount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* 評價資訊 */}
          {order.rating && (
            <div className="border rounded-lg p-4 bg-accent/20">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Star className="w-4 h-4" />
                商品評價
              </h4>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1">
                  {[...Array(order.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">({order.rating}/5)</span>
              </div>
              {order.review && (
                <p className="text-sm">{order.review}</p>
              )}
            </div>
          )}

          {/* 取消原因 */}
          {order.cancel_reason && (
            <div className="border rounded-lg p-4 bg-red-50 border-red-200">
              <h4 className="font-medium mb-2 flex items-center gap-2 text-red-700">
                <Info className="w-4 h-4" />
                取消原因
              </h4>
              <p className="text-sm text-red-600">{order.cancel_reason}</p>
            </div>
          )}

          {/* 操作按鈕 */}
          <div className="flex flex-wrap gap-2 pt-4 border-t">
            {order.status === 'pending' && (
              <ImmediatePaymentDialog order={order}>
                <Button className="bg-gradient-to-r from-green-500 to-green-600">
                  <CreditCard className="w-4 h-4 mr-1" />
                  立即付款
                </Button>
              </ImmediatePaymentDialog>
            )}
            
            {order.status === 'shipping' && (
              <TrackPackageDialog order={order}>
                <Button variant="outline">
                  <Truck className="w-4 h-4 mr-1" />
                  追蹤包裹
                </Button>
              </TrackPackageDialog>
            )}
            
            {order.status === 'delivered' && (
              <>
                <RepurchaseDialog order={order}>
                  <Button className="bg-gradient-to-r from-primary to-secondary">
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    再次購買
                  </Button>
                </RepurchaseDialog>
                
                <ReturnRequestDialog order={order}>
                  <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
                    <RotateCcw className="w-4 h-4 mr-1" />
                    申請退貨
                  </Button>
                </ReturnRequestDialog>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const OrderCard = ({ order }: { order: typeof orders[0] }) => {
    const statusInfo = getStatusInfo(order.status);

    return (
      <Card className="border-0 shadow-soft bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">訂單 #{order.id}</CardTitle>
              <CardDescription>下單日期: {order.date}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {statusInfo.icon}
              {statusInfo.badge}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* 商品列表 */}
          <div className="space-y-3 mb-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-accent/30">
                <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Package className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    NT$ {item.price.toLocaleString()} x {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    NT$ {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* 訂單資訊 */}
          <div className="space-y-2 mb-4">
            {order.tracking_number && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">物流單號:</span>
                <span className="font-mono">{order.tracking_number}</span>
              </div>
            )}
            {order.estimated_delivery && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">預計送達:</span>
                <span>{order.estimated_delivery}</span>
              </div>
            )}
            {order.delivered_date && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">送達日期:</span>
                <span>{order.delivered_date}</span>
              </div>
            )}
            {order.cancel_reason && (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                {order.cancel_reason}
              </div>
            )}
          </div>

          {/* 評價 */}
          {order.rating && (
            <div className="p-3 rounded-lg bg-accent/50 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium">您的評價:</span>
                <div className="flex items-center gap-1">
                  {[...Array(order.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
              {order.review && (
                <p className="text-sm text-muted-foreground">{order.review}</p>
              )}
            </div>
          )}

          {/* 總金額和操作按鈕 */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="text-lg font-semibold text-secondary">
              總計: NT$ {order.total_amount.toLocaleString()}
            </div>
            <div className="flex flex-wrap gap-2">
              {order.status === 'pending' && (
                <ImmediatePaymentDialog order={order}>
                  <Button size="sm" className="bg-gradient-to-r from-green-500 to-green-600">
                    <CreditCard className="w-4 h-4 mr-1" />
                    立即付款
                  </Button>
                </ImmediatePaymentDialog>
              )}
              
              {order.status === 'shipping' && (
                <TrackPackageDialog order={order}>
                  <Button variant="outline" size="sm">
                    <Truck className="w-4 h-4 mr-1" />
                    追蹤包裹
                  </Button>
                </TrackPackageDialog>
              )}
              
              {order.status === 'delivered' && !order.rating && (
                <Button size="sm" className="bg-gradient-to-r from-primary to-secondary">
                  <Star className="w-4 h-4 mr-1" />
                  評價商品
                </Button>
              )}
              
              {order.status === 'delivered' && (
                <>
                  <RepurchaseDialog order={order}>
                    <Button 
                      variant="outline" 
                      size="sm"
                    >
                      <RotateCcw className="w-4 h-4 mr-1" />
                      再次購買
                    </Button>
                  </RepurchaseDialog>
                  
                  <ReturnRequestDialog order={order}>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <RotateCcw className="w-4 h-4 mr-1" />
                      申請退貨
                    </Button>
                  </ReturnRequestDialog>
                </>
              )}
              
              <OrderDetailsDialog order={order} />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* 頁面標題 */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">訂單管理</h2>
        <p className="text-muted-foreground">查看和管理您的所有訂單</p>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-[600px]">
          <TabsTrigger value="all">全部</TabsTrigger>
          <TabsTrigger value="pending">處理中</TabsTrigger>
          <TabsTrigger value="shipping">配送中</TabsTrigger>
          <TabsTrigger value="delivered">已送達</TabsTrigger>
          <TabsTrigger value="cancelled">已取消</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {filterOrders('pending').map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </TabsContent>

        <TabsContent value="shipping" className="space-y-4">
          {filterOrders('shipping').map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </TabsContent>

        <TabsContent value="delivered" className="space-y-4">
          {filterOrders('delivered').map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          {filterOrders('cancelled').map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </TabsContent>
      </Tabs>

      {/* 空狀態 */}
      {orders.length === 0 && (
        <Card className="border-0 shadow-soft bg-card/50 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">還沒有任何訂單</h3>
            <p className="text-muted-foreground text-center mb-4">
              開始選購我們精選的精油和SPA商品吧！
            </p>
            <Button className="bg-gradient-to-r from-primary to-secondary">
              前往商城
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}