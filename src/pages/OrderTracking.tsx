import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Package, Truck, CheckCircle2, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const OrderTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);
  const [statusHistory, setStatusHistory] = useState<any[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }

      fetchOrderDetails();
    };

    checkAuth();
  }, [orderId, navigate]);

  const fetchOrderDetails = async () => {
    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (orderError) throw orderError;
      setOrder(orderData);

      const { data: historyData, error: historyError } = await supabase
        .from('order_status_history')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: false });

      if (historyError) throw historyError;
      setStatusHistory(historyData || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load order details",
        variant: "destructive"
      });
      navigate('/order-history');
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
      case 'completed':
        return <Clock className="h-6 w-6" />;
      case 'packaged':
        return <Package className="h-6 w-6" />;
      case 'shipped':
        return <Truck className="h-6 w-6" />;
      case 'delivered':
        return <CheckCircle2 className="h-6 w-6" />;
      default:
        return <Clock className="h-6 w-6" />;
    }
  };

  const statusSteps = ['completed', 'packaged', 'shipped', 'delivered'];
  const currentStepIndex = order ? statusSteps.indexOf(order.status) : -1;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const items = JSON.parse(order.items);

  return (
    <div className="container mx-auto px-4 py-12">
      <Button variant="outline" onClick={() => navigate('/order-history')} className="mb-6">
        ← Back to Orders
      </Button>

      <h1 className="text-4xl font-bold mb-8">Track Order</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status Timeline */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Order Status</h2>
            <div className="space-y-6">
              {statusSteps.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                
                return (
                  <div key={step} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`rounded-full p-3 ${
                        isCompleted 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {getStatusIcon(step)}
                      </div>
                      {index < statusSteps.length - 1 && (
                        <div className={`w-0.5 h-12 mt-2 ${
                          isCompleted ? 'bg-primary' : 'bg-muted'
                        }`} />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className={`font-semibold capitalize ${
                        isCurrent ? 'text-primary' : ''
                      }`}>
                        {step === 'completed' ? 'Payment Completed' : step}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {isCompleted 
                          ? isCurrent 
                            ? 'Current status' 
                            : 'Completed'
                          : 'Pending'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Order Items */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Order Items</h2>
            <div className="space-y-4">
              {items.map((item: any, index: number) => (
                <div key={index} className="flex gap-4 pb-4 border-b last:border-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    {item.variant && (
                      <p className="text-sm text-muted-foreground capitalize">{item.variant}</p>
                    )}
                    <p className="text-sm text-muted-foreground">{item.size}</p>
                    <p className="text-sm font-semibold mt-1">
                      {formatPrice(item.price)} × {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Order Details</h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">Order Number</p>
                <p className="font-mono font-semibold">{order.order_number}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Order Date</p>
                <p className="font-semibold">
                  {new Date(order.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Payment Status</p>
                <Badge className="mt-1">
                  {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                </Badge>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Delivery Address</h2>
            <div className="space-y-1 text-sm">
              <p>{order.delivery_address}</p>
              <p>{order.delivery_city}, {order.delivery_state}</p>
              <p className="mt-3 text-muted-foreground">Phone: {order.phone_number}</p>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Payment Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>{formatPrice(order.delivery_fee)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-base">
                <span>Total</span>
                <span className="text-primary">{formatPrice(order.total)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
