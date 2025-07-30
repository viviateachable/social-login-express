import { Calendar, Heart, Package, Star, Ticket, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

export function DashboardView() {
  const stats = [
    {
      title: "本月預約",
      value: "3",
      description: "2個已完成",
      icon: Calendar,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "總訂單",
      value: "12",
      description: "累積消費 NT$18,500",
      icon: Package,
      color: "text-secondary",
      bgColor: "bg-secondary/10"
    },
    {
      title: "收藏商品",
      value: "8",
      description: "5項有庫存",
      icon: Heart,
      color: "text-spa-gold",
      bgColor: "bg-spa-gold/10"
    },
    {
      title: "可用點數",
      value: "1,250",
      description: "可折抵 NT$125",
      icon: Star,
      color: "text-spa-warm",
      bgColor: "bg-spa-warm/10"
    },
  ];

  const recentAppointments = [
    { date: "2024-01-20", service: "深層舒壓按摩", status: "已完成", rating: 5 },
    { date: "2024-01-15", service: "臉部精油護理", status: "已完成", rating: 5 },
    { date: "2024-01-25", service: "全身芳療SPA", status: "即將到來", rating: null },
  ];

  const memberLevel = {
    current: "金卡會員",
    progress: 75,
    nextLevel: "鑽石會員",
    pointsNeeded: 2500
  };

  return (
    <div className="space-y-6">
      {/* 歡迎區塊 */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-primary-light to-secondary p-8 text-primary-foreground shadow-elegant">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">歡迎回來！</h2>
          <p className="text-primary-foreground/90 mb-4">
            感謝您選擇 MJ Beauty，讓我們為您提供最優質的SPA體驗
          </p>
          <Button 
            variant="secondary" 
            className="bg-white/20 hover:bg-white/30 text-primary-foreground border-white/30"
          >
            立即預約療程
          </Button>
        </div>
        <div className="absolute -right-20 -top-20 w-40 h-40 rounded-full bg-white/10"></div>
        <div className="absolute -left-10 -bottom-10 w-32 h-32 rounded-full bg-white/5"></div>
      </div>

      {/* 統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden border-0 shadow-soft bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 會員等級進度 */}
        <Card className="border-0 shadow-soft bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-spa-gold" />
              會員等級
            </CardTitle>
            <CardDescription>
              您目前是 {memberLevel.current}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>{memberLevel.current}</span>
                <span>{memberLevel.nextLevel}</span>
              </div>
              <Progress value={memberLevel.progress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                再消費 NT${memberLevel.pointsNeeded.toLocaleString()} 即可升級至{memberLevel.nextLevel}
              </p>
            </div>
            <Button variant="outline" className="w-full">
              查看會員權益
            </Button>
          </CardContent>
        </Card>

        {/* 近期預約 */}
        <Card className="border-0 shadow-soft bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              近期預約
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAppointments.map((appointment, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-accent/50">
                  <div>
                    <p className="font-medium text-sm">{appointment.service}</p>
                    <p className="text-xs text-muted-foreground">{appointment.date}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      appointment.status === '已完成' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {appointment.status}
                    </span>
                    {appointment.rating && (
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(appointment.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              查看所有預約
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 優惠活動 */}
      <Card className="border-0 shadow-soft bg-gradient-to-r from-spa-cream to-spa-warm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-secondary" />
            專屬優惠
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-white/50 backdrop-blur-sm">
              <h4 className="font-semibold mb-2">生日月優惠</h4>
              <p className="text-sm text-muted-foreground mb-3">
                生日當月享全館商品9折優惠
              </p>
              <Button size="sm" variant="secondary">
                立即使用
              </Button>
            </div>
            <div className="p-4 rounded-lg bg-white/50 backdrop-blur-sm">
              <h4 className="font-semibold mb-2">滿額贈禮</h4>
              <p className="text-sm text-muted-foreground mb-3">
                單次消費滿3000元贈送精油小樣
              </p>
              <Button size="sm" variant="secondary">
                了解詳情
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}