import { Badge } from '@/components/ui/badge';
import { OrderStatus, Priority, STATUS_LABELS } from '@/types';
import { useStore } from '@/store/useStore';

interface StatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

interface PriorityBadgeProps {
  priority: Priority;
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const { language } = useStore();
  
  const getStatusClass = (status: OrderStatus) => {
    const baseClasses = 'border text-xs font-medium px-2 py-1';
    
    switch (status) {
      case 'RECEIVED':
        return `${baseClasses} status-received`;
      case 'IN_PREP':
        return `${baseClasses} status-in-prep`;
      case 'READY_FOR_PACK':
        return `${baseClasses} status-ready-for-pack`;
      case 'PACKING':
        return `${baseClasses} status-packing`;
      case 'PACKED':
        return `${baseClasses} status-packed`;
      case 'ASSIGNED':
        return `${baseClasses} status-assigned`;
      case 'ON_THE_WAY':
        return `${baseClasses} status-on-the-way`;
      case 'DELIVERED':
        return `${baseClasses} status-delivered`;
      default:
        return `${baseClasses} bg-gray-500/20 text-gray-400 border-gray-500/30`;
    }
  };

  return (
    <Badge className={`${getStatusClass(status)} ${className}`}>
      {STATUS_LABELS[status][language]}
    </Badge>
  );
}

export function PriorityBadge({ priority, className = '' }: PriorityBadgeProps) {
  const { language } = useStore();
  
  const getPriorityClass = (priority: Priority) => {
    const baseClasses = 'border text-xs font-medium px-2 py-1';
    
    switch (priority) {
      case 'URGENT':
        return `${baseClasses} priority-urgent`;
      case 'NORMAL':
        return `${baseClasses} priority-normal`;
      case 'LOW':
        return `${baseClasses} priority-low`;
      default:
        return `${baseClasses} bg-gray-500/20 text-gray-400 border-gray-500/30`;
    }
  };

  const priorityLabels = {
    URGENT: { en: 'Urgent', he: 'דחוף' },
    NORMAL: { en: 'Normal', he: 'רגיל' },
    LOW: { en: 'Low', he: 'נמוך' }
  };

  return (
    <Badge className={`${getPriorityClass(priority)} ${className}`}>
      {priorityLabels[priority][language]}
    </Badge>
  );
}