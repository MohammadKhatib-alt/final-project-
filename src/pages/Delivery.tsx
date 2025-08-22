import { useState } from 'react';
import { useStore } from '@/store/useStore';
import OrderCard from '@/components/OrderCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Truck, Users, MapPin, Clock } from 'lucide-react';

export default function Delivery() {
  const { 
    getOrdersByStatus, 
    updateOrderStatus, 
    assignCourier, 
    couriers, 
    language 
  } = useStore();
  
  const [selectedCourier, setSelectedCourier] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  
  const packedOrders = getOrdersByStatus(['PACKED']);
  const assignedOrders = getOrdersByStatus(['ASSIGNED']);
  const onTheWayOrders = getOrdersByStatus(['ON_THE_WAY']);
  
  const activeCouriers = couriers.filter(c => c.isActive);
  
  const handleStatusChange = (orderId: string, newStatus: 'ON_THE_WAY' | 'DELIVERED') => {
    updateOrderStatus(orderId, newStatus);
  };

  const handleAssignCourier = (orderId: string, courierId: string) => {
    assignCourier(orderId, courierId);
    setSelectedOrder(null);
    setSelectedCourier(null);
  };

  const stats = [
    {
      title: language === 'en' ? 'Ready for Delivery' : 'מוכן למשלוח',
      value: packedOrders.length,
      icon: Clock,
      color: 'text-indigo-400'
    },
    {
      title: language === 'en' ? 'Assigned Orders' : 'הזמנות שהוקצו',
      value: assignedOrders.length,
      icon: Users,
      color: 'text-cyan-400'
    },
    {
      title: language === 'en' ? 'On the Way' : 'בדרך',
      value: onTheWayOrders.length,
      icon: Truck,
      color: 'text-emerald-400'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {language === 'en' ? 'Delivery Management' : 'ניהול משלוחים'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'en' 
              ? 'Assign couriers and track deliveries'
              : 'הקצה שליחים ועקוב אחר משלוחים'
            }
          </p>
        </div>
        <Truck className="h-8 w-8 text-primary" />
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

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Couriers Panel */}
        <div className="lg:col-span-1">
          <Card className="card-enhanced">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {language === 'en' ? 'Available Couriers' : 'שליחים זמינים'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {activeCouriers.map((courier) => (
                  <div
                    key={courier.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-smooth ${
                      selectedCourier === courier.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedCourier(
                      selectedCourier === courier.id ? null : courier.id
                    )}
                  >
                    <div className="font-medium">{courier.name}</div>
                    <div className="text-sm text-muted-foreground">{courier.phone}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {courier.currentOrders.length} {language === 'en' ? 'orders' : 'הזמנות'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders */}
        <div className="lg:col-span-3 space-y-6">
          {/* Ready for Assignment */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5 text-indigo-400" />
              {language === 'en' ? 'Ready for Assignment' : 'מוכן להקצאה'}
              <span className="text-sm text-muted-foreground">({packedOrders.length})</span>
            </h2>
            
            {packedOrders.length === 0 ? (
              <Card className="card-enhanced">
                <CardContent className="p-6 text-center text-muted-foreground">
                  {language === 'en' 
                    ? 'No orders ready for assignment'
                    : 'אין הזמנות מוכנות להקצאה'
                  }
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {packedOrders.map((order) => (
                  <div key={order.id} className="relative">
                    <OrderCard order={order} />
                    
                    {selectedCourier && (
                      <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                        <Button
                          onClick={() => handleAssignCourier(order.id, selectedCourier)}
                          className="bg-primary hover:bg-primary-hover"
                        >
                          {language === 'en' ? 'Assign Courier' : 'הקצה שליח'}
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Assigned Orders */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Users className="h-5 w-5 text-cyan-400" />
              {language === 'en' ? 'Assigned Orders' : 'הזמנות שהוקצו'}
              <span className="text-sm text-muted-foreground">({assignedOrders.length})</span>
            </h2>
            
            {assignedOrders.length === 0 ? (
              <Card className="card-enhanced">
                <CardContent className="p-6 text-center text-muted-foreground">
                  {language === 'en' 
                    ? 'No assigned orders'
                    : 'אין הזמנות שהוקצו'
                  }
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {assignedOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    showActions={true}
                    availableActions={['ON_THE_WAY']}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            )}
          </div>

          {/* On the Way */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Truck className="h-5 w-5 text-emerald-400" />
              {language === 'en' ? 'On the Way' : 'בדרך'}
              <span className="text-sm text-muted-foreground">({onTheWayOrders.length})</span>
            </h2>
            
            {onTheWayOrders.length === 0 ? (
              <Card className="card-enhanced">
                <CardContent className="p-6 text-center text-muted-foreground">
                  {language === 'en' 
                    ? 'No orders on the way'
                    : 'אין הזמנות בדרך'
                  }
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {onTheWayOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    showActions={true}
                    availableActions={['DELIVERED']}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}