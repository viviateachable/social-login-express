import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Smartphone, Monitor, Tablet, MapPin, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';

interface LoginLog {
  id: string;
  ip_address: string | null;
  user_agent: string;
  location: string | null;
  device_info: any;
  login_at: string;
}

interface LoginLogsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginLogsDialog({ open, onOpenChange }: LoginLogsDialogProps) {
  const [logs, setLogs] = useState<LoginLog[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchLoginLogs = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('login_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('login_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setLogs((data || []) as LoginLog[]);
    } catch (error) {
      console.error('Error fetching login logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchLoginLogs();
    }
  }, [open, user]);

  const getDeviceIcon = (userAgent: string) => {
    if (userAgent.includes('Mobile') || userAgent.includes('Android') || userAgent.includes('iPhone')) {
      return <Smartphone className="w-4 h-4" />;
    } else if (userAgent.includes('Tablet') || userAgent.includes('iPad')) {
      return <Tablet className="w-4 h-4" />;
    }
    return <Monitor className="w-4 h-4" />;
  };

  const getDeviceType = (userAgent: string) => {
    if (userAgent.includes('Mobile') || userAgent.includes('Android') || userAgent.includes('iPhone')) {
      return '手機';
    } else if (userAgent.includes('Tablet') || userAgent.includes('iPad')) {
      return '平板';
    }
    return '電腦';
  };

  const getBrowser = (userAgent: string) => {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return '其他瀏覽器';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>登入記錄</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-pulse text-muted-foreground">載入中...</div>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-muted-foreground">暫無登入記錄</div>
            </div>
          ) : (
            logs.map((log) => (
              <Card key={log.id} className="border border-border">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {getDeviceIcon(log.user_agent)}
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium">
                          {getDeviceType(log.user_agent)} - {getBrowser(log.user_agent)}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          IP: {log.ip_address || '未知'}
                          {log.location && ` • ${log.location}`}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {format(new Date(log.login_at), 'yyyy/MM/dd HH:mm:ss')}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            關閉
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}