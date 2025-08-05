import { useState } from 'react';
import { User, Phone, MapPin, Calendar, Edit, Camera, Bell, Shield, CreditCard, Plus, Trash2, Clock, History } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useAddresses, Address } from '@/hooks/useAddresses';
import { AddressDialog } from '@/components/member/dialogs/AddressDialog';
import { ChangePasswordDialog } from '@/components/member/dialogs/ChangePasswordDialog';
import { LoginLogsDialog } from '@/components/member/dialogs/LoginLogsDialog';
import { AvatarUploadDialog } from '@/components/member/dialogs/AvatarUploadDialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export function ProfileView() {
  const { user } = useAuth();
  const { addresses, loading: addressesLoading, addAddress, updateAddress, deleteAddress } = useAddresses();
  
  const [isEditing, setIsEditing] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  
  // Dialog states
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | undefined>(undefined);
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState(false);
  const [loginLogsDialogOpen, setLoginLogsDialogOpen] = useState(false);
  const [avatarUploadDialogOpen, setAvatarUploadDialogOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    displayName: '王小美',
    phone: '0912345678',
    birthDate: '1990-05-15',
    bio: '熱愛SPA和精油護理，追求身心靈的平衡與放鬆。'
  });

  const [notifications, setNotifications] = useState({
    emailPromo: true,
    smsPromo: false,
    appointmentReminder: true,
    orderUpdate: true,
    birthdayOffer: true
  });

  const [security, setSecurity] = useState({
    twoFactor: false,
    loginNotification: true
  });

  const paymentMethods = [
    {
      id: 1,
      type: 'credit',
      last4: '1234',
      brand: 'Visa',
      expiryDate: '12/25',
      isDefault: true
    },
    {
      id: 2,
      type: 'credit',
      last4: '5678',
      brand: 'MasterCard',
      expiryDate: '08/26',
      isDefault: false
    }
  ];

  const handleSave = () => {
    // 儲存邏輯
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Address handlers
  const handleAddAddress = () => {
    setEditingAddress(undefined);
    setAddressDialogOpen(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setAddressDialogOpen(true);
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (confirm('確定要刪除這個地址嗎？')) {
      await deleteAddress(addressId);
    }
  };

  const handleAddressSubmit = async (addressData: Omit<Address, 'id'>) => {
    if (editingAddress) {
      return await updateAddress(editingAddress.id, addressData);
    } else {
      return await addAddress(addressData);
    }
  };

  return (
    <div className="space-y-6">
      {/* 頁面標題 */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">個人設定</h2>
        <p className="text-muted-foreground">管理您的帳戶資訊和偏好設定</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-[600px]">
          <TabsTrigger value="profile">個人資料</TabsTrigger>
          <TabsTrigger value="addresses">收件地址</TabsTrigger>
          <TabsTrigger value="notifications">通知設定</TabsTrigger>
          <TabsTrigger value="security">安全設定</TabsTrigger>
          <TabsTrigger value="payment">付款方式</TabsTrigger>
        </TabsList>

        {/* 個人資料 */}
        <TabsContent value="profile" className="space-y-6">
          {/* 頭像和基本資訊 */}
          <Card className="border-0 shadow-soft bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>基本資料</CardTitle>
                <Button
                  variant="outline"
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {isEditing ? '保存' : '編輯'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 頭像 */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={avatarUrl} alt="用戶頭像" />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary">
                      <User className="w-12 h-12 text-primary-foreground" />
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full"
                    onClick={() => setAvatarUploadDialogOpen(true)}
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{formData.displayName}</h3>
                  <p className="text-muted-foreground">{user?.email}</p>
                  <p className="text-sm text-secondary">金卡會員</p>
                </div>
              </div>

              {/* 表單欄位 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="displayName">姓名</Label>
                  <Input
                    id="displayName"
                    value={formData.displayName}
                    onChange={(e) => handleInputChange('displayName', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">手機號碼</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="birthDate">生日</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => handleInputChange('birthDate', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">電子郵件</Label>
                  <Input
                    id="email"
                    value={user?.email || ''}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>
              
              
              <div className="space-y-2">
                <Label htmlFor="bio">個人簡介</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  disabled={!isEditing}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 收件地址 */}
        <TabsContent value="addresses" className="space-y-6">
          <Card className="border-0 shadow-soft bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    收件地址
                  </CardTitle>
                  <CardDescription>
                    管理您的收件地址
                  </CardDescription>
                </div>
                <Button 
                  onClick={handleAddAddress}
                  className="bg-gradient-to-r from-primary to-secondary"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  新增地址
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {addressesLoading ? (
                <div className="text-center py-8">
                  <div className="animate-pulse text-muted-foreground">載入中...</div>
                </div>
              ) : addresses.length === 0 ? (
                <div className="text-center py-8">
                  <MapPin className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">尚未新增任何地址</p>
                  <Button 
                    variant="outline" 
                    onClick={handleAddAddress}
                    className="mt-4"
                  >
                    新增第一個地址
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <div 
                      key={address.id} 
                      className="p-4 rounded-lg border border-border bg-background/50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{address.name}</span>
                            {address.is_default && (
                              <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded">
                                預設
                              </span>
                            )}
                          </div>
                          {address.phone && (
                            <p className="text-sm text-muted-foreground">{address.phone}</p>
                          )}
                          <p className="text-sm">
                            {address.address_line_1}
                            {address.address_line_2 && `, ${address.address_line_2}`}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {address.city} {address.postal_code}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditAddress(address)}
                          >
                            編輯
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeleteAddress(address.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 通知設定 */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="border-0 shadow-soft bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                通知偏好設定
              </CardTitle>
              <CardDescription>
                選擇您希望接收的通知類型
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">電子郵件促銷通知</p>
                    <p className="text-sm text-muted-foreground">接收最新優惠和活動資訊</p>
                  </div>
                  <Switch
                    checked={notifications.emailPromo}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, emailPromo: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">簡訊促銷通知</p>
                    <p className="text-sm text-muted-foreground">透過簡訊接收重要優惠</p>
                  </div>
                  <Switch
                    checked={notifications.smsPromo}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, smsPromo: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">預約提醒</p>
                    <p className="text-sm text-muted-foreground">預約前一天和當天提醒</p>
                  </div>
                  <Switch
                    checked={notifications.appointmentReminder}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, appointmentReminder: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">訂單更新通知</p>
                    <p className="text-sm text-muted-foreground">訂單狀態變更時通知</p>
                  </div>
                  <Switch
                    checked={notifications.orderUpdate}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, orderUpdate: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">生日優惠通知</p>
                    <p className="text-sm text-muted-foreground">生日月份專屬優惠提醒</p>
                  </div>
                  <Switch
                    checked={notifications.birthdayOffer}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, birthdayOffer: checked }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 安全設定 */}
        <TabsContent value="security" className="space-y-6">
          <Card className="border-0 shadow-soft bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                帳戶安全
              </CardTitle>
              <CardDescription>
                管理您的帳戶安全設定
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">雙重驗證</p>
                    <p className="text-sm text-muted-foreground">為您的帳戶增加額外安全層</p>
                  </div>
                  <Switch
                    checked={security.twoFactor}
                    onCheckedChange={(checked) => 
                      setSecurity(prev => ({ ...prev, twoFactor: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">登入通知</p>
                    <p className="text-sm text-muted-foreground">新裝置登入時發送通知</p>
                  </div>
                  <Switch
                    checked={security.loginNotification}
                    onCheckedChange={(checked) => 
                      setSecurity(prev => ({ ...prev, loginNotification: checked }))
                    }
                  />
                </div>
              </div>
              
              <div className="pt-4 border-t space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setChangePasswordDialogOpen(true)}
                >
                  更改密碼
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setLoginLogsDialogOpen(true)}
                >
                  <History className="w-4 h-4 mr-2" />
                  登入記錄
                </Button>
                <Button variant="outline" className="w-full">
                  下載個人資料
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 付款方式 */}
        <TabsContent value="payment" className="space-y-6">
          <Card className="border-0 shadow-soft bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    付款方式
                  </CardTitle>
                  <CardDescription>
                    管理您的付款方式
                  </CardDescription>
                </div>
                <Button className="bg-gradient-to-r from-primary to-secondary">
                  新增卡片
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 rounded bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">{method.brand} •••• {method.last4}</p>
                        <p className="text-sm text-muted-foreground">到期日: {method.expiryDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {method.isDefault && (
                        <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded">
                          預設
                        </span>
                      )}
                      <Button variant="outline" size="sm">
                        編輯
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive">
                        刪除
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <AddressDialog
        open={addressDialogOpen}
        onOpenChange={setAddressDialogOpen}
        onSubmit={handleAddressSubmit}
        address={editingAddress}
        title={editingAddress ? '編輯地址' : '新增地址'}
      />

      <ChangePasswordDialog
        open={changePasswordDialogOpen}
        onOpenChange={setChangePasswordDialogOpen}
      />

      <LoginLogsDialog
        open={loginLogsDialogOpen}
        onOpenChange={setLoginLogsDialogOpen}
      />

      <AvatarUploadDialog
        open={avatarUploadDialogOpen}
        onOpenChange={setAvatarUploadDialogOpen}
        currentAvatarUrl={avatarUrl}
        onAvatarUpdate={setAvatarUrl}
      />
    </div>
  );
}