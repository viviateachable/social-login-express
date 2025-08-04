import { useState } from 'react';
import { Star, Gift, TrendingUp, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RedeemPointsDialog } from '@/components/member/dialogs/RedeemPointsDialog';

export function PointsView() {
  const [selectedReward, setSelectedReward] = useState<typeof rewards[0] | null>(null);
  const [redeemDialogOpen, setRedeemDialogOpen] = useState(false);
  const [pointsData, setPointsData] = useState({
    current: 1250,
    expiringSoon: 200,
    totalEarned: 3580,
    totalRedeemed: 2330,
    nextTierPoints: 2500,
    currentTier: '金卡會員'
  });

  const pointsHistory = [
    {
      id: 1,
      type: 'earn',
      amount: 180,
      description: '購買薰衣草精油套組',
      date: '2024-01-22',
      orderId: '#202401001'
    },
    {
      id: 2,
      type: 'redeem',
      amount: -100,
      description: '兌換9折優惠券',
      date: '2024-01-20',
      rewardId: 'COUPON-001'
    },
    {
      id: 3,
      type: 'earn',
      amount: 220,
      description: 'SPA療程消費',
      date: '2024-01-18',
      orderId: '#202401002'
    },
    {
      id: 4,
      type: 'earn',
      amount: 50,
      description: '生日紅利點數',
      date: '2024-01-15',
      special: true
    },
    {
      id: 5,
      type: 'redeem',
      amount: -150,
      description: '兌換精油小樣',
      date: '2024-01-10',
      rewardId: 'GIFT-002'
    }
  ];

  const rewards = [
    {
      id: 1,
      name: '9折優惠券',
      points: 100,
      description: '全館商品享9折優惠',
      type: 'coupon' as const,
      stock: 'unlimited' as const
    },
    {
      id: 2,
      name: '薰衣草精油小樣 5ml',
      points: 150,
      description: '法國進口薰衣草精油試用裝',
      type: 'product' as const,
      stock: 50
    },
    {
      id: 3,
      name: '8折優惠券',
      points: 200,
      description: '全館商品享8折優惠',
      type: 'coupon' as const,
      stock: 'unlimited' as const
    },
    {
      id: 4,
      name: 'SPA體驗券',
      points: 500,
      description: '價值NT$800的SPA療程體驗',
      type: 'service' as const,
      stock: 20
    },
    {
      id: 5,
      name: '玫瑰精油 10ml',
      points: 800,
      description: '保加利亞玫瑰精油正裝',
      type: 'product' as const,
      stock: 10
    },
    {
      id: 6,
      name: 'VIP專屬護理',
      points: 1200,
      description: '120分鐘個人專屬SPA療程',
      type: 'service' as const,
      stock: 5
    }
  ];

  const tierProgress = (pointsData.current / pointsData.nextTierPoints) * 100;

  const handleRedeemClick = (reward: typeof rewards[0]) => {
    setSelectedReward(reward);
    setRedeemDialogOpen(true);
  };

  const handleRedeemSuccess = (pointsUsed: number, rewardName: string) => {
    // 更新點數餘額
    setPointsData(prev => ({
      ...prev,
      current: prev.current - pointsUsed,
      totalRedeemed: prev.totalRedeemed + pointsUsed
    }));
    
    // 可以在這裡添加到點數記錄
    const newRecord = {
      id: Date.now(),
      type: 'redeem' as const,
      amount: -pointsUsed,
      description: `兌換${rewardName}`,
      date: new Date().toISOString().split('T')[0],
      rewardId: `REWARD-${Date.now()}`
    };
    
    // 更新點數歷史記錄（這裡可以連接到實際的狀態管理）
    pointsHistory.unshift(newRecord);
  };

  const RewardCard = ({ reward }: { reward: typeof rewards[0] }) => (
    <Card className="border-0 shadow-soft bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{reward.name}</CardTitle>
            <CardDescription className="mt-1">{reward.description}</CardDescription>
          </div>
          <Badge 
            className={`${
              reward.type === 'coupon' ? 'bg-blue-100 text-blue-800' :
              reward.type === 'product' ? 'bg-green-100 text-green-800' :
              'bg-purple-100 text-purple-800'
            }`}
          >
            {reward.type === 'coupon' ? '優惠券' :
             reward.type === 'product' ? '商品' : '服務'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-secondary" />
              <span className="text-lg font-bold text-secondary">
                {reward.points.toLocaleString()} 點
              </span>
            </div>
            {reward.stock !== 'unlimited' && (
              <span className="text-sm text-muted-foreground">
                庫存: {reward.stock}
              </span>
            )}
          </div>
          
          <Button 
            className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            disabled={pointsData.current < reward.points || reward.stock === 0}
            onClick={() => handleRedeemClick(reward)}
          >
            {reward.stock === 0 ? '已售完' : 
             pointsData.current >= reward.points ? '立即兌換' : '點數不足'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* 頁面標題 */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">點數紅利</h2>
        <p className="text-muted-foreground">累積點數，兌換專屬好禮</p>
      </div>

      {/* 點數總覽 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-soft bg-gradient-to-br from-secondary/10 to-secondary/5">
          <CardContent className="p-6 text-center">
            <Star className="w-8 h-8 text-secondary mx-auto mb-2" />
            <p className="text-3xl font-bold text-secondary">{pointsData.current.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">可用點數</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-soft bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-6 text-center">
            <Calendar className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <p className="text-3xl font-bold text-orange-600">{pointsData.expiringSoon}</p>
            <p className="text-sm text-muted-foreground">即將到期</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-soft bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-3xl font-bold text-green-600">{pointsData.totalEarned.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">累積獲得</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-soft bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6 text-center">
            <Gift className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-3xl font-bold text-blue-600">{pointsData.totalRedeemed.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">累積兌換</p>
          </CardContent>
        </Card>
      </div>

      {/* 會員等級進度 */}
      <Card className="border-0 shadow-soft bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-secondary" />
            會員等級進度
          </CardTitle>
          <CardDescription>
            您目前是 {pointsData.currentTier}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>{pointsData.currentTier}</span>
              <span>鑽石會員</span>
            </div>
            <Progress value={tierProgress} className="h-3" />
            <p className="text-sm text-muted-foreground mt-2">
              再累積 {(pointsData.nextTierPoints - pointsData.current).toLocaleString()} 點即可升級至鑽石會員
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center p-3 rounded-lg bg-accent/50">
              <p className="font-medium">當前權益</p>
              <p className="text-muted-foreground">購物回饋 2%</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-secondary/10">
              <p className="font-medium">升級後權益</p>
              <p className="text-secondary">購物回饋 3%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="rewards" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-[300px]">
          <TabsTrigger value="rewards">兌換商城</TabsTrigger>
          <TabsTrigger value="history">點數記錄</TabsTrigger>
        </TabsList>

        {/* 兌換商城 */}
        <TabsContent value="rewards" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewards.map((reward) => (
              <RewardCard key={reward.id} reward={reward} />
            ))}
          </div>
        </TabsContent>

        {/* 點數記錄 */}
        <TabsContent value="history" className="space-y-4">
          <Card className="border-0 shadow-soft bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>點數異動記錄</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pointsHistory.map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-4 rounded-lg bg-accent/30">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${
                        record.type === 'earn' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {record.type === 'earn' ? (
                          <ArrowUpRight className="w-4 h-4 text-green-600" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{record.description}</p>
                        <p className="text-sm text-muted-foreground">{record.date}</p>
                        {record.orderId && (
                          <p className="text-xs text-muted-foreground">訂單: {record.orderId}</p>
                        )}
                        {record.rewardId && (
                          <p className="text-xs text-muted-foreground">兌換: {record.rewardId}</p>
                        )}
                      </div>
                    </div>
                    <div className={`text-right ${record.special ? 'relative' : ''}`}>
                      <p className={`text-lg font-bold ${
                        record.type === 'earn' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {record.type === 'earn' ? '+' : ''}{record.amount} 點
                      </p>
                      {record.special && (
                        <Badge className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground text-xs">
                          特別紅利
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 兌換確認對話框 */}
      <RedeemPointsDialog
        open={redeemDialogOpen}
        onOpenChange={setRedeemDialogOpen}
        reward={selectedReward}
        userPoints={pointsData.current}
        onRedeemSuccess={handleRedeemSuccess}
      />
    </div>
  );
}