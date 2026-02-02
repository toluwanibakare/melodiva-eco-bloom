import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, auth } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Package, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const OrderHistory = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }

      fetchOrders();
    };

    checkAuth();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      const data = await api.getMyOrders();
      console.log("Fetched orders:", data);
      setOrders(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error("Fetch orders error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load order history.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'completed': return 'bg-green-500';
      case 'packaged': return 'bg-blue-500';
      case 'shipped': return 'bg-purple-500';
      case 'delivered': return 'bg-green-600';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getItemsCount = (items: any) => {
    try {
      // Check if items is already an array (from our checkout) or needs parsing
      if (Array.isArray(items)) {
        return items.length;
      }
      
      // Try to parse as JSON if it's a string
      if (typeof items === 'string') {
        const parsedItems = JSON.parse(items);
        return Array.isArray(parsedItems) ? parsedItems.length : 0;
      }
      
      return 0;
    } catch (error) {
      console.error("Error parsing items:", error);
      return 0;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  console.log("Current orders state:", orders);

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <Package className="h-24 w-24 mx-auto mb-6 text-muted-foreground" />
        <h2 className="text-3xl font-bold mb-4">No Orders Yet</h2>
        <p className="text-muted-foreground mb-8">Start shopping to see your orders here!</p>
        <Button asChild size="lg">
          <a href="/shop">Continue Shopping</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Order History</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold">{order.order_number}</h3>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  {new Date(order.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-sm text-muted-foreground">
                  {getItemsCount(order.items)} item(s) • {formatPrice(order.total)}
                </p>
                {order.affiliate_code && (
                  <p className="text-sm text-green-600 mt-1">
                    Used code: {order.affiliate_code}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => navigate(`/order-tracking/${order.id}`)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Track Order
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;