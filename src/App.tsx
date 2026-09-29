import { useEffect } from "react";
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
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ReturnsPolicy from "./pages/ReturnsPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import ShippingInfo from "./pages/ShippingInfo";
import WhatsAppButton from "./components/ui/WhatsAppButton.tsx";
import LaunchPromoModal from "./components/LaunchPromoModal";

const queryClient = new QueryClient();

// ScrollToTop helper component to reset scroll position on route change
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [pathname, hash]);

  return null;
};

const MainLayout = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <main className="min-h-screen bg-background">
        <Routes>
          <Route path="/admin/*" element={<AdminPanel />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </main>
    );
  }

  const isChecklistPage = location.pathname === "/checklist";
  const isProductDetailPage = location.pathname.startsWith("/product/");
  const isAffiliatePage = location.pathname === "/affiliate";

  const hideFooterRoutes = [
    "/checklist",
    "/privacy-policy",
    "/privacy",
    "/returns",
    "/return-policy",
    "/terms-and-conditions",
    "/terms",
  ];
  const shouldHideFooter = hideFooterRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {!isChecklistPage && !isProductDetailPage && !isAffiliatePage && <Header />}
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
          <Route path="/order-tracking" element={<OrderTracking />} />
          <Route path="/order-tracking/:orderId" element={<OrderTracking />} />
          <Route path="/track-order" element={<OrderTracking />} />
          <Route path="/track" element={<OrderTracking />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/checklist" element={<Checklist />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/returns" element={<ReturnsPolicy />} />
          <Route path="/return-policy" element={<ReturnsPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/shipping" element={<ShippingInfo />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!shouldHideFooter && <Footer />}
      <WhatsAppButton />
      <LaunchPromoModal />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ScrollToTop />
        <MainLayout />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
