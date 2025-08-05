import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Address } from '@/hooks/useAddresses';

interface AddressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<Address, 'id'>) => Promise<boolean>;
  address?: Address;
  title: string;
}

export function AddressDialog({ 
  open, 
  onOpenChange, 
  onSubmit, 
  address, 
  title 
}: AddressDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    postal_code: '',
    is_default: false
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (address) {
      setFormData({
        name: address.name,
        phone: address.phone || '',
        address_line_1: address.address_line_1,
        address_line_2: address.address_line_2 || '',
        city: address.city,
        postal_code: address.postal_code,
        is_default: address.is_default
      });
    } else {
      setFormData({
        name: '',
        phone: '',
        address_line_1: '',
        address_line_2: '',
        city: '',
        postal_code: '',
        is_default: false
      });
    }
  }, [address, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.address_line_1 || !formData.city || !formData.postal_code) {
      return;
    }

    setLoading(true);
    
    const success = await onSubmit(formData);
    
    setLoading(false);
    
    if (success) {
      onOpenChange(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">收件人姓名 *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="請輸入收件人姓名"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">聯絡電話</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="請輸入聯絡電話"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address_line_1">地址 *</Label>
            <Input
              id="address_line_1"
              value={formData.address_line_1}
              onChange={(e) => handleInputChange('address_line_1', e.target.value)}
              placeholder="請輸入地址"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address_line_2">地址 2</Label>
            <Input
              id="address_line_2"
              value={formData.address_line_2}
              onChange={(e) => handleInputChange('address_line_2', e.target.value)}
              placeholder="補充地址資訊（可選）"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">城市 *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="城市"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="postal_code">郵遞區號 *</Label>
              <Input
                id="postal_code"
                value={formData.postal_code}
                onChange={(e) => handleInputChange('postal_code', e.target.value)}
                placeholder="郵遞區號"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="is_default">設為預設地址</Label>
            <Switch
              id="is_default"
              checked={formData.is_default}
              onCheckedChange={(checked) => handleInputChange('is_default', checked)}
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
              {loading ? '處理中...' : address ? '更新' : '新增'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}