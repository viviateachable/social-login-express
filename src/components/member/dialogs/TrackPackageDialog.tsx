import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Truck, Package, Check, MapPin, Clock, ExternalLink } from 'lucide-react';

interface TrackPackageDialogProps {
  order: {
    id: string;
    order_number: string;
    tracking_number?: string;
    estimated_delivery?: string;
    shipping_company?: string;
  };
  children: React.ReactNode;
}

interface TrackingStep {
  time: string;
  location: string;
  status: string;
  description: string;
  isCompleted: boolean;
}

export function TrackPackageDialog({ order, children }: TrackPackageDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [trackingSteps, setTrackingSteps] = useState<TrackingStep[]>([]);

  useEffect(() => {
    if (isOpen && order.tracking_number) {
      // 模擬物流資訊 - 實際應用中會呼叫物流公司API
      const mockTrackingData: TrackingStep[] = [
        {
          time: '2024-01-22 14:30',
          location: '台北物流中心',
          status: 'in_transit',
          description: '包裹已從台北物流中心發出',
          isCompleted: true
        },
        {
          time: '2024-01-22 10:15',
          location: '台北倉庫',
          status: 'picked_up',
          description: '包裹已出庫，準備配送',
          isCompleted: true
        },
        {
          time: '2024-01-21 16:45',
          location: '台北倉庫',
          status: 'packed',
          description: '商品已完成包裝',
          isCompleted: true
        },
        {
          time: '2024-01-21 09:00',
          location: '台北倉庫',
          status: 'confirmed',
          description: '訂單已確認，開始處理',
          isCompleted: true
        }
      ];
      
      setTrackingSteps(mockTrackingData);
    }
  }, [isOpen, order.tracking_number]);

  const getStatusIcon = (status: string, isCompleted: boolean) => {
    if (!isCompleted) {
      return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
    
    switch (status) {
      case 'confirmed':
        return <Check className="w-4 h-4 text-green-600" />;
      case 'packed':
        return <Package className="w-4 h-4 text-blue-600" />;
      case 'picked_up':
      case 'in_transit':
        return <Truck className="w-4 h-4 text-orange-600" />;
      case 'delivered':
        return <MapPin className="w-4 h-4 text-green-600" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="secondary">已確認</Badge>;
      case 'packed':
        return <Badge className="bg-blue-100 text-blue-800">已包裝</Badge>;
      case 'picked_up':
        return <Badge className="bg-orange-100 text-orange-800">已取件</Badge>;
      case 'in_transit':
        return <Badge className="bg-yellow-100 text-yellow-800">運送中</Badge>;
      case 'delivered':
        return <Badge className="bg-green-100 text-green-800">已送達</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const openTrackingWebsite = () => {
    // 根據物流公司開啟對應的追蹤網站
    const trackingUrls = {
      '7-11': `https://www.7-11.com.tw/`,
      '全家': `https://www.family.com.tw/`,
      '黑貓宅急便': `https://www.t-cat.com.tw/`,
      '新竹貨運': `https://www.hct.com.tw/`,
      default: `https://www.google.com/search?q=${order.tracking_number}+物流追蹤`
    };
    
    const url = trackingUrls[order.shipping_company as keyof typeof trackingUrls] || trackingUrls.default;
    window.open(url, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5" />
            包裹追蹤
          </DialogTitle>
          <DialogDescription>
            訂單 #{order.order_number}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* 基本資訊 */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">物流單號</span>
                  <span className="font-mono text-sm">{order.tracking_number || '尚未出貨'}</span>
                </div>
                
                {order.shipping_company && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">物流公司</span>
                    <span className="text-sm">{order.shipping_company}</span>
                  </div>
                )}
                
                {order.estimated_delivery && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">預計送達</span>
                    <span className="text-sm font-medium">{order.estimated_delivery}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 物流狀態 */}
          {trackingSteps.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-4">物流狀態</h4>
                <div className="space-y-4">
                  {trackingSteps.map((step, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`p-2 rounded-full ${
                          step.isCompleted ? 'bg-primary/10' : 'bg-muted'
                        }`}>
                          {getStatusIcon(step.status, step.isCompleted)}
                        </div>
                        {index < trackingSteps.length - 1 && (
                          <div className={`w-px h-8 mt-2 ${
                            step.isCompleted ? 'bg-primary/30' : 'bg-border'
                          }`} />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {getStatusBadge(step.status)}
                          <span className="text-xs text-muted-foreground">{step.time}</span>
                        </div>
                        <p className="text-sm font-medium">{step.description}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {step.location}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 提醒事項 */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-3">配送提醒</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• 司機會在配送前致電聯繫，請保持電話暢通</p>
                <p>• 如無人簽收，包裹可能會放置於管理室或重新安排配送</p>
                <p>• 貨到付款訂單請準備現金或信用卡</p>
                <p>• 如有配送問題，請聯繫客服 0800-123-456</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              關閉
            </Button>
            {order.tracking_number && (
              <Button 
                onClick={openTrackingWebsite}
                className="flex-1"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                官方查詢
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}