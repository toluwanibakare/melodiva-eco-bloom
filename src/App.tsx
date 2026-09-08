import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Contact from "./pages/Contact.tsx";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Affiliate from "./pages/Affiliate";
import AffiliateRules from "./pages/AffiliateRules";
import AffiliateDashboard from "./pages/AffiliateDashboard";
import OrderHistory from "./pages/OrderHistory";
import OrderTracking from "./pages/OrderTracking";
import NotFound from "./pages/NotFound";
import OrderSuccess from "./pages/OrderSuccess";
import Pricing from "./pages/Pricing";
import AdminPanel from "./pages/AdminPanel";
import Checklist from "./pages/Checklist";
import WhatsAppButton from "./components/ui/WhatsAppButton.tsx";

const queryClient = new QueryClient();

const MainLayout = () => {
  const location = useLocation();
  const isChecklistPage = location.pathname === "/checklist";

  return (
    <div className="flex flex-col min-h-screen">
      {!isChecklistPage && <Header />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/affiliate" element={<Affiliate />} />
          <Route path="/affiliate-rules" element={<AffiliateRules />} />
          <Route path="/affiliate-dashboard" element={<AffiliateDashboard />} />
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/order-tracking/:orderId" element={<OrderTracking />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/checklist" element={<Checklist />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isChecklistPage && <Footer />}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <MainLayout />
        {/* WhatsApp floating button appears on every page */}
        <WhatsAppButton />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
