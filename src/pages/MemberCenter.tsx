import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { MemberSidebar } from '@/components/member/MemberSidebar';
import { MemberHeader } from '@/components/member/MemberHeader';
import { DashboardView } from '@/components/member/views/DashboardView';
import { AppointmentView } from '@/components/member/views/AppointmentView';
import { OrderView } from '@/components/member/views/OrderView';
import { FavoritesView } from '@/components/member/views/FavoritesView';
import { CouponsView } from '@/components/member/views/CouponsView';
import { PointsView } from '@/components/member/views/PointsView';
import { ProfileView } from '@/components/member/views/ProfileView';

export type MemberView = 
  | 'dashboard'
  | 'appointments' 
  | 'orders'
  | 'favorites'
  | 'coupons'
  | 'points'
  | 'profile';

const MemberCenter = () => {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<MemberView>('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-spa-cream via-background to-spa-warm">
        <div className="animate-pulse text-secondary text-lg">載入中...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'appointments':
        return <AppointmentView />;
      case 'orders':
        return <OrderView />;
      case 'favorites':
        return <FavoritesView />;
      case 'coupons':
        return <CouponsView />;
      case 'points':
        return <PointsView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-spa-cream via-background to-spa-warm">
        <MemberSidebar currentView={currentView} onViewChange={setCurrentView} />
        
        <div className="flex-1 flex flex-col">
          <MemberHeader />
          
          <main className="flex-1 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto">
              {renderView()}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MemberCenter;