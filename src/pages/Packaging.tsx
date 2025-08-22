import { useStore } from '@/store/useStore';
import OrderCard from '@/components/OrderCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Clock, CheckCircle } from 'lucide-react';

export default function Packaging() {
  const { getOrdersByStatus, updateOrderStatus, language } = useStore();
  
  const readyForPackOrders = getOrdersByStatus(['READY_FOR_PACK']);
  const packingOrders = getOrdersByStatus(['PACKING']);
  
  const handleStatusChange = (orderId: string, newStatus: 'PACKING' | 'PACKED') => {
    updateOrderStatus(orderId, newStatus);
  };

  const stats = [
    {
      title: language === 'en' ? 'Ready to Pack' : 'מוכן לאריזה',
      value: readyForPackOrders.length,
      icon: Clock,
      color: 'text-purple-400'
    },
    {
      title: language === 'en' ? 'Currently Packing' : 'נארז כעת',
      value: packingOrders.length,
      icon: Package,
      color: 'text-yellow-400'
    },
    {
      title: language === 'en' ? 'Total Active' : 'סך הכל פעיל',
      value: readyForPackOrders.length + packingOrders.length,
      icon: CheckCircle,
      color: 'text-green-400'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {language === 'en' ? 'Packaging Station' : 'עמדת אריזה'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'en' 
              ? 'Pack orders and prepare for delivery'
              : 'ארוז הזמנות והכן למשלוח'
            }
          </p>
        </div>
        <Package className="h-8 w-8 text-primary" />
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
        {/* Ready to Pack */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-400" />
            {language === 'en' ? 'Ready to Pack' : 'מוכן לאריזה'}
            <span className="text-sm text-muted-foreground">({readyForPackOrders.length})</span>
          </h2>
          
          {readyForPackOrders.length === 0 ? (
            <Card className="card-enhanced">
              <CardContent className="p-6 text-center text-muted-foreground">
                {language === 'en' 
                  ? 'No orders ready for packing'
                  : 'אין הזמנות מוכנות לאריזה'
                }
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {readyForPackOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  showActions={true}
                  availableActions={['PACKING']}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </div>

        {/* Currently Packing */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Package className="h-5 w-5 text-yellow-400" />
            {language === 'en' ? 'Currently Packing' : 'נארז כעת'}
            <span className="text-sm text-muted-foreground">({packingOrders.length})</span>
          </h2>
          
          {packingOrders.length === 0 ? (
            <Card className="card-enhanced">
              <CardContent className="p-6 text-center text-muted-foreground">
                {language === 'en' 
                  ? 'No orders currently being packed'
                  : 'אין הזמנות שנארזות כעת'
                }
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {packingOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  showActions={true}
                  availableActions={['PACKED']}
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