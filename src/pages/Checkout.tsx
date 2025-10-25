import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const Checkout = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Checkout</h1>
      <Card className="p-8 max-w-2xl mx-auto text-center">
        <p className="text-lg text-muted-foreground mb-6">
          Checkout functionality will be enabled after setting up authentication and payment integration.
        </p>
        <Button asChild>
          <a href="/cart">Back to Cart</a>
        </Button>
      </Card>
    </div>
  );
};

export default Checkout;
