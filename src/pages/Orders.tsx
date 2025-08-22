import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import OrderCard from '@/components/OrderCard';
import { Plus, Search } from 'lucide-react';
import { Priority } from '@/types';

export default function Orders() {
  const { orders, addOrder, language } = useStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form state
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [dishes, setDishes] = useState('');
  const [price, setPrice] = useState('');
  const [priority, setPriority] = useState<Priority>('NORMAL');

  const handleAddOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerName.trim() || !phone.trim() || !address.trim() || !dishes.trim() || !price) {
      return;
    }

    addOrder({
      customerName: customerName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      notes: notes.trim() || undefined,
      dishes: dishes.split(',').map(d => d.trim()).filter(d => d),
      price: Number(price),
      status: 'RECEIVED',
      priority
    });

    // Reset form
    setCustomerName('');
    setPhone('');
    setAddress('');
    setNotes('');
    setDishes('');
    setPrice('');
    setPriority('NORMAL');
    setShowAddForm(false);
  };

  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.phone.includes(searchTerm) ||
    order.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {language === 'en' ? 'Order Management' : 'ניהול הזמנות'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'en' 
              ? 'Create new orders and manage existing ones'
              : 'צור הזמנות חדשות ונהל קיימות'
            }
          </p>
        </div>
        
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-gradient-primary hover:opacity-90"
        >
          <Plus className="h-4 w-4 mr-2" />
          {language === 'en' ? 'New Order' : 'הזמנה חדשה'}
        </Button>
      </div>

      {/* Add Order Form */}
      {showAddForm && (
        <Card className="card-enhanced">
          <CardHeader>
            <CardTitle>
              {language === 'en' ? 'Create New Order' : 'צור הזמנה חדשה'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddOrder} className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="customerName">
                  {language === 'en' ? 'Customer Name' : 'שם לקוח'}
                </Label>
                <Input
                  id="customerName"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder={language === 'en' ? 'Enter customer name' : 'הכנס שם לקוח'}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  {language === 'en' ? 'Phone Number' : 'מספר טלפון'}
                </Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={language === 'en' ? 'Phone number' : 'מספר טלפון'}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">
                  {language === 'en' ? 'Delivery Address' : 'כתובת משלוח'}
                </Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={language === 'en' ? 'Full delivery address' : 'כתובת משלוח מלאה'}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dishes">
                  {language === 'en' ? 'Dishes (comma separated)' : 'מנות (מופרדות בפסיק)'}
                </Label>
                <Input
                  id="dishes"
                  value={dishes}
                  onChange={(e) => setDishes(e.target.value)}
                  placeholder={language === 'en' ? 'Sushi, Ramen, etc.' : 'סושי, ראמן, וכו\''}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">
                  {language === 'en' ? 'Total Price (₪)' : 'מחיר סופי (₪)'}
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">
                  {language === 'en' ? 'Priority' : 'עדיפות'}
                </Label>
                <Select value={priority} onValueChange={(value) => setPriority(value as Priority)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">
                      {language === 'en' ? 'Low' : 'נמוכה'}
                    </SelectItem>
                    <SelectItem value="NORMAL">
                      {language === 'en' ? 'Normal' : 'רגילה'}
                    </SelectItem>
                    <SelectItem value="URGENT">
                      {language === 'en' ? 'Urgent' : 'דחופה'}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">
                  {language === 'en' ? 'Notes (Optional)' : 'הערות (אופציונלי)'}
                </Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={language === 'en' ? 'Special instructions or notes' : 'הוראות מיוחדות או הערות'}
                  rows={3}
                />
              </div>

              <div className="md:col-span-2 flex gap-2">
                <Button type="submit" className="bg-gradient-primary hover:opacity-90">
                  {language === 'en' ? 'Create Order' : 'צור הזמנה'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  {language === 'en' ? 'Cancel' : 'ביטול'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={language === 'en' ? 'Search orders...' : 'חפש הזמנות...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredOrders.length === 0 ? (
          <Card className="card-enhanced md:col-span-2 lg:col-span-3">
            <CardContent className="p-8 text-center text-muted-foreground">
              {language === 'en' 
                ? 'No orders found'
                : 'לא נמצאו הזמנות'
              }
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))
        )}
      </div>
    </div>
  );
}