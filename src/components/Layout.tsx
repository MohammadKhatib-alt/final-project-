import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { ROLE_LABELS } from '@/types';
import { 
  LogOut, 
  Home, 
  ShoppingCart, 
  ChefHat, 
  Package, 
  Truck, 
  Users, 
  BarChart3,
  Languages
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { currentUser, isAuthenticated, language, logout, toggleLanguage } = useStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavItems = () => {
    if (!currentUser) return [];

    const baseItems = [
      { path: '/', icon: Home, label: { en: 'Dashboard', he: 'לוח בקרה' } }
    ];

    switch (currentUser.role) {
      case 'MANAGER':
        return [
          ...baseItems,
          { path: '/orders', icon: ShoppingCart, label: { en: 'Orders', he: 'הזמנות' } },
          { path: '/kitchen', icon: ChefHat, label: { en: 'Kitchen', he: 'מטבח' } },
          { path: '/packaging', icon: Package, label: { en: 'Packaging', he: 'אריזה' } },
          { path: '/delivery', icon: Truck, label: { en: 'Delivery', he: 'משלוחים' } },
          { path: '/customer-service', icon: Users, label: { en: 'Customer Service', he: 'שירות לקוחות' } },
          { path: '/reports', icon: BarChart3, label: { en: 'Reports', he: 'דוחות' } }
        ];
      case 'KITCHEN':
        return [
          ...baseItems,
          { path: '/kitchen', icon: ChefHat, label: { en: 'Kitchen', he: 'מטבח' } }
        ];
      case 'PACKAGING':
        return [
          ...baseItems,
          { path: '/packaging', icon: Package, label: { en: 'Packaging', he: 'אריזה' } }
        ];
      case 'COURIER':
        return [
          ...baseItems,
          { path: '/courier', icon: Truck, label: { en: 'My Deliveries', he: 'המשלוחים שלי' } }
        ];
      case 'CUSTOMER_SERVICE':
        return [
          ...baseItems,
          { path: '/customer-service', icon: Users, label: { en: 'Customer Service', he: 'שירות לקוחות' } }
        ];
      default:
        return baseItems;
    }
  };

  if (!isAuthenticated) {
    return children;
  }

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-background" dir={language === 'he' ? 'rtl' : 'ltr'}>
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-navbar items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Kampai Delivery
              </h1>
              {currentUser && (
                <span className="text-sm text-muted-foreground">
                  {ROLE_LABELS[currentUser.role][language]} - {currentUser.name}
                </span>
              )}
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-smooth
                      ${isActive 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }
                    `}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label[language]}</span>
                  </Link>
                );
              })}
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="h-8 w-8 p-0"
              >
                <Languages className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="h-8 w-8 p-0"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}