import { useState } from 'react';
import { Calendar, Clock, MapPin, Plus, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function AppointmentView() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

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
        <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
          <Plus className="w-4 h-4 mr-2" />
          新增預約
        </Button>
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
                      <Button variant="outline" size="sm">
                        修改預約
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10">
                        取消預約
                      </Button>
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
    </div>
  );
}