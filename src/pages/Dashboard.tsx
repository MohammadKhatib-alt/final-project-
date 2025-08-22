import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/StatusBadge';
import { 
  ShoppingCart, 
  Clock, 
  CheckCircle, 
  Truck, 
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

export default function Dashboard() {
  const { orders, couriers, language, currentUser } = useStore();
  
  const now = new Date();
  
  // Order statistics
  const orderStats = {
    total: orders.length,
    received: orders.filter(o => o.status === 'RECEIVED').length,
    inPrep: orders.filter(o => o.status === 'IN_PREP').length,
    readyForPack: orders.filter(o => o.status === 'READY_FOR_PACK').length,
    packing: orders.filter(o => o.status === 'PACKING').length,
    packed: orders.filter(o => o.status === 'PACKED').length,
    assigned: orders.filter(o => o.status === 'ASSIGNED').length,
    onTheWay: orders.filter(o => o.status === 'ON_THE_WAY').length,
    delivered: orders.filter(o => o.status === 'DELIVERED').length,
  };

  // Time-based statistics
  const lateOrders = orders.filter(order => 
    order.estimatedDelivery && now > order.estimatedDelivery && order.status !== 'DELIVERED'
  ).length;

  const atRiskOrders = orders.filter(order => 
    order.estimatedDelivery && 
    now > new Date(order.estimatedDelivery.getTime() - 15 * 60 * 1000) &&
    order.status !== 'DELIVERED'
  ).length;

  const urgentOrders = orders.filter(o => o.priority === 'URGENT' && o.status !== 'DELIVERED').length;

  // Courier statistics
  const activeCouriers = couriers.filter(c => c.isActive).length;
  const busyCouriers = couriers.filter(c => c.currentOrders.length > 0).length;

  const mainStats = [
    {
      title: language === 'en' ? 'Total Orders' : 'סך הזמנות',
      value: orderStats.total,
      icon: ShoppingCart,
      color: 'text-blue-400',
      description: language === 'en' ? 'All time orders' : 'כל ההזמנות'
    },
    {
      title: language === 'en' ? 'Active Orders' : 'הזמנות פעילות',
      value: orderStats.total - orderStats.delivered,
      icon: Clock,
      color: 'text-orange-400',
      description: language === 'en' ? 'Currently processing' : 'בעיבוד כעת'
    },
    {
      title: language === 'en' ? 'Delivered Today' : 'נמסרו היום',
      value: orderStats.delivered,
      icon: CheckCircle,
      color: 'text-green-400',
      description: language === 'en' ? 'Completed orders' : 'הזמנות שהושלמו'
    },
    {
      title: language === 'en' ? 'Active Couriers' : 'שליחים פעילים',
      value: activeCouriers,
      icon: Truck,
      color: 'text-purple-400',
      description: language === 'en' ? 'Available for delivery' : 'זמינים למשלוח'
    }
  ];

  const alertStats = [
    {
      title: language === 'en' ? 'Late Orders' : 'הזמנות מאוחרות',
      value: lateOrders,
      icon: AlertTriangle,
      color: 'text-red-400',
      urgent: true
    },
    {
      title: language === 'en' ? 'At Risk' : 'בסיכון',
      value: atRiskOrders,
      icon: Clock,
      color: 'text-yellow-400',
      urgent: false
    },
    {
      title: language === 'en' ? 'Urgent Priority' : 'עדיפות דחופה',
      value: urgentOrders,
      icon: TrendingUp,
      color: 'text-orange-400',
      urgent: false
    }
  ];

  const recentOrders = orders
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          {language === 'en' ? 'Dashboard' : 'לוח בקרה'}
        </h1>
        <p className="text-muted-foreground">
          {language === 'en' 
            ? `Welcome back, ${currentUser?.name}! Here's your delivery overview.`
            : `ברוך הבא, ${currentUser?.name}! הנה סקירת המשלוחים שלך.`
          }
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {mainStats.map((stat) => {
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
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Alert Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {alertStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className={`card-enhanced ${stat.urgent ? 'border-red-500/50' : ''}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stat.urgent ? 'text-red-400' : ''}`}>
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Orders and Status Overview */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card className="card-enhanced">
          <CardHeader>
            <CardTitle>
              {language === 'en' ? 'Recent Orders' : 'הזמנות אחרונות'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <div className="font-medium">{order.id}</div>
                    <div className="text-sm text-muted-foreground">{order.customerName}</div>
                  </div>
                  <div className="text-right space-y-1">
                    <StatusBadge status={order.status} />
                    <div className="text-sm text-muted-foreground">₪{order.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card className="card-enhanced">
          <CardHeader>
            <CardTitle>
              {language === 'en' ? 'Order Status Distribution' : 'פילוח סטטוס הזמנות'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">{language === 'en' ? 'Received' : 'התקבל'}</span>
                <span className="font-medium">{orderStats.received}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">{language === 'en' ? 'In Preparation' : 'בהכנה'}</span>
                <span className="font-medium">{orderStats.inPrep}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">{language === 'en' ? 'Ready for Pack' : 'מוכן לאריזה'}</span>
                <span className="font-medium">{orderStats.readyForPack}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">{language === 'en' ? 'Packing' : 'נארז'}</span>
                <span className="font-medium">{orderStats.packing}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">{language === 'en' ? 'Packed' : 'ארוז'}</span>
                <span className="font-medium">{orderStats.packed}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">{language === 'en' ? 'Assigned' : 'הוקצה'}</span>
                <span className="font-medium">{orderStats.assigned}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">{language === 'en' ? 'On the Way' : 'בדרך'}</span>
                <span className="font-medium">{orderStats.onTheWay}</span>
              </div>
              <div className="flex items-center justify-between border-t pt-2">
                <span className="text-sm font-medium">{language === 'en' ? 'Delivered' : 'נמסר'}</span>
                <span className="font-bold text-green-400">{orderStats.delivered}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}