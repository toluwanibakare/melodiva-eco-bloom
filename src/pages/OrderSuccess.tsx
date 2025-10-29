import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <CheckCircle className="h-20 w-20 text-green-500 mb-6" />
      <h1 className="text-3xl font-bold mb-2">Order Successful!</h1>
      <p className="text-muted-foreground mb-8">
        Thank you for your purchase. Your order has been received and is being processed.
      </p>
      <Button onClick={() => navigate("/shop")}>Continue Shopping</Button>
    </div>
  );
};

export default OrderSuccess;
