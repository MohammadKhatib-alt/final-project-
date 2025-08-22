import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useStore } from '@/store/useStore';
import { UserRole, ROLE_LABELS } from '@/types';
import { ChefHat } from 'lucide-react';

export default function Login() {
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole | ''>('');
  const { login, language } = useStore();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role) return;
    
    login(name.trim(), role);
    navigate('/');
  };

  const roles: UserRole[] = ['MANAGER', 'KITCHEN', 'PACKAGING', 'COURIER', 'CUSTOMER_SERVICE'];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-card p-4">
      <div className="w-full max-w-md">
        <Card className="card-elevated">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mb-4">
              <ChefHat className="h-8 w-8 text-primary-foreground" />
            </div>
            
            <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
              Kampai Delivery
            </CardTitle>
            
            <CardDescription>
              {language === 'en' 
                ? 'Sign in to access the delivery management system'
                : 'התחבר כדי לגשת למערכת ניהול המשלוחים'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">
                  {language === 'en' ? 'Full Name' : 'שם מלא'}
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder={language === 'en' ? 'Enter your name' : 'הכנס את שמך'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="transition-smooth focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">
                  {language === 'en' ? 'Role' : 'תפקיד'}
                </Label>
                <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                  <SelectTrigger className="transition-smooth focus:ring-primary">
                    <SelectValue placeholder={
                      language === 'en' ? 'Select your role' : 'בחר את התפקיד שלך'
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((roleOption) => (
                      <SelectItem key={roleOption} value={roleOption}>
                        {ROLE_LABELS[roleOption][language]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-primary hover:opacity-90 transition-smooth"
                disabled={!name.trim() || !role}
              >
                {language === 'en' ? 'Sign In' : 'התחבר'}
              </Button>
            </form>
            
            <div className="mt-6 text-center text-sm text-muted-foreground">
              {language === 'en' 
                ? 'Demo system - No real authentication required'
                : 'מערכת הדגמה - לא נדרש אימות אמיתי'
              }
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}