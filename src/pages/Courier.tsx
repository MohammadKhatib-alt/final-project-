import { useStore } from '@/store/useStore';
import OrderCard from '@/components/OrderCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, MapPin, Clock, CheckCircle } from 'lucide-react';

export default function Courier() {
  const { getOrdersForCourier, updateOrderStatus, language, currentUser } = useStore();
  
  const myOrders = currentUser ? getOrdersForCourier(currentUser.name) : [];
  const assignedOrders = myOrders.filter(o => o.status === 'ASSIGNED');
  const onTheWayOrders = myOrders.filter(o => o.status === 'ON_THE_WAY');
  const deliveredOrders = myOrders.filter(o => o.status === 'DELIVERED');
  
  const handleStatusChange = (orderId: string, newStatus: 'ON_THE_WAY' | 'DELIVERED') => {
    updateOrderStatus(orderId, newStatus);
  };

  const stats = [
    {
      title: language === 'en' ? 'Assigned to Me' : 'הוקצה לי',
      value: assignedOrders.length,
      icon: Clock,
      color: 'text-cyan-400'
    },
    {
      title: language === 'en' ? 'On the Way' : 'בדרך',
      value: onTheWayOrders.length,
      icon: Truck,
      color: 'text-orange-400'
    },
    {
      title: language === 'en' ? 'Delivered Today' : 'נמסרו היום',
      value: deliveredOrders.length,
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
            {language === 'en' ? 'My Deliveries' : 'המשלוחים שלי'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'en' 
              ? `Welcome ${currentUser?.name}! Manage your assigned deliveries.`
              : `ברוך הבא ${currentUser?.name}! נהל את המשלוחים שהוקצו לך.`
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

      {/* No Orders Message */}
      {myOrders.length === 0 && (
        <Card className="card-enhanced">
          <CardContent className="p-8 text-center">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {language === 'en' ? 'No Deliveries Assigned' : 'לא הוקצו משלוחים'}
            </h3>
            <p className="text-muted-foreground">
              {language === 'en' 
                ? 'You currently have no deliveries assigned. Check back soon!'
                : 'כרגע אין לך משלוחים שהוקצו. בדוק שוב בקרוב!'
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Orders Sections */}
      {myOrders.length > 0 && (
        <div className="space-y-6">
          {/* Assigned Orders */}
          {assignedOrders.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5 text-cyan-400" />
                {language === 'en' ? 'Ready to Pick Up' : 'מוכן לאיסוף'}
                <span className="text-sm text-muted-foreground">({assignedOrders.length})</span>
              </h2>
              
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
            </div>
          )}

          {/* On the Way Orders */}
          {onTheWayOrders.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Truck className="h-5 w-5 text-orange-400" />
                {language === 'en' ? 'On the Way' : 'בדרך'}
                <span className="text-sm text-muted-foreground">({onTheWayOrders.length})</span>
              </h2>
              
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
            </div>
          )}

          {/* Delivered Orders */}
          {deliveredOrders.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                {language === 'en' ? 'Delivered Today' : 'נמסרו היום'}
                <span className="text-sm text-muted-foreground">({deliveredOrders.length})</span>
              </h2>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {deliveredOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}