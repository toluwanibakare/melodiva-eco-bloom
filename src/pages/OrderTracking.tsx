import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Loader2, Package, Truck, CheckCircle2, Clock, Search, ArrowLeft, MessageCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ReportIssueModal } from '@/components/ReportIssueModal';

const OrderTracking = () => {
  const { orderId: urlOrderId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchId, setSearchId] = useState(urlOrderId || '');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    if (urlOrderId) {
      setSearchId(urlOrderId);
      handleTrackOrder(urlOrderId);
    }
  }, [urlOrderId]);

  const handleTrackOrder = async (idToSearch?: string) => {
    const targetId = (idToSearch || searchId).trim();

    if (!targetId) {
      toast({
        title: "Order ID Required",
        description: "Please enter your Order ID or Order Number to track.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setSearched(true);
    setOrder(null);

    try {
      let orderData: any = null;
      try {
        orderData = await api.trackOrder(targetId);
      } catch (err) {
        orderData = await api.getOrder(targetId);
      }
      setOrder(orderData);
    } catch (error: any) {
      console.error("Error tracking order:", error);
      // Fallback: check if local storage guest orders exist
      try {
        const savedOrders = JSON.parse(localStorage.getItem('melodiva_guest_orders') || '[]');
        const localMatch = savedOrders.find((o: any) => 
          o.id === targetId || o.order_number === targetId || o.payment_reference === targetId
        );
        if (localMatch) {
          setOrder(localMatch);
          return;
        }
      } catch (e) {
        // ignore
      }

      toast({
        title: "Order Not Found",
        description: "No order matched that ID. Please verify your order number.",
        variant: "destructive"
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
      case 'processing':
        return <Clock className="h-5 w-5" />;
      case 'completed':
        return <CheckCircle2 className="h-5 w-5" />;
      case 'packaged':
        return <Package className="h-5 w-5" />;
      case 'shipped':
        return <Truck className="h-5 w-5" />;
      case 'delivered':
        return <CheckCircle2 className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case 'pending':
      case 'processing':
        return 'Your order is being processed by our team.';
      case 'completed':
        return 'Payment confirmed. Preparing your organic skincare products.';
      case 'packaged':
        return 'Your items are safely packaged and ready for dispatch.';
      case 'shipped':
        return 'Order is in transit with our logistics carrier.';
      case 'delivered':
        return 'Order delivered successfully. Thank you for choosing Melodiva!';
      default:
        return 'Processing your order.';
    }
  };

  const statusSteps = ['processing', 'completed', 'packaged', 'shipped', 'delivered'];
  const currentStepIndex = order ? statusSteps.indexOf(order.status || 'processing') : -1;

  const getItems = (items: any) => {
    try {
      if (Array.isArray(items)) return items;
      if (typeof items === 'string') return JSON.parse(items);
      return [];
    } catch (error) {
      return [];
    }
  };

  return (
    <div className="min-h-screen bg-background py-10 px-4 md:px-8 lg:px-12 w-full">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            <Package className="h-3.5 w-3.5" />
            <span>Public Order Tracker</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
            Track Your <span className="gradient-text">Order</span>
          </h1>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            No sign-in required! Enter your Order ID or Order Number below to check order status and delivery progress.
          </p>
        </div>

        {/* Order ID Input Form */}
        <Card className="p-6 md:p-8 bg-card border-border shadow-md rounded-3xl space-y-4 max-w-4xl mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleTrackOrder();
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Enter Order ID (e.g. MEL-1740920491 or Order Number)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="pl-12 h-13 text-base rounded-2xl bg-secondary/30 border-border focus:border-primary"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="btn-primary rounded-2xl h-13 px-8 text-sm font-bold shadow-md shrink-0"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Truck className="mr-2 h-4 w-4" />
                  Track Order
                </>
              )}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center sm:text-left">
            💡 <span className="font-semibold">Tip:</span> You can find your Order ID in your checkout confirmation receipt or email.
          </p>
        </Card>

        {/* Order Details Result */}
        {loading && (
          <div className="py-16 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-3" />
            <p className="text-sm font-semibold text-muted-foreground">Fetching order details...</p>
          </div>
        )}

        {!loading && searched && !order && (
          <Card className="p-10 text-center bg-card border-border rounded-3xl space-y-4 max-w-2xl mx-auto">
            <Package className="h-16 w-16 mx-auto text-muted-foreground/50" />
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-foreground">Order Not Found</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                We couldn't find an order matching "<span className="font-semibold text-foreground">{searchId}</span>". Please verify your order ID and try again.
              </p>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => handleTrackOrder()} variant="outline" className="rounded-xl">
                Try Search Again
              </Button>
              <Button asChild variant="ghost" className="rounded-xl">
                <a href="https://wa.me/2348078725283" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-4 w-4" /> Contact Support on WhatsApp
                </a>
              </Button>
            </div>
          </Card>
        )}

        {!loading && order && (
          <div className="space-y-8 animate-fade-in-up">
            {/* Timeline Progress */}
            <Card className="p-6 md:p-8 bg-card border-border rounded-3xl shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 pb-4 border-b border-border gap-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Order Reference</span>
                  <h2 className="text-2xl font-black text-foreground font-mono">{order.order_number || order.id}</h2>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={`text-xs px-3 py-1 font-bold ${
                    order.status === 'delivered' ? 'bg-emerald-500 text-white' : 'bg-primary text-primary-foreground'
                  }`}>
                    Status: {order.status ? order.status.toUpperCase() : 'PROCESSING'}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 rounded-xl"
                    onClick={() => setShowReportModal(true)}
                  >
                    <AlertTriangle className="h-4 w-4 mr-1.5" />
                    Report Issue
                  </Button>
                </div>
              </div>

              {/* Damaged Policy Warning Banner */}
              <div className="mb-6 p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-foreground gap-2">
                <span className="leading-relaxed">
                  <strong>Damaged or missing item?</strong> Inspect order on receipt. Take a photo/video proof within 24h for a replacement consideration.
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-amber-600 font-bold hover:underline shrink-0 p-0 h-auto"
                  onClick={() => setShowReportModal(true)}
                >
                  Claim Replacement &rarr;
                </Button>
              </div>

              {/* Progress Steps */}
              <div className="space-y-6 pt-2">
                {statusSteps.map((step, index) => {
                  const isCompleted = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;

                  return (
                    <div key={step} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`rounded-full p-3 transition-colors ${
                          isCompleted
                            ? 'bg-primary text-primary-foreground shadow-md'
                            : 'bg-secondary text-muted-foreground'
                        }`}>
                          {getStatusIcon(step)}
                        </div>
                        {index < statusSteps.length - 1 && (
                          <div className={`w-0.5 h-10 mt-2 ${isCompleted ? 'bg-primary' : 'bg-border'}`} />
                        )}
                      </div>
                      <div className="flex-1 pb-2">
                        <div className="flex items-center gap-2 mb-1">
                          <p className={`font-bold capitalize text-sm md:text-base ${
                            isCurrent ? 'text-primary font-black' : isCompleted ? 'text-foreground' : 'text-muted-foreground'
                          }`}>
                            {step === 'completed' ? 'Payment Confirmed' : step === 'processing' ? 'Order Received' : step}
                          </p>
                          {isCurrent && (
                            <Badge variant="outline" className="border-primary text-primary text-[10px] font-bold">
                              Current Progress
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {getStatusDescription(step)}
                        </p>
                        {isCompleted && order.updated_at && index === currentStepIndex && (
                          <p className="text-[11px] text-muted-foreground mt-1">
                            Updated: {new Date(order.updated_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Order Items & Delivery Summary Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Items Card */}
              <Card className="lg:col-span-2 p-6 bg-card border-border rounded-3xl">
                <h3 className="text-lg font-bold text-foreground mb-4">Ordered Products</h3>
                <div className="space-y-4">
                  {getItems(order.items).map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-4 pb-4 border-b border-border/60 last:border-0 last:pb-0">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-xl border border-border"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-bold text-sm text-foreground">{item.name}</h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {item.variant && <span className="capitalize">Variant: {item.variant}</span>}
                          {item.size && <span>• Size: {item.size}</span>}
                        </div>
                        <p className="text-xs font-semibold text-primary mt-1">
                          {formatPrice(item.price)} × {item.quantity}
                        </p>
                      </div>
                      <div className="text-right font-bold text-sm text-foreground">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Order Info & Delivery Details */}
              <div className="space-y-6">
                <Card className="p-6 bg-card border-border rounded-3xl space-y-3">
                  <h3 className="text-lg font-bold text-foreground">Delivery Information</h3>
                  <div className="text-xs space-y-1.5 text-foreground/80">
                    <p className="font-bold text-foreground">{order.delivery_address}</p>
                    <p>{order.delivery_city}, {order.delivery_state}</p>
                    <p className="pt-2 text-muted-foreground">Phone: {order.phone_number}</p>
                    {order.whatsapp_number && <p className="text-muted-foreground">WhatsApp: {order.whatsapp_number}</p>}
                  </div>
                </Card>

                <Card className="p-6 bg-card border-border rounded-3xl space-y-3">
                  <h3 className="text-lg font-bold text-foreground">Payment Breakdown</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span className="font-medium text-foreground">{formatPrice(order.subtotal || 0)}</span>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-medium">
                        <span>Discount</span>
                        <span>-{formatPrice(order.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-muted-foreground">
                      <span>Delivery Fee</span>
                      <span className="font-medium text-foreground">{formatPrice(order.delivery_fee || 0)}</span>
                    </div>
                    <div className="border-t border-border pt-2 flex justify-between font-extrabold text-sm text-foreground">
                      <span>Total Amount</span>
                      <span className="text-primary">{formatPrice(order.total || 0)}</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>

      {order && (
        <ReportIssueModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          order={order}
        />
      )}
    </div>
  );
};

export default OrderTracking;