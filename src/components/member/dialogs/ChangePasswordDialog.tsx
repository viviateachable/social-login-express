import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChangePasswordDialog({ open, onOpenChange }: ChangePasswordDialogProps) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: '密碼不符',
        description: '新密碼與確認密碼不一致',
        variant: 'destructive'
      });
      return;
    }

    if (formData.newPassword.length < 6) {
      toast({
        title: '密碼過短',
        description: '新密碼長度至少需要6個字元',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ 
        password: formData.newPassword 
      });

      if (error) throw error;

      toast({
        title: '密碼更新成功',
        description: '您的密碼已成功更新'
      });

      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast({
        title: '密碼更新失敗',
        description: error.message || '無法更新密碼，請稍後再試',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>更改密碼</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">目前密碼</Label>
            <Input
              id="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={(e) => handleInputChange('currentPassword', e.target.value)}
              placeholder="請輸入目前密碼"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">新密碼</Label>
            <Input
              id="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={(e) => handleInputChange('newPassword', e.target.value)}
              placeholder="請輸入新密碼（至少6個字元）"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">確認新密碼</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              placeholder="請再次輸入新密碼"
              required
            />
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              取消
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? '更新中...' : '更新密碼'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}