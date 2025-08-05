import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Address {
  id: string;
  name: string;
  phone?: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  postal_code: string;
  is_default: boolean;
}

export function useAddresses() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchAddresses = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false });

      if (error) throw error;
      setAddresses(data || []);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast({
        title: '載入失敗',
        description: '無法載入地址列表',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const addAddress = async (addressData: Omit<Address, 'id'>) => {
    if (!user) return false;

    try {
      // If this is the first address or is_default is true, update existing defaults
      if (addressData.is_default) {
        await supabase
          .from('addresses')
          .update({ is_default: false })
          .eq('user_id', user.id);
      }

      const { error } = await supabase
        .from('addresses')
        .insert([{ ...addressData, user_id: user.id }]);

      if (error) throw error;

      toast({
        title: '新增成功',
        description: '地址已成功新增'
      });

      await fetchAddresses();
      return true;
    } catch (error) {
      console.error('Error adding address:', error);
      toast({
        title: '新增失敗',
        description: '無法新增地址',
        variant: 'destructive'
      });
      return false;
    }
  };

  const updateAddress = async (id: string, addressData: Partial<Address>) => {
    if (!user) return false;

    try {
      // If setting as default, remove default from others
      if (addressData.is_default) {
        await supabase
          .from('addresses')
          .update({ is_default: false })
          .eq('user_id', user.id)
          .neq('id', id);
      }

      const { error } = await supabase
        .from('addresses')
        .update(addressData)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: '更新成功',
        description: '地址已成功更新'
      });

      await fetchAddresses();
      return true;
    } catch (error) {
      console.error('Error updating address:', error);
      toast({
        title: '更新失敗',
        description: '無法更新地址',
        variant: 'destructive'
      });
      return false;
    }
  };

  const deleteAddress = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: '刪除成功',
        description: '地址已成功刪除'
      });

      await fetchAddresses();
      return true;
    } catch (error) {
      console.error('Error deleting address:', error);
      toast({
        title: '刪除失敗',
        description: '無法刪除地址',
        variant: 'destructive'
      });
      return false;
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [user]);

  return {
    addresses,
    loading,
    addAddress,
    updateAddress,
    deleteAddress,
    refetch: fetchAddresses
  };
}