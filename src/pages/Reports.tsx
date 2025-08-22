import { useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Clock, Target, Users, DollarSign } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function Reports() {
  const { orders, couriers, language } = useStore();

  const stats = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Basic counts
    const totalOrders = orders.length;
    const deliveredOrders = orders.filter(o => o.status === 'DELIVERED').length;
    const activeOrders = totalOrders - deliveredOrders;
    
    // Today's orders
    const todayOrders = orders.filter(o => 
      new Date(o.createdAt) >= today
    ).length;
    
    // Revenue calculations
    const totalRevenue = orders
      .filter(o => o.status === 'DELIVERED')
      .reduce((sum, o) => sum + o.price, 0);
    
    const todayRevenue = orders
      .filter(o => o.status === 'DELIVERED' && new Date(o.createdAt) >= today)
      .reduce((sum, o) => sum + o.price, 0);
    
    // Performance metrics
    const averageOrderValue = deliveredOrders > 0 ? totalRevenue / deliveredOrders : 0;
    
    // Time metrics (simulated)
    const averageDeliveryTime = 35; // minutes (simulated)
    
    // Late orders
    const lateOrders = orders.filter(order => 
      order.estimatedDelivery && 
      now > order.estimatedDelivery && 
      order.status !== 'DELIVERED'
    ).length;
    
    // Delivery rate
    const deliveryRate = totalOrders > 0 ? (deliveredOrders / totalOrders) * 100 : 0;
    
    // Status distribution
    const statusDistribution = {
      RECEIVED: orders.filter(o => o.status === 'RECEIVED').length,
      IN_PREP: orders.filter(o => o.status === 'IN_PREP').length,
      READY_FOR_PACK: orders.filter(o => o.status === 'READY_FOR_PACK').length,
      PACKING: orders.filter(o => o.status === 'PACKING').length,
      PACKED: orders.filter(o => o.status === 'PACKED').length,
      ASSIGNED: orders.filter(o => o.status === 'ASSIGNED').length,
      ON_THE_WAY: orders.filter(o => o.status === 'ON_THE_WAY').length,
      DELIVERED: orders.filter(o => o.status === 'DELIVERED').length,
    };
    
    // Priority distribution
    const priorityDistribution = {
      LOW: orders.filter(o => o.priority === 'LOW').length,
      NORMAL: orders.filter(o => o.priority === 'NORMAL').length,
      URGENT: orders.filter(o => o.priority === 'URGENT').length,
    };
    
    // Courier performance
    const courierStats = couriers.map(courier => ({
      name: courier.name,
      activeOrders: courier.currentOrders.length,
      totalDelivered: orders.filter(o => 
        o.assignedCourier === courier.name && o.status === 'DELIVERED'
      ).length
    }));
    
    return {
      totalOrders,
      deliveredOrders,
      activeOrders,
      todayOrders,
      totalRevenue,
      todayRevenue,
      averageOrderValue,
      averageDeliveryTime,
      lateOrders,
      deliveryRate,
      statusDistribution,
      priorityDistribution,
      courierStats
    };
  }, [orders, couriers]);

  const mainMetrics = [
    {
      title: language === 'en' ? 'Total Orders' : 'סך הזמנות',
      value: stats.totalOrders,
      icon: BarChart3,
      color: 'text-blue-400',
      description: language === 'en' ? 'All time' : 'מכל הזמנים'
    },
    {
      title: language === 'en' ? 'Orders Today' : 'הזמנות היום',
      value: stats.todayOrders,
      icon: TrendingUp,
      color: 'text-green-400',
      description: language === 'en' ? 'New today' : 'חדשות היום'
    },
    {
      title: language === 'en' ? 'Delivery Rate' : 'שיעור משלוח',
      value: `${stats.deliveryRate.toFixed(1)}%`,
      icon: Target,
      color: 'text-emerald-400',
      description: language === 'en' ? 'Success rate' : 'שיעור הצלחה'
    },
    {
      title: language === 'en' ? 'Average Time' : 'זמן ממוצע',
      value: `${stats.averageDeliveryTime}m`,
      icon: Clock,
      color: 'text-purple-400',
      description: language === 'en' ? 'Delivery time' : 'זמן משלוח'
    }
  ];

  const revenueMetrics = [
    {
      title: language === 'en' ? 'Total Revenue' : 'הכנסות כוללות',
      value: `₪${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-400',
      description: language === 'en' ? 'All delivered orders' : 'כל ההזמנות שנמסרו'
    },
    {
      title: language === 'en' ? 'Today\'s Revenue' : 'הכנסות היום',
      value: `₪${stats.todayRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-blue-400',
      description: language === 'en' ? 'Revenue today' : 'הכנסות היום'
    },
    {
      title: language === 'en' ? 'Average Order' : 'הזמנה ממוצעת',
      value: `₪${stats.averageOrderValue.toFixed(0)}`,
      icon: BarChart3,
      color: 'text-purple-400',
      description: language === 'en' ? 'Per order' : 'לכל הזמנה'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {language === 'en' ? 'Reports & Analytics' : 'דוחות ואנליטיקה'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'en' 
              ? 'Performance insights and business metrics'
              : 'תובנות ביצועים ומדדים עסקיים'
            }
          </p>
        </div>
        <BarChart3 className="h-8 w-8 text-primary" />
      </div>

      {/* Main Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {mainMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title} className="card-enhanced">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${metric.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground">{metric.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Revenue Metrics */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          {language === 'en' ? 'Revenue Analytics' : 'אנליטיקת הכנסות'}
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {revenueMetrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <Card key={metric.title} className="card-enhanced">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${metric.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <p className="text-xs text-muted-foreground">{metric.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Status Distribution */}
        <Card className="card-enhanced">
          <CardHeader>
            <CardTitle>
              {language === 'en' ? 'Order Status Distribution' : 'פילוח סטטוס הזמנות'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.statusDistribution).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-sm">{status.replace('_', ' ')}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 bg-muted rounded-full flex-1 w-20">
                      <div 
                        className="h-2 bg-primary rounded-full"
                        style={{ width: `${stats.totalOrders > 0 ? (count / stats.totalOrders) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="font-medium text-sm w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Courier Performance */}
        <Card className="card-enhanced">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {language === 'en' ? 'Courier Performance' : 'ביצועי שליחים'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.courierStats.map((courier) => (
                <div key={courier.name} className="p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{courier.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {courier.activeOrders} {language === 'en' ? 'active' : 'פעיל'}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {language === 'en' ? 'Delivered:' : 'נמסר:'} {courier.totalDelivered} {language === 'en' ? 'orders' : 'הזמנות'}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Priority Analysis */}
        <Card className="card-enhanced">
          <CardHeader>
            <CardTitle>
              {language === 'en' ? 'Priority Distribution' : 'פילוח עדיפויות'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.priorityDistribution).map(([priority, count]) => {
                const percentage = stats.totalOrders > 0 ? (count / stats.totalOrders) * 100 : 0;
                const priorityColors = {
                  URGENT: 'bg-red-500',
                  NORMAL: 'bg-blue-500',
                  LOW: 'bg-green-500'
                };
                
                return (
                  <div key={priority} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{priority.toLowerCase()}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 bg-muted rounded-full flex-1 w-20">
                        <div 
                          className={`h-2 rounded-full ${priorityColors[priority as keyof typeof priorityColors]}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="font-medium text-sm w-8 text-right">{count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Performance Alerts */}
        <Card className="card-enhanced">
          <CardHeader>
            <CardTitle className="text-red-400">
              {language === 'en' ? 'Performance Alerts' : 'התראות ביצועים'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.lateOrders > 0 && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <div className="font-medium text-red-400 text-sm">
                    {language === 'en' ? 'Late Orders' : 'הזמנות מאוחרות'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stats.lateOrders} {language === 'en' ? 'orders are past their delivery time' : 'הזמנות עברו את זמן המשלוח'}
                  </div>
                </div>
              )}
              
              {stats.activeOrders > 10 && (
                <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <div className="font-medium text-yellow-400 text-sm">
                    {language === 'en' ? 'High Load' : 'עומס גבוה'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stats.activeOrders} {language === 'en' ? 'active orders need attention' : 'הזמנות פעילות זקוקות לתשומת לב'}
                  </div>
                </div>
              )}
              
              {stats.lateOrders === 0 && stats.activeOrders <= 10 && (
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="font-medium text-green-400 text-sm">
                    {language === 'en' ? 'All Good' : 'הכל טוב'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {language === 'en' ? 'No performance issues detected' : 'לא זוהו בעיות ביצועים'}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}