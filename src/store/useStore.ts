import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Order, Courier, User, UserRole, OrderStatus } from '@/types';

interface AppState {
  // Auth
  currentUser: User | null;
  isAuthenticated: boolean;
  
  // Orders
  orders: Order[];
  
  // Couriers
  couriers: Courier[];
  
  // UI
  language: 'en' | 'he';
  
  // Actions
  login: (name: string, role: UserRole) => void;
  logout: () => void;
  
  // Order actions
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus, courierName?: string) => void;
  assignCourier: (orderId: string, courierId: string) => void;
  
  // Utility
  getOrdersByStatus: (statuses: OrderStatus[]) => Order[];
  getOrdersForCourier: (courierName: string) => Order[];
  
  // Language
  toggleLanguage: () => void;
}

// Mock data
const mockCouriers: Courier[] = [
  { id: '1', name: 'David Cohen', phone: '054-1234567', isActive: true, currentOrders: [] },
  { id: '2', name: 'Sarah Levi', phone: '054-2345678', isActive: true, currentOrders: [] },
  { id: '3', name: 'Michael Green', phone: '054-3456789', isActive: true, currentOrders: [] },
  { id: '4', name: 'Rachel Ben-David', phone: '054-4567890', isActive: false, currentOrders: [] },
];

const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    customerName: 'John Doe',
    phone: '054-1111111',
    address: 'Tel Aviv, Rothschild 1',
    dishes: ['Sushi Combo', 'Miso Soup'],
    price: 89,
    status: 'RECEIVED',
    priority: 'NORMAL',
    createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    updatedAt: new Date(Date.now() - 30 * 60 * 1000),
    estimatedDelivery: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
  },
  {
    id: 'ORD-002',
    customerName: 'Jane Smith',
    phone: '054-2222222',
    address: 'Jerusalem, King George 25',
    dishes: ['Ramen Bowl', 'Gyoza', 'Green Tea'],
    price: 67,
    status: 'IN_PREP',
    priority: 'URGENT',
    createdAt: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    updatedAt: new Date(Date.now() - 15 * 60 * 1000),
    estimatedDelivery: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
  },
  {
    id: 'ORD-003',
    customerName: 'Ahmed Hassan',
    phone: '054-3333333',
    address: 'Haifa, Herzl 10',
    dishes: ['Bento Box', 'Sake'],
    price: 78,
    status: 'PACKED',
    priority: 'NORMAL',
    assignedCourier: 'David Cohen',
    createdAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    updatedAt: new Date(Date.now() - 10 * 60 * 1000),
    estimatedDelivery: new Date(Date.now() + 20 * 60 * 1000), // 20 minutes from now
  }
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentUser: null,
      isAuthenticated: false,
      orders: mockOrders,
      couriers: mockCouriers,
      language: 'en',
      
      // Auth actions
      login: (name: string, role: UserRole) => {
        const user: User = {
          id: `user-${Date.now()}`,
          name,
          role
        };
        set({ currentUser: user, isAuthenticated: true });
      },
      
      logout: () => {
        set({ currentUser: null, isAuthenticated: false });
      },
      
      // Order actions
      addOrder: (orderData) => {
        const newOrder: Order = {
          ...orderData,
          id: `ORD-${String(get().orders.length + 1).padStart(3, '0')}`,
          createdAt: new Date(),
          updatedAt: new Date(),
          estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000), // 45 minutes from now
        };
        
        set((state) => ({
          orders: [...state.orders, newOrder]
        }));
      },
      
      updateOrderStatus: (orderId: string, status: OrderStatus, courierName?: string) => {
        set((state) => ({
          orders: state.orders.map(order => 
            order.id === orderId 
              ? { 
                  ...order, 
                  status, 
                  updatedAt: new Date(),
                  ...(courierName && { assignedCourier: courierName })
                }
              : order
          )
        }));
      },
      
      assignCourier: (orderId: string, courierId: string) => {
        const courier = get().couriers.find(c => c.id === courierId);
        if (courier) {
          set((state) => ({
            orders: state.orders.map(order =>
              order.id === orderId
                ? { 
                    ...order, 
                    status: 'ASSIGNED' as OrderStatus,
                    assignedCourier: courier.name,
                    updatedAt: new Date()
                  }
                : order
            ),
            couriers: state.couriers.map(c =>
              c.id === courierId
                ? { ...c, currentOrders: [...c.currentOrders, orderId] }
                : c
            )
          }));
        }
      },
      
      // Utility functions
      getOrdersByStatus: (statuses: OrderStatus[]) => {
        return get().orders.filter(order => statuses.includes(order.status));
      },
      
      getOrdersForCourier: (courierName: string) => {
        return get().orders.filter(order => order.assignedCourier === courierName);
      },
      
      // Language
      toggleLanguage: () => {
        set((state) => ({
          language: state.language === 'en' ? 'he' : 'en'
        }));
      }
    }),
    {
      name: 'kampai-delivery-storage',
      partialize: (state) => ({
        orders: state.orders,
        couriers: state.couriers,
        language: state.language
      })
    }
  )
);