import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api, auth } from '@/lib/api';
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

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }

      if (orderId) {
        fetchOrderDetails();
      }
    };

    checkAuth();
  }, [orderId, navigate]);

  const fetchOrderDetails = async () => {
    if (!orderId) return;

    try {
      console.log("Fetching order details for order:", orderId);

      const orderData = await api.getOrder(orderId);
      console.log("Order data:", orderData);
      setOrder(orderData);

    } catch (error: any) {
      console.error("Error fetching order:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load order details",
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
      case 'processing':
        return <Clock className="h-6 w-6" />;
      case 'completed':
        return <CheckCircle2 className="h-6 w-6" />;
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

  const getStatusDescription = (status: string) => {
    switch (status) {
      case 'pending':
      case 'processing':
        return 'Your order is being processed';
      case 'completed':
        return 'Payment confirmed, preparing your order';
      case 'packaged':
        return 'Your items are being packaged';
      case 'shipped':
        return 'Your order is on the way';
      case 'delivered':
        return 'Order delivered successfully';
      default:
        return 'Processing your order';
    }
  };

  const statusSteps = ['processing', 'completed', 'packaged', 'shipped', 'delivered'];
  const currentStepIndex = order ? statusSteps.indexOf(order.status) : -1;

  const getItems = (items: any) => {
    try {
      if (Array.isArray(items)) {
        return items;
      }

      if (typeof items === 'string') {
        return JSON.parse(items);
      }

      return [];
    } catch (error) {
      console.error("Error parsing items:", error);
      return [];
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <Package className="h-24 w-24 mx-auto mb-6 text-muted-foreground" />
        <h2 className="text-3xl font-bold mb-4">Order Not Found</h2>
        <p className="text-muted-foreground mb-8">The order you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/order-history')}>
          Back to Orders
        </Button>
      </div>
    );
  }

  const items = getItems(order.items);

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
                      <div className={`rounded-full p-3 ${isCompleted
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                        }`}>
                        {getStatusIcon(step)}
                      </div>
                      {index < statusSteps.length - 1 && (
                        <div className={`w-0.5 h-12 mt-2 ${isCompleted ? 'bg-primary' : 'bg-muted'
                          }`} />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <p className={`font-semibold capitalize ${isCurrent ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'
                          }`}>
                          {step === 'completed' ? 'Payment Completed' : step === 'processing' ? 'Processing' : step}
                        </p>
                        {isCurrent && (
                          <Badge variant="secondary" className="bg-primary/20 text-primary">
                            Current
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {getStatusDescription(step)}
                      </p>
                      {isCompleted && order.updated_at && index === currentStepIndex && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Updated: {new Date(order.updated_at).toLocaleDateString()}
                        </p>
                      )}
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
              {items.length > 0 ? (
                items.map((item: any, index: number) => (
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
                      {item.size && (
                        <p className="text-sm text-muted-foreground">Size: {item.size}</p>
                      )}
                      <p className="text-sm font-semibold mt-1">
                        {formatPrice(item.price)} × {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No items found in this order
                </p>
              )}
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
                <Badge className={`mt-1 ${order.payment_status === 'paid'
                    ? 'bg-green-500'
                    : 'bg-yellow-500'
                  }`}>
                  {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                </Badge>
              </div>
              <div>
                <p className="text-muted-foreground">Payment Reference</p>
                <p className="font-mono text-xs break-all">{order.payment_reference}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Delivery Address</h2>
            <div className="space-y-1 text-sm">
              <p className="font-semibold">{order.delivery_address}</p>
              <p className="text-muted-foreground">{order.delivery_city}, {order.delivery_state}</p>
              <div className="mt-3 space-y-1">
                <p className="text-muted-foreground">Phone: {order.phone_number}</p>
                {order.whatsapp_number && (
                  <p className="text-muted-foreground">WhatsApp: {order.whatsapp_number}</p>
                )}
              </div>
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