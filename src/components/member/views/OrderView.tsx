import { useState } from 'react';
import { Package, Truck, Check, X, Star, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function OrderView() {
  const orders = [
    {
      id: '202401001',
      date: '2024-01-22',
      status: 'shipping',
      total: 2850,
      items: [
        {
          name: '薰衣草精油 10ml',
          price: 850,
          quantity: 2,
          image: '/placeholder.svg'
        },
        {
          name: '玫瑰果護膚油 30ml',
          price: 1150,
          quantity: 1,
          image: '/placeholder.svg'
        }
      ],
      trackingNumber: 'SF123456789',
      estimatedDelivery: '2024-01-25'
    },
    {
      id: '202401002',
      date: '2024-01-18',
      status: 'delivered',
      total: 1680,
      items: [
        {
          name: '茶樹精油 15ml',
          price: 680,
          quantity: 1,
          image: '/placeholder.svg'
        },
        {
          name: '有機護手霜',
          price: 500,
          quantity: 2,
          image: '/placeholder.svg'
        }
      ],
      deliveredDate: '2024-01-20',
      rating: 5,
      review: '商品品質很好，包裝精美！'
    },
    {
      id: '202401003',
      date: '2024-01-15',
      status: 'cancelled',
      total: 920,
      items: [
        {
          name: '橙花精油 10ml',
          price: 920,
          quantity: 1,
          image: '/placeholder.svg'
        }
      ],
      cancelReason: '庫存不足，已全額退款'
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
            {order.trackingNumber && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">物流單號:</span>
                <span className="font-mono">{order.trackingNumber}</span>
              </div>
            )}
            {order.estimatedDelivery && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">預計送達:</span>
                <span>{order.estimatedDelivery}</span>
              </div>
            )}
            {order.deliveredDate && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">送達日期:</span>
                <span>{order.deliveredDate}</span>
              </div>
            )}
            {order.cancelReason && (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                {order.cancelReason}
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
              總計: NT$ {order.total.toLocaleString()}
            </div>
            <div className="flex gap-2">
              {order.status === 'shipping' && (
                <Button variant="outline" size="sm">
                  追蹤物流
                </Button>
              )}
              {order.status === 'delivered' && !order.rating && (
                <Button size="sm" className="bg-gradient-to-r from-primary to-secondary">
                  <Star className="w-4 h-4 mr-1" />
                  評價商品
                </Button>
              )}
              {order.status === 'delivered' && (
                <Button variant="outline" size="sm">
                  <RotateCcw className="w-4 h-4 mr-1" />
                  再次購買
                </Button>
              )}
              <Button variant="outline" size="sm">
                查看詳情
              </Button>
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