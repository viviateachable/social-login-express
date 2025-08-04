import { Heart, ShoppingCart, Star, Trash2, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function FavoritesView() {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const favoriteProducts = [
    {
      id: 1,
      name: '薰衣草精油 10ml',
      price: 850,
      originalPrice: 1000,
      rating: 4.8,
      reviews: 124,
      inStock: true,
      category: 'product',
      image: '/placeholder.svg',
      description: '來自法國普羅旺斯的頂級薰衣草精油，具有舒緩放鬆的功效'
    },
    {
      id: 2,
      name: '玫瑰果護膚油 30ml',
      price: 1150,
      originalPrice: null,
      rating: 4.9,
      reviews: 89,
      inStock: true,
      category: 'product',
      image: '/placeholder.svg',
      description: '富含維生素C和E，有效修復肌膚，延緩老化'
    },
    {
      id: 3,
      name: '茶樹精油 15ml',
      price: 680,
      originalPrice: null,
      rating: 4.7,
      reviews: 156,
      inStock: false,
      category: 'product',
      image: '/placeholder.svg',
      description: '澳洲原裝進口，具有強效抗菌和消炎功效'
    }
  ];

  const favoriteServices = [
    {
      id: 1,
      name: '深層舒壓按摩',
      duration: '75分鐘',
      price: 2200,
      originalPrice: 2500,
      rating: 4.9,
      reviews: 89,
      category: 'service',
      image: '/placeholder.svg',
      description: '結合瑞典式按摩手法，深層放鬆肌肉，緩解壓力'
    },
    {
      id: 2,
      name: '臉部精油護理',
      duration: '60分鐘',
      price: 1800,
      originalPrice: null,
      rating: 4.8,
      reviews: 156,
      category: 'service',
      image: '/placeholder.svg',
      description: '使用頂級精油進行臉部護理，深層清潔和滋養肌膚'
    },
    {
      id: 3,
      name: '全身芳療SPA',
      duration: '90分鐘',
      price: 2800,
      originalPrice: 3200,
      rating: 5.0,
      reviews: 67,
      category: 'service',
      image: '/placeholder.svg',
      description: '全身精油按摩結合芳香療法，身心靈的完美放鬆體驗'
    }
  ];

  const [favoriteProductsList, setFavoriteProductsList] = useState(favoriteProducts);
  const [favoriteServicesList, setFavoriteServicesList] = useState(favoriteServices);

  // 處理加入購物車
  const handleAddToCart = (product: typeof favoriteProducts[0]) => {
    toast({
      title: "已加入購物車",
      description: `${product.name} 已成功加入購物車`,
    });
  };

  // 處理立即預約
  const handleBookNow = (service: typeof favoriteServices[0]) => {
    toast({
      title: "預約功能",
      description: `即將為您安排 ${service.name} 的預約`,
    });
    // TODO: 實際的預約邏輯
  };

  // 處理刪除收藏
  const handleRemoveFromFavorites = (id: number, type: 'product' | 'service') => {
    if (type === 'product') {
      setFavoriteProductsList(prev => prev.filter(item => item.id !== id));
    } else {
      setFavoriteServicesList(prev => prev.filter(item => item.id !== id));
    }
    toast({
      title: "已移除收藏",
      description: "商品已從收藏清單中移除",
    });
  };

  // 處理商品頁面導航
  const handleProductNavigation = (productId: number) => {
    navigate(`/products/${productId}`);
  };

  // 處理療程頁面導航
  const handleServiceNavigation = (serviceId: number) => {
    navigate(`/services/${serviceId}`);
  };

  const ProductCard = ({ item }: { item: typeof favoriteProducts[0] }) => (
    <Card className="border-0 shadow-soft bg-card/50 backdrop-blur-sm group hover:shadow-elegant transition-all duration-300">
      <CardHeader className="relative">
        <div 
          className="aspect-square rounded-lg bg-primary/10 flex items-center justify-center mb-3 overflow-hidden cursor-pointer group-hover:scale-105 transition-transform duration-300"
          onClick={() => handleProductNavigation(item.id)}
        >
          <img 
            src={item.image} 
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <ExternalLink className="w-6 h-6 text-white" />
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white/90 text-red-500"
          onClick={() => handleRemoveFromFavorites(item.id, 'product')}
        >
          <Heart className="w-4 h-4 fill-current" />
        </Button>
        {!item.inStock && (
          <Badge className="absolute top-2 left-2 bg-red-100 text-red-800">
            缺貨中
          </Badge>
        )}
        {item.originalPrice && (
          <Badge className="absolute top-2 left-2 bg-red-500 text-white">
            特價
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div 
            className="cursor-pointer"
            onClick={() => handleProductNavigation(item.id)}
          >
            <CardTitle className="text-lg line-clamp-2 hover:text-primary transition-colors">
              {item.name}
            </CardTitle>
            <CardDescription className="text-sm line-clamp-2 mt-1">
              {item.description}
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{item.rating}</span>
            </div>
            <span className="text-xs text-muted-foreground">({item.reviews}則評價)</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-secondary">
              NT$ {item.price.toLocaleString()}
            </span>
            {item.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                NT$ {item.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <Button 
              className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              disabled={!item.inStock}
              onClick={() => handleAddToCart(item)}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {item.inStock ? '加入購物車' : '缺貨中'}
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => handleRemoveFromFavorites(item.id, 'product')}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ServiceCard = ({ item }: { item: typeof favoriteServices[0] }) => (
    <Card className="border-0 shadow-soft bg-card/50 backdrop-blur-sm group hover:shadow-elegant transition-all duration-300">
      <CardHeader className="relative">
        <div 
          className="aspect-[4/3] rounded-lg bg-primary/10 flex items-center justify-center mb-3 overflow-hidden cursor-pointer group-hover:scale-105 transition-transform duration-300"
          onClick={() => handleServiceNavigation(item.id)}
        >
          <img 
            src={item.image} 
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <ExternalLink className="w-6 h-6 text-white" />
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white/90 text-red-500"
          onClick={() => handleRemoveFromFavorites(item.id, 'service')}
        >
          <Heart className="w-4 h-4 fill-current" />
        </Button>
        {item.originalPrice && (
          <Badge className="absolute top-2 left-2 bg-red-500 text-white">
            特價
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div 
            className="cursor-pointer"
            onClick={() => handleServiceNavigation(item.id)}
          >
            <CardTitle className="text-lg line-clamp-2 hover:text-primary transition-colors">
              {item.name}
            </CardTitle>
            <CardDescription className="text-sm line-clamp-2 mt-1">
              {item.description}
            </CardDescription>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{item.rating}</span>
              </div>
              <span className="text-xs text-muted-foreground">({item.reviews}則評價)</span>
            </div>
            <span className="text-sm text-muted-foreground">{item.duration}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-secondary">
              NT$ {item.price.toLocaleString()}
            </span>
            {item.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                NT$ {item.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <Button 
              className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              onClick={() => handleBookNow(item)}
            >
              立即預約
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => handleRemoveFromFavorites(item.id, 'service')}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* 頁面標題 */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">我的收藏</h2>
        <p className="text-muted-foreground">管理您喜愛的商品和療程</p>
      </div>

      <Tabs defaultValue="products" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-[300px]">
          <TabsTrigger value="products">收藏商品 ({favoriteProductsList.length})</TabsTrigger>
          <TabsTrigger value="services">收藏療程 ({favoriteServicesList.length})</TabsTrigger>
        </TabsList>

        {/* 收藏商品 */}
        <TabsContent value="products" className="space-y-4">
          {favoriteProductsList.length === 0 ? (
            <Card className="border-0 shadow-soft bg-card/50 backdrop-blur-sm">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Heart className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">還沒有收藏的商品</h3>
                <p className="text-muted-foreground text-center mb-4">
                  瀏覽我們的精油商品，將喜歡的商品加入收藏吧！
                </p>
                <Button className="bg-gradient-to-r from-primary to-secondary">
                  前往商城
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favoriteProductsList.map((product) => (
                <ProductCard key={product.id} item={product} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* 收藏療程 */}
        <TabsContent value="services" className="space-y-4">
          {favoriteServicesList.length === 0 ? (
            <Card className="border-0 shadow-soft bg-card/50 backdrop-blur-sm">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Heart className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">還沒有收藏的療程</h3>
                <p className="text-muted-foreground text-center mb-4">
                  探索我們的專業SPA療程，收藏您感興趣的服務！
                </p>
                <Button className="bg-gradient-to-r from-primary to-secondary">
                  瀏覽療程
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteServicesList.map((service) => (
                <ServiceCard key={service.id} item={service} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}