import { useState } from 'react';
import { Calendar, Clock, MapPin, Plus, Star, Edit, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';

type AppointmentFormData = {
  service: string;
  date: string;
  time: string;
  duration: string;
  therapist: string;
  location: string;
  notes?: string;
};

export function AppointmentView() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<any>(null);
  const { toast } = useToast();

  const form = useForm<AppointmentFormData>({
    defaultValues: {
      service: '',
      date: '',
      time: '',
      duration: '',
      therapist: '',
      location: '',
      notes: ''
    }
  });

  const editForm = useForm<AppointmentFormData>({
    defaultValues: {
      service: '',
      date: '',
      time: '',
      duration: '',
      therapist: '',
      location: '',
      notes: ''
    }
  });

  const upcomingAppointments = [
    {
      id: 1,
      date: '2024-01-25',
      time: '14:00',
      service: '全身芳療SPA',
      therapist: '林美師',
      duration: '90分鐘',
      location: '忠孝店',
      status: 'confirmed',
      price: 2800
    },
    {
      id: 2,
      date: '2024-02-05',
      time: '16:30',
      service: '臉部精油護理',
      therapist: '王美師',
      duration: '60分鐘', 
      location: '信義店',
      status: 'confirmed',
      price: 1800
    }
  ];

  const pastAppointments = [
    {
      id: 3,
      date: '2024-01-20',
      time: '15:00',
      service: '深層舒壓按摩',
      therapist: '陳美師',
      duration: '75分鐘',
      location: '忠孝店',
      status: 'completed',
      rating: 5,
      review: '服務非常專業，按摩手法很棒！',
      price: 2200
    },
    {
      id: 4,
      date: '2024-01-15',
      time: '13:30',
      service: '熱石療法',
      therapist: '李美師',
      duration: '90分鐘',
      location: '信義店',
      status: 'completed',
      rating: 5,
      review: '非常放鬆，環境很舒適',
      price: 3200
    }
  ];

  const services = ['全身芳療SPA', '臉部精油護理', '深層舒壓按摩', '熱石療法', '頭部芳療', '背部精油按摩'];
  const therapists = ['林美師', '王美師', '陳美師', '李美師', '張美師'];
  const locations = ['忠孝店', '信義店', '松山店', '大安店'];
  const durations = ['60分鐘', '75分鐘', '90分鐘', '120分鐘'];

  const handleNewAppointment = (data: AppointmentFormData) => {
    console.log('新增預約:', data);
    toast({
      title: "預約成功",
      description: "您的預約已成功建立，我們將為您發送確認訊息。",
    });
    setIsNewDialogOpen(false);
    form.reset();
  };

  const handleEditAppointment = (data: AppointmentFormData) => {
    console.log('修改預約:', data);
    toast({
      title: "修改成功",
      description: "您的預約已成功修改。",
    });
    setIsEditDialogOpen(false);
    setEditingAppointment(null);
    editForm.reset();
  };

  const handleCancelAppointment = (appointmentId: number) => {
    console.log('取消預約:', appointmentId);
    toast({
      title: "預約已取消",
      description: "您的預約已成功取消，我們將為您處理相關事宜。",
    });
  };

  const openEditDialog = (appointment: any) => {
    setEditingAppointment(appointment);
    editForm.reset({
      service: appointment.service,
      date: appointment.date,
      time: appointment.time,
      duration: appointment.duration,
      therapist: appointment.therapist,
      location: appointment.location,
      notes: ''
    });
    setIsEditDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-blue-100 text-blue-800">已確認</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">已完成</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">已取消</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* 頁面標題 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">預約管理</h2>
          <p className="text-muted-foreground">管理您的SPA療程預約</p>
        </div>
        <Dialog open={isNewDialogOpen} onOpenChange={setIsNewDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              新增預約
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>新增預約</DialogTitle>
              <DialogDescription>
                請填寫您的預約資訊，我們將為您安排最適合的療程時間
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleNewAppointment)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="service"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>療程服務</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="選擇療程" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {services.map((service) => (
                              <SelectItem key={service} value={service}>
                                {service}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>療程時長</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="選擇時長" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {durations.map((duration) => (
                              <SelectItem key={duration} value={duration}>
                                {duration}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>預約日期</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>預約時間</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="therapist"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>指定美療師</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="選擇美療師" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {therapists.map((therapist) => (
                              <SelectItem key={therapist} value={therapist}>
                                {therapist}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>門店位置</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="選擇門店" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {locations.map((location) => (
                              <SelectItem key={location} value={location}>
                                {location}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>備註說明</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="如有特殊需求或備註事項請在此說明"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsNewDialogOpen(false)}
                  >
                    取消
                  </Button>
                  <Button type="submit" className="bg-gradient-to-r from-primary to-secondary">
                    確認預約
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="upcoming">即將到來</TabsTrigger>
          <TabsTrigger value="history">歷史記錄</TabsTrigger>
        </TabsList>

        {/* 即將到來的預約 */}
        <TabsContent value="upcoming" className="space-y-4">
          {upcomingAppointments.length === 0 ? (
            <Card className="border-0 shadow-soft bg-card/50 backdrop-blur-sm">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">沒有即將到來的預約</h3>
                <p className="text-muted-foreground text-center mb-4">
                  現在就預約您的下一個療程，享受專業的SPA體驗
                </p>
                <Button className="bg-gradient-to-r from-primary to-secondary">
                  立即預約
                </Button>
              </CardContent>
            </Card>
          ) : (
            upcomingAppointments.map((appointment) => (
              <Card key={appointment.id} className="border-0 shadow-soft bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{appointment.service}</CardTitle>
                      <CardDescription>預約編號: #{appointment.id.toString().padStart(6, '0')}</CardDescription>
                    </div>
                    {getStatusBadge(appointment.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{appointment.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{appointment.time} ({appointment.duration})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{appointment.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{appointment.therapist}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-semibold text-secondary">
                      NT$ {appointment.price.toLocaleString()}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openEditDialog(appointment)}
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        修改預約
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10">
                            <X className="w-3 h-3 mr-1" />
                            取消預約
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>確認取消預約</AlertDialogTitle>
                            <AlertDialogDescription>
                              您確定要取消這個預約嗎？此操作無法復原。
                              <br />
                              <br />
                              <strong>預約資訊：</strong>
                              <br />
                              療程：{appointment.service}
                              <br />
                              時間：{appointment.date} {appointment.time}
                              <br />
                              美療師：{appointment.therapist}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>保留預約</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleCancelAppointment(appointment.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              確認取消
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* 歷史預約 */}
        <TabsContent value="history" className="space-y-4">
          {pastAppointments.map((appointment) => (
            <Card key={appointment.id} className="border-0 shadow-soft bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{appointment.service}</CardTitle>
                    <CardDescription>預約編號: #{appointment.id.toString().padStart(6, '0')}</CardDescription>
                  </div>
                  {getStatusBadge(appointment.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{appointment.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{appointment.time} ({appointment.duration})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{appointment.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{appointment.therapist}</span>
                  </div>
                </div>
                
                {appointment.rating && (
                  <div className="p-4 rounded-lg bg-accent/50 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium">您的評價:</span>
                      <div className="flex items-center gap-1">
                        {[...Array(appointment.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    {appointment.review && (
                      <p className="text-sm text-muted-foreground">{appointment.review}</p>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="text-lg font-semibold text-secondary">
                    NT$ {appointment.price.toLocaleString()}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      再次預約
                    </Button>
                    {!appointment.rating && (
                      <Button size="sm" className="bg-gradient-to-r from-primary to-secondary">
                        評價療程
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* 修改預約對話框 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>修改預約</DialogTitle>
            <DialogDescription>
              修改您的預約資訊，我們將為您重新安排療程時間
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditAppointment)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="service"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>療程服務</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="選擇療程" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {services.map((service) => (
                            <SelectItem key={service} value={service}>
                              {service}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>療程時長</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="選擇時長" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {durations.map((duration) => (
                            <SelectItem key={duration} value={duration}>
                              {duration}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>預約日期</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>預約時間</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="therapist"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>指定美療師</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="選擇美療師" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {therapists.map((therapist) => (
                            <SelectItem key={therapist} value={therapist}>
                              {therapist}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>門店位置</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="選擇門店" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {locations.map((location) => (
                            <SelectItem key={location} value={location}>
                              {location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={editForm.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>備註說明</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="如有特殊需求或備註事項請在此說明"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  取消
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-primary to-secondary">
                  確認修改
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}