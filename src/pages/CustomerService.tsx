import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import OrderCard from '@/components/OrderCard';
import { Search, Phone, Users, HelpCircle } from 'lucide-react';

export default function CustomerService() {
  const { orders, language } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<typeof orders>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    const results = orders.filter(order =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone.includes(searchTerm.toLowerCase()) ||
      order.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setSearchResults(results);
    setHasSearched(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const stats = [
    {
      title: language === 'en' ? 'Total Orders' : 'סך הזמנות',
      value: orders.length,
      icon: Users,
      color: 'text-blue-400'
    },
    {
      title: language === 'en' ? 'Active Orders' : 'הזמנות פעילות',
      value: orders.filter(o => o.status !== 'DELIVERED').length,
      icon: Phone,
      color: 'text-orange-400'
    },
    {
      title: language === 'en' ? 'Urgent Orders' : 'הזמנות דחופות',
      value: orders.filter(o => o.priority === 'URGENT' && o.status !== 'DELIVERED').length,
      icon: HelpCircle,
      color: 'text-red-400'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {language === 'en' ? 'Customer Service' : 'שירות לקוחות'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'en' 
              ? 'Search and manage customer orders'
              : 'חפש ונהל הזמנות לקוחות'
            }
          </p>
        </div>
        <Users className="h-8 w-8 text-primary" />
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="card-enhanced">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Search Section */}
      <Card className="card-enhanced">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            {language === 'en' ? 'Order Search' : 'חיפוש הזמנות'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={language === 'en' 
                  ? 'Search by order ID, customer name, phone, or address...'
                  : 'חפש לפי מספר הזמנה, שם לקוח, טלפון או כתובת...'
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} className="bg-gradient-primary hover:opacity-90">
              {language === 'en' ? 'Search' : 'חפש'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {hasSearched && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {language === 'en' ? 'Search Results' : 'תוצאות חיפוש'}
            </h2>
            <span className="text-sm text-muted-foreground">
              {searchResults.length} {language === 'en' ? 'results found' : 'תוצאות נמצאו'}
            </span>
          </div>

          {searchResults.length === 0 ? (
            <Card className="card-enhanced">
              <CardContent className="p-8 text-center">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {language === 'en' ? 'No Orders Found' : 'לא נמצאו הזמנות'}
                </h3>
                <p className="text-muted-foreground">
                  {language === 'en' 
                    ? 'Try searching with different keywords or check the order details.'
                    : 'נסה לחפש עם מילות מפתח שונות או בדוק את פרטי ההזמנה.'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {searchResults.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Quick Access */}
      {!hasSearched && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            {language === 'en' ? 'Quick Access' : 'גישה מהירה'}
          </h2>
          
          <div className="grid gap-4 md:grid-cols-2">
            {/* Recent Orders */}
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="text-lg">
                  {language === 'en' ? 'Recent Orders' : 'הזמנות אחרונות'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {orders
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 5)
                    .map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                        <div>
                          <div className="font-medium text-sm">{order.id}</div>
                          <div className="text-xs text-muted-foreground">{order.customerName}</div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {order.status}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Urgent Orders */}
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="text-lg text-red-400">
                  {language === 'en' ? 'Urgent Orders' : 'הזמנות דחופות'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {orders
                    .filter(o => o.priority === 'URGENT' && o.status !== 'DELIVERED')
                    .slice(0, 5)
                    .map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                        <div>
                          <div className="font-medium text-sm">{order.id}</div>
                          <div className="text-xs text-muted-foreground">{order.customerName}</div>
                        </div>
                        <div className="text-xs text-red-400">
                          {order.status}
                        </div>
                      </div>
                    ))}
                  
                  {orders.filter(o => o.priority === 'URGENT' && o.status !== 'DELIVERED').length === 0 && (
                    <div className="text-sm text-muted-foreground text-center py-4">
                      {language === 'en' ? 'No urgent orders' : 'אין הזמנות דחופות'}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}