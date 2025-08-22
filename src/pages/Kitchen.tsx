import { useStore } from '@/store/useStore';
import OrderCard from '@/components/OrderCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChefHat, Clock, TrendingUp } from 'lucide-react';

export default function Kitchen() {
  const { getOrdersByStatus, updateOrderStatus, language } = useStore();
  
  const receivedOrders = getOrdersByStatus(['RECEIVED']);
  const inPrepOrders = getOrdersByStatus(['IN_PREP']);
  
  const handleStatusChange = (orderId: string, newStatus: 'IN_PREP' | 'READY_FOR_PACK') => {
    updateOrderStatus(orderId, newStatus);
  };

  const stats = [
    {
      title: language === 'en' ? 'New Orders' : 'הזמנות חדשות',
      value: receivedOrders.length,
      icon: Clock,
      color: 'text-blue-400'
    },
    {
      title: language === 'en' ? 'In Preparation' : 'בהכנה',
      value: inPrepOrders.length,
      icon: ChefHat,
      color: 'text-orange-400'
    },
    {
      title: language === 'en' ? 'Total Active' : 'סך הכל פעיל',
      value: receivedOrders.length + inPrepOrders.length,
      icon: TrendingUp,
      color: 'text-green-400'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {language === 'en' ? 'Kitchen Management' : 'ניהול מטבח'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'en' 
              ? 'Track and manage order preparation'
              : 'עקוב ונהל הכנת הזמנות'
            }
          </p>
        </div>
        <ChefHat className="h-8 w-8 text-primary" />
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

      {/* Orders Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* New Orders */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-400" />
            {language === 'en' ? 'New Orders' : 'הזמנות חדשות'}
            <span className="text-sm text-muted-foreground">({receivedOrders.length})</span>
          </h2>
          
          {receivedOrders.length === 0 ? (
            <Card className="card-enhanced">
              <CardContent className="p-6 text-center text-muted-foreground">
                {language === 'en' 
                  ? 'No new orders to prepare'
                  : 'אין הזמנות חדשות להכנה'
                }
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {receivedOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  showActions={true}
                  availableActions={['IN_PREP']}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </div>

        {/* In Preparation */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <ChefHat className="h-5 w-5 text-orange-400" />
            {language === 'en' ? 'In Preparation' : 'בהכנה'}
            <span className="text-sm text-muted-foreground">({inPrepOrders.length})</span>
          </h2>
          
          {inPrepOrders.length === 0 ? (
            <Card className="card-enhanced">
              <CardContent className="p-6 text-center text-muted-foreground">
                {language === 'en' 
                  ? 'No orders in preparation'
                  : 'אין הזמנות בהכנה'
                }
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {inPrepOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  showActions={true}
                  availableActions={['READY_FOR_PACK']}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}