import {
  Calendar,
  Heart,
  Home,
  Package,
  Settings,
  Star,
  Ticket,
  User,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import type { MemberView } from '@/pages/MemberCenter';

interface MemberSidebarProps {
  currentView: MemberView;
  onViewChange: (view: MemberView) => void;
}

const menuItems = [
  { id: 'dashboard' as MemberView, label: '會員首頁', icon: Home },
  { id: 'appointments' as MemberView, label: '預約管理', icon: Calendar },
  { id: 'orders' as MemberView, label: '訂單管理', icon: Package },
  { id: 'favorites' as MemberView, label: '我的收藏', icon: Heart },
  { id: 'coupons' as MemberView, label: '優惠券', icon: Ticket },
  { id: 'points' as MemberView, label: '點數紅利', icon: Star },
  { id: 'profile' as MemberView, label: '個人設定', icon: Settings },
];

export function MemberSidebar({ currentView, onViewChange }: MemberSidebarProps) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className={isCollapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <User className="w-5 h-5 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="font-semibold text-lg text-foreground">MJ Beauty</h2>
              <p className="text-sm text-muted-foreground">會員中心</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={currentView === item.id}
                    onClick={() => onViewChange(item.id)}
                    className={`
                      w-full justify-start gap-3 py-3 px-4 rounded-lg transition-all duration-200
                      ${currentView === item.id 
                        ? 'bg-gradient-to-r from-primary to-primary-light text-primary-foreground shadow-soft' 
                        : 'hover:bg-accent hover:text-accent-foreground'
                      }
                    `}
                  >
                    <item.icon className="w-5 h-5" />
                    {!isCollapsed && <span className="font-medium">{item.label}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}