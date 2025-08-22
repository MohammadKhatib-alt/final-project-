import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge, PriorityBadge } from '@/components/StatusBadge';
import { Order, OrderStatus, ORDER_STATUS_FLOW } from '@/types';
import { useStore } from '@/store/useStore';
import { Clock, MapPin, Phone, User, Utensils } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface OrderCardProps {
  order: Order;
  showActions?: boolean;
  availableActions?: OrderStatus[];
  onStatusChange?: (orderId: string, newStatus: OrderStatus) => void;
}

export default function OrderCard({ 
  order, 
  showActions = false, 
  availableActions = [],
  onStatusChange 
}: OrderCardProps) {
  const { language } = useStore();

  const getActionLabel = (status: OrderStatus) => {
    const labels: Record<OrderStatus, { en: string; he: string }> = {
      'RECEIVED': { en: 'Received', he: 'התקבל' },
      'IN_PREP': { en: 'Start Prep', he: 'התחל הכנה' },
      'READY_FOR_PACK': { en: 'Ready to Pack', he: 'מוכן לאריזה' },
      'PACKING': { en: 'Start Packing', he: 'התחל אריזה' },
      'PACKED': { en: 'Mark Packed', he: 'סמן כארוז' },
      'ASSIGNED': { en: 'Assign Courier', he: 'הקצה שליח' },
      'ON_THE_WAY': { en: 'On the Way', he: 'בדרך' },
      'DELIVERED': { en: 'Mark Delivered', he: 'סמן כנמסר' }
    };
    return labels[status][language];
  };

  const formatPrice = (price: number) => {
    return `₪${price}`;
  };

  const formatTime = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const isLate = order.estimatedDelivery && new Date() > order.estimatedDelivery;
  const isAtRisk = order.estimatedDelivery && 
    new Date() > new Date(order.estimatedDelivery.getTime() - 15 * 60 * 1000); // 15 mins before

  return (
    <Card className={`card-enhanced transition-smooth hover:shadow-elevated ${
      isLate ? 'border-red-500/50' : isAtRisk ? 'border-yellow-500/50' : ''
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">{order.id}</h3>
            <div className="flex items-center gap-2">
              <StatusBadge status={order.status} />
              <PriorityBadge priority={order.priority} />
            </div>
          </div>
          
          <div className="text-right text-sm text-muted-foreground">
            <div className="font-semibold text-foreground">{formatPrice(order.price)}</div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatTime(order.createdAt)}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Customer Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{order.customerName}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>{order.phone}</span>
          </div>
          
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mt-0.5" />
            <span>{order.address}</span>
          </div>
        </div>

        {/* Dishes */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Utensils className="h-4 w-4 text-muted-foreground" />
            {language === 'en' ? 'Dishes' : 'מנות'}
          </div>
          <div className="text-sm text-muted-foreground">
            {order.dishes.join(', ')}
          </div>
        </div>

        {/* Courier Assignment */}
        {order.assignedCourier && (
          <div className="p-2 bg-info/10 border border-info/20 rounded-lg">
            <div className="text-sm font-medium text-info">
              {language === 'en' ? 'Assigned to:' : 'הוקצה ל:'} {order.assignedCourier}
            </div>
          </div>
        )}

        {/* Notes */}
        {order.notes && (
          <div className="p-2 bg-muted/50 rounded-lg">
            <div className="text-sm">
              <span className="font-medium">{language === 'en' ? 'Notes:' : 'הערות:'}</span>
              <span className="ml-2">{order.notes}</span>
            </div>
          </div>
        )}

        {/* Time Indicators */}
        {order.estimatedDelivery && (
          <div className={`p-2 rounded-lg border text-sm ${
            isLate 
              ? 'bg-destructive/10 border-destructive/20 text-destructive'
              : isAtRisk
              ? 'bg-warning/10 border-warning/20 text-warning'
              : 'bg-success/10 border-success/20 text-success'
          }`}>
            {language === 'en' ? 'Estimated delivery:' : 'משלוח משוער:'} {formatTime(order.estimatedDelivery)}
          </div>
        )}

        {/* Actions */}
        {showActions && availableActions.length > 0 && (
          <div className="flex gap-2 pt-2 border-t border-border/50">
            {availableActions.map((action) => (
              <Button
                key={action}
                size="sm"
                variant={action === 'DELIVERED' ? 'default' : 'secondary'}
                onClick={() => onStatusChange?.(order.id, action)}
                className="transition-smooth"
              >
                {getActionLabel(action)}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}