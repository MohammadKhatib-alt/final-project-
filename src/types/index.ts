export type OrderStatus = 
  | 'RECEIVED'
  | 'IN_PREP'
  | 'READY_FOR_PACK'
  | 'PACKING'
  | 'PACKED'
  | 'ASSIGNED'
  | 'ON_THE_WAY'
  | 'DELIVERED';

export type UserRole = 
  | 'MANAGER'
  | 'KITCHEN'
  | 'PACKAGING'
  | 'COURIER'
  | 'CUSTOMER_SERVICE';

export type Priority = 'LOW' | 'NORMAL' | 'URGENT';

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  notes?: string;
  dishes: string[];
  price: number;
  status: OrderStatus;
  priority: Priority;
  assignedCourier?: string;
  createdAt: Date;
  updatedAt: Date;
  estimatedDelivery?: Date;
}

export interface Courier {
  id: string;
  name: string;
  phone: string;
  isActive: boolean;
  currentOrders: string[];
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export const ORDER_STATUS_FLOW: Record<OrderStatus, OrderStatus[]> = {
  RECEIVED: ['IN_PREP'],
  IN_PREP: ['READY_FOR_PACK'],
  READY_FOR_PACK: ['PACKING'],
  PACKING: ['PACKED'],
  PACKED: ['ASSIGNED'],
  ASSIGNED: ['ON_THE_WAY'],
  ON_THE_WAY: ['DELIVERED'],
  DELIVERED: []
};

export const STATUS_LABELS: Record<OrderStatus, { en: string; he: string }> = {
  RECEIVED: { en: 'Received', he: 'התקבל' },
  IN_PREP: { en: 'In Preparation', he: 'בהכנה' },
  READY_FOR_PACK: { en: 'Ready for Packing', he: 'מוכן לאריזה' },
  PACKING: { en: 'Packing', he: 'נארז' },
  PACKED: { en: 'Packed', he: 'ארוז' },
  ASSIGNED: { en: 'Assigned', he: 'הוקצה' },
  ON_THE_WAY: { en: 'On the Way', he: 'בדרך' },
  DELIVERED: { en: 'Delivered', he: 'נמסר' }
};

export const ROLE_LABELS: Record<UserRole, { en: string; he: string }> = {
  MANAGER: { en: 'Manager', he: 'מנהל' },
  KITCHEN: { en: 'Kitchen', he: 'מטבח' },
  PACKAGING: { en: 'Packaging', he: 'אריזה' },
  COURIER: { en: 'Courier', he: 'שליח' },
  CUSTOMER_SERVICE: { en: 'Customer Service', he: 'שירות לקוחות' }
};