import { Bell, LogOut, User, Check, X, Calendar, Package, Gift, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export function MemberHeader() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  
  // 通知數據
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'appointment',
      title: '預約提醒',
      message: '您預約的薰衣草深層放鬆療程將於明天下午2點開始',
      time: '2小時前',
      isRead: false,
      icon: Calendar,
      color: 'text-blue-600'
    },
    {
      id: '2',
      type: 'order',
      title: '訂單更新',
      message: '您的訂單 #202401001 已發貨，預計明天送達',
      time: '5小時前',
      isRead: false,
      icon: Package,
      color: 'text-green-600'
    },
    {
      id: '3',
      type: 'promotion',
      title: '生日優惠',
      message: '生日快樂！專屬生日優惠券已發送到您的帳戶',
      time: '1天前',
      isRead: true,
      icon: Gift,
      color: 'text-purple-600'
    },
    {
      id: '4',
      type: 'review',
      title: '評價提醒',
      message: '請為您最近購買的玫瑰果護膚油進行評價',
      time: '2天前',
      isRead: false,
      icon: Star,
      color: 'text-yellow-600'
    },
    {
      id: '5',
      type: 'system',
      title: '系統通知',
      message: '會員等級已升級為金卡會員，享有更多專屬優惠',
      time: '3天前',
      isRead: true,
      icon: User,
      color: 'text-secondary'
    }
  ]);

  // 計算未讀通知數量
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // 標記通知為已讀
  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  // 標記所有通知為已讀
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    toast({
      title: "已標記為已讀",
      description: "所有通知已標記為已讀",
    });
  };

  // 刪除通知
  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
    toast({
      title: "通知已刪除",
      description: "通知已成功刪除",
    });
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "登出失敗",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "已登出",
        description: "您已成功登出",
      });
    }
  };

  return (
    <header className="flex items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-foreground hover:bg-accent" />
        <div>
          <h1 className="text-xl font-semibold text-foreground">會員中心</h1>
          <p className="text-sm text-muted-foreground">歡迎回來，享受您的專屬服務</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* 通知下拉菜單 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative hover:bg-accent">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-destructive text-destructive-foreground">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-96 bg-popover border border-border">
            {/* 通知標題 */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                <span className="font-medium">通知</span>
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {unreadCount} 則未讀
                  </Badge>
                )}
              </div>
              {unreadCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={markAllAsRead}
                  className="text-xs hover:bg-accent"
                >
                  全部標為已讀
                </Button>
              )}
            </div>

            {/* 通知列表 */}
            <ScrollArea className="max-h-80">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>暫無通知</p>
                </div>
              ) : (
                <div className="py-2">
                  {notifications.map((notification) => {
                    const IconComponent = notification.icon;
                    return (
                      <DropdownMenuItem
                        key={notification.id}
                        className="px-4 py-3 cursor-pointer hover:bg-accent/50 flex-col items-start gap-2 min-h-fit"
                        onClick={() => !notification.isRead && markAsRead(notification.id)}
                      >
                        <div className="flex items-start gap-3 w-full">
                          <div className={`mt-0.5 ${notification.color}`}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <h4 className={`text-sm font-medium ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {notification.title}
                              </h4>
                              <div className="flex items-center gap-1">
                                {!notification.isRead && (
                                  <div className="w-2 h-2 bg-primary rounded-full" />
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="w-6 h-6 hover:bg-destructive/10 hover:text-destructive"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNotification(notification.id);
                                  }}
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                            <p className={`text-xs ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'} line-clamp-2`}>
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    );
                  })}
                </div>
              )}
            </ScrollArea>

            {/* 查看所有通知 */}
            {notifications.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center py-3 cursor-pointer hover:bg-accent">
                  <span className="text-sm font-medium">查看所有通知</span>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 用戶菜單 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="flex items-center gap-2 px-3 py-2 hover:bg-accent"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <User className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-sm font-medium">{user?.email}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-popover border border-border">
            <div className="px-3 py-2">
              <p className="text-sm font-medium">{user?.email}</p>
              <p className="text-xs text-muted-foreground">會員帳戶</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer hover:bg-accent">
              <User className="mr-2 h-4 w-4" />
              個人資料
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-accent">
              <Bell className="mr-2 h-4 w-4" />
              通知設定
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="cursor-pointer text-destructive focus:text-destructive hover:bg-destructive/10"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              登出
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}