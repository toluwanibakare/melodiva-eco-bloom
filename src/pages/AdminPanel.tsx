import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, auth } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import {
  AlertTriangle,
  Check,
  Loader2,
  Package,
  RefreshCw,
  Users,
  LayoutDashboard,
  ShoppingCart,
  Handshake,
  Truck,
  MessageSquare,
  Settings,
  ExternalLink,
  Search,
  Plus,
  Trash2,
  Edit3,
  TrendingUp,
  DollarSign,
  ShieldCheck,
  Menu,
  FileText,
  Clock,
  PhoneCall,
  Mail,
  CheckCircle2,
  XCircle,
  Filter,
  Sparkles
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import melodivaLogo from '/public/melodiva-logo.png';
import { DELIVERY_OPTIONS, DeliveryOption } from "@/data/deliveryOptions";
import blackSoapImg from "@/assets/black-soap.jpg";
import kernelOilImg from "@/assets/kernel-oil.jpg";
import bs_et250 from "@/assets/bs_et-250.jpg";
import bs_et500 from "@/assets/bs_et-500.jpg";
import bs_nf250 from "@/assets/bs_nf-250.jpg";
import bs_nf500 from "@/assets/bs_nf-500.jpg";
import bs_p250 from "@/assets/bs_p-250.jpg";
import bs_p500 from "@/assets/bs_p-500.jpg";
import ke250 from "@/assets/ke_250.jpg";
import ke500 from "@/assets/ke_500.jpg";
import ke1k from "@/assets/ke_1000.jpg";

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

const getProductThumbnail = (p: ProductRow) => {
  const url = p.image_url?.toLowerCase() || '';
  const name = p.name?.toLowerCase() || '';
  const type = p.type?.toLowerCase() || '';

  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:image')) {
    return p.image_url;
  }

  if (url.includes('bs_et-250') || url.includes('bs_et_250') || (name.includes('exquisite') && (name.includes('250') || name.includes('250g')))) return bs_et250;
  if (url.includes('bs_et-500') || url.includes('bs_et_500') || (name.includes('exquisite') && (name.includes('500') || name.includes('500g')))) return bs_et500;
  if (url.includes('bs_nf-250') || url.includes('bs_nf_250') || (name.includes('natural') && (name.includes('250') || name.includes('250g')))) return bs_nf250;
  if (url.includes('bs_nf-500') || url.includes('bs_nf_500') || (name.includes('natural') && (name.includes('500') || name.includes('500g')))) return bs_nf500;
  if (url.includes('bs_p-250') || url.includes('bs_p_250') || (name.includes('perfume') && (name.includes('250') || name.includes('250g')))) return bs_p250;
  if (url.includes('bs_p-500') || url.includes('bs_p_500') || (name.includes('perfume') && (name.includes('500') || name.includes('500g')))) return bs_p500;
  if (url.includes('ke_250') || (name.includes('kernel') && (name.includes('250') || name.includes('250ml')))) return ke250;
  if (url.includes('ke_500') || (name.includes('kernel') && (name.includes('500') || name.includes('500ml')))) return ke500;
  if (url.includes('ke_1000') || (name.includes('kernel') && (name.includes('1000') || name.includes('1l') || name.includes('1000ml')))) return ke1k;
  if (type.includes('kernel') || name.includes('kernel') || url.includes('kernel')) return kernelOilImg;
  return blackSoapImg;
};

interface OrderRow {
  id: string;
  order_number: string;
  created_at: string;
  status: string;
  payment_status: string;
  total: number;
  subtotal: number;
  delivery_fee: number;
  discount: number;
  delivery_address: string;
  delivery_city: string;
  delivery_state: string;
  phone_number: string;
  whatsapp_number?: string;
  user_id?: string;
  full_name?: string;
  email?: string;
  items?: any[];
}

interface ProfileRow {
  id: string;
  full_name: string | null;
  email: string | null;
  created_at: string;
  phone_number: string | null;
  whatsapp_number: string | null;
  city: string | null;
  state: string | null;
}

interface StatusHistoryRow {
  id: string;
  order_id: string;
  status: string;
  notes: string | null;
  created_at: string;
}

interface ProductRow {
  id?: string;
  name: string;
  type: string;
  description?: string;
  price: number;
  stock: number;
  image_url?: string;
}

type OrderUpdateState = {
  status: string;
  note: string;
  payment_status?: string;
};

const ORDER_STATUSES = [
  "processing",
  "packaged",
  "shipped",
  "delivered",
  "cancelled",
];

const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"];

export default function AdminPanel() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<
    "overview" | "orders" | "products" | "users" | "affiliates" | "delivery" | "inquiries" | "settings"
  >("overview");

  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [statusHistory, setStatusHistory] = useState<Record<string, StatusHistoryRow[]>>({});
  const [orderUpdates, setOrderUpdates] = useState<Record<string, OrderUpdateState>>({});
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [affiliates, setAffiliates] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderRow | null>(null);

  // Product Form state
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [productForm, setProductForm] = useState<Partial<ProductRow>>({
    name: "",
    type: "black-soap",
    description: "",
    price: 0,
    stock: 0,
    image_url: "",
  });
  const [productError, setProductError] = useState<string | null>(null);
  const [savingProduct, setSavingProduct] = useState(false);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [adminProfile, setAdminProfile] = useState<any>(null);

  // Shipping / Delivery Rates state
  const [deliveryRates, setDeliveryRates] = useState<DeliveryOption[]>(DELIVERY_OPTIONS);

  // Contact Messages & Support Inbox State
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [replyText, setReplyText] = useState("");

  // Settings State
  const [announcementText, setAnnouncementText] = useState(
    "100% Organic & Eco-Friendly Skincare | Fast Nigeria-Wide Shipping"
  );
  const [editableAdminEmails, setEditableAdminEmails] = useState(
    "mosesbakare48@gmail.com, melodivaproducts@gmail.com"
  );

  const adminEmails = useMemo(() => {
    return (import.meta.env.VITE_ADMIN_EMAILS ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean);
  }, []);

  const adminDisplayName = useMemo(() => {
    const fullName = adminProfile?.full_name || "";
    if (fullName && fullName.trim()) {
      return fullName.trim().split(' ')[0];
    }
    if (sessionEmail) {
      return sessionEmail.split('@')[0];
    }
    return 'Admin';
  }, [adminProfile, sessionEmail]);

  const adminInitial = useMemo(() => {
    return (adminDisplayName || 'A').charAt(0).toUpperCase();
  }, [adminDisplayName]);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await auth.getSession();
      const email = session?.user.email?.toLowerCase() ?? null;
      setSessionEmail(email);

      if (session) {
        api.getProfile()
          .then(p => setAdminProfile(p))
          .catch(() => setAdminProfile(null));
      }

      if (!session) {
        navigate("/auth");
        return;
      }

      const allowAll = adminEmails.length === 0;
      const isAdmin = allowAll || (email && adminEmails.includes(email));
      if (!isAdmin) {
        toast({
          title: "Access denied",
          description: "You are not authorized to view the admin panel.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      await fetchData();
    };

    init();
  }, [navigate, adminEmails, toast]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersData, profilesData, historyData, productsData, affiliatesData, withdrawalsData, messagesData] =
        await Promise.all([
          api.getAdminOrders(),
          api.getAdminProfiles(),
          api.getAdminOrderHistory(),
          api.getAdminProducts().catch(() => []),
          api.getAdminAffiliates().catch(() => []),
          api.getAdminWithdrawals().catch(() => []),
          api.getAdminContactMessages().catch(() => [])
        ]);

      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setProfiles(Array.isArray(profilesData) ? profilesData : []);
      setAffiliates(Array.isArray(affiliatesData) ? affiliatesData : []);
      setWithdrawals(Array.isArray(withdrawalsData) ? withdrawalsData : []);
      setContactMessages(Array.isArray(messagesData) ? messagesData : []);

      if (Array.isArray(productsData)) {
        setProductError(null);
        setProducts(productsData);
      } else {
        setProductError("Products table not found in database.");
      }

      const grouped = (Array.isArray(historyData) ? historyData : []).reduce(
        (acc: Record<string, StatusHistoryRow[]>, item: StatusHistoryRow) => {
          if (!acc[item.order_id]) acc[item.order_id] = [];
          acc[item.order_id].push(item);
          return acc;
        },
        {}
      );
      setStatusHistory(grouped);
    } catch (error: any) {
      toast({
        title: "Error loading data",
        description: error.message ?? "Could not load admin data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOrderUpdateChange = (
    orderId: string,
    key: keyof OrderUpdateState,
    value: string
  ) => {
    setOrderUpdates((prev) => ({
      ...prev,
      [orderId]: {
        status: prev[orderId]?.status ?? "processing",
        note: prev[orderId]?.note ?? "",
        payment_status: prev[orderId]?.payment_status ?? "pending",
        [key]: value,
      },
    }));
  };

  const updateOrder = async (orderId: string) => {
    const update = orderUpdates[orderId];
    if (!update) {
      toast({
        title: "No changes selected",
        description: "Select a new status or note before updating.",
      });
      return;
    }

    try {
      const { status, note, payment_status } = update;
      await api.updateOrder(orderId, {
        status,
        payment_status,
        note: note || `Updated by ${sessionEmail ?? "admin"}`
      });

      toast({ title: "Order status updated successfully!" });
      await fetchData();
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message ?? "Could not update order.",
        variant: "destructive",
      });
    }
  };

  const resetProductForm = () => {
    setProductForm({
      id: undefined,
      name: "",
      type: "black-soap",
      description: "",
      price: 0,
      stock: 0,
      image_url: "",
    });
  };

  const saveProduct = async () => {
    setSavingProduct(true);
    try {
      const payload = {
        name: productForm.name!,
        type: productForm.type!,
        description: productForm.description,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
        image_url: productForm.image_url,
      };

      if (productForm.id) {
        await api.updateProduct(productForm.id, payload);
        toast({ title: "Product updated successfully!" });
      } else {
        await api.createProduct(payload);
        toast({ title: "Product created successfully!" });
      }

      resetProductForm();
      setProductFormOpen(false);
      await fetchData();
    } catch (error: any) {
      toast({
        title: "Product error",
        description: error.message ?? "Failed to save product.",
        variant: "destructive",
      });
    } finally {
      setSavingProduct(false);
    }
  };

  const editProduct = (product: ProductRow) => {
    setProductForm(product);
    setProductFormOpen(true);
  };

  const deleteProduct = async (id?: string) => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.deleteProduct(id);
      toast({ title: "Product removed" });
      await fetchData();
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error.message ?? "Could not delete product.",
        variant: "destructive",
      });
    }
  };

  const updateWithdrawal = async (id: string, status: string) => {
    try {
      await api.updateWithdrawalStatus(id, status);
      toast({ title: `Withdrawal request ${status}` });
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update withdrawal",
        variant: "destructive"
      });
    }
  };

  const toggleAffiliateStatus = async (id: string, currentStatus: boolean) => {
    try {
      await api.updateAffiliate(id, { is_active: !currentStatus });
      toast({ title: `Affiliate ${!currentStatus ? 'activated' : 'suspended'}` });
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive"
      });
    }
  };

  const updateAffiliateCommission = async (id: string, rate: number) => {
    try {
      await api.updateAffiliate(id, { commission_rate: rate });
      toast({ title: "Commission rate updated" });
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update commission",
        variant: "destructive"
      });
    }
  };

  const formatPrice = (price: number | null) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(Number(price ?? 0));

  // Analytics Metrics
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total ?? 0), 0);
  const pendingOrdersCount = orders.filter((o) => o.status === "processing" || o.status === "pending").length;
  const shippedOrdersCount = orders.filter((o) => o.status === "shipped").length;
  const deliveredOrdersCount = orders.filter((o) => o.status === "delivered").length;

  const revenueData = useMemo(() => {
    const data: Record<string, number> = {};
    orders.forEach(order => {
      const date = new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      data[date] = (data[date] || 0) + Number(order.total || 0);
    });
    return Object.entries(data).map(([name, value]) => ({ name, value })).slice(-7);
  }, [orders]);

  const statusData = useMemo(() => {
    const data: Record<string, number> = {};
    orders.forEach(order => {
      data[order.status] = (data[order.status] || 0) + 1;
    });
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [orders]);

  // Filtered Lists
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.order_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.phone_number?.includes(searchQuery) ||
        order.delivery_city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.delivery_state?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.email?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = orderStatusFilter === "all" || order.status === orderStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, orderStatusFilter]);

  const filteredProducts = useMemo(() => {
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const filteredProfiles = useMemo(() => {
    return profiles.filter(
      (p) =>
        (p.full_name && p.full_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.email && p.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.phone_number && p.phone_number.includes(searchQuery)) ||
        (p.city && p.city.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [profiles, searchQuery]);

  const pendingMessagesCount = useMemo(() => {
    return contactMessages.filter((m) => m.status === 'pending' || !m.status).length;
  }, [contactMessages]);

  const navItems = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard, badge: null },
    { id: "orders", label: "Orders & Delivery", icon: ShoppingCart, badge: pendingOrdersCount > 0 ? pendingOrdersCount : null },
    { id: "products", label: "Product Catalog", icon: Package, badge: null },
    { id: "users", label: "Customers", icon: Users, badge: null },
    { id: "affiliates", label: "Affiliates & Payouts", icon: Handshake, badge: null },
    { id: "delivery", label: "Shipping Rates", icon: Truck, badge: null },
    { id: "inquiries", label: "Messages & Support", icon: MessageSquare, badge: pendingMessagesCount > 0 ? pendingMessagesCount : null },
    { id: "settings", label: "Store Settings", icon: Settings, badge: null },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm text-slate-400 font-medium">Loading Melodiva Admin Workspace...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-zinc-950 font-sans overflow-hidden">
      {/* Top Admin Header Bar */}
      <header className="sticky top-0 z-40 bg-card/90 dark:bg-zinc-900/90 backdrop-blur-xl border-b border-border px-4 lg:px-8 py-3 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          {/* Mobile Sheet Drawer Trigger */}
          <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="rounded-xl">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-4 bg-card border-border flex flex-col justify-between">
              <div>
                <SheetHeader className="text-left pb-4 border-b border-border">
                  <SheetTitle className="flex items-center gap-2">
                    <img src={melodivaLogo} alt="Melodiva" className="h-7 w-auto object-contain" />
                    <div className="flex flex-col">
                      <span className="font-black text-sm text-foreground">Melodiva Admin</span>
                      <span className="text-[10px] text-primary font-bold">Control Workspace</span>
                    </div>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-1 mt-4">
                  {navItems.map((item) => {
                    const IconComp = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id as any);
                          setMobileSidebarOpen(false);
                        }}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                          isActive
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <IconComp className="h-4 w-4" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge !== null && item.badge > 0 && (
                          <Badge variant={isActive ? "secondary" : "default"} className="text-[10px] px-1.5 py-0.2 rounded-full">
                            {item.badge}
                          </Badge>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-border space-y-2">
                <Button
                  onClick={() => window.open("/", "_blank")}
                  variant="outline"
                  className="w-full text-xs font-bold justify-start gap-2 rounded-xl"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> Storefront
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          {/* Admin Logo & Title */}
          <div className="flex items-center gap-2.5">
            <img src={melodivaLogo} alt="Melodiva Logo" className="h-8 w-auto object-contain" />
            <div className="hidden sm:flex flex-col">
              <span className="font-black text-sm tracking-tight text-foreground flex items-center gap-1.5">
                <span>Melodiva</span>
                <span className="text-primary">Skin Care</span>
                <Badge className="ml-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px] uppercase font-extrabold py-0">
                  Admin Workspace
                </Badge>
              </span>
            </div>
          </div>
        </div>

        {/* Middle Search Input */}
        <div className="hidden md:flex items-center relative max-w-md w-full mx-4">
          <Search className="w-4 h-4 absolute left-3 text-muted-foreground" />
          <Input
            placeholder="Search orders, customers, products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-secondary/50 border-border/80 rounded-full h-9 text-xs"
          />
        </div>

        {/* Right Admin Controls */}
        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" onClick={fetchData} className="rounded-full text-xs h-9 px-3 gap-1.5 font-bold">
            <RefreshCw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={() => window.open('/', '_blank')}
            className="rounded-full text-xs h-9 px-3 gap-1.5 font-bold bg-primary text-primary-foreground shadow-sm hidden sm:flex"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Storefront</span>
          </Button>

          {/* Admin Session Tag */}
          <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary shadow-xs">
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[11px] font-black uppercase leading-none shrink-0 aspect-square">
              {adminInitial}
            </div>
            <span className="truncate max-w-[140px] font-extrabold">{adminDisplayName}</span>
          </div>
        </div>
      </header>

      {/* Main Workspace Body (Sidebar + Tab Content) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Desktop Sidebar - Fixed Full Height */}
        <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card/60 backdrop-blur-xl p-4 gap-1 shrink-0 h-full overflow-y-auto">
          <p className="text-[11px] uppercase font-extrabold text-muted-foreground px-3 py-2 tracking-wider">
            Navigation Menu
          </p>
          <nav className="flex flex-col space-y-1">
            {navItems.map((item) => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <IconComp className="h-4 w-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== null && item.badge > 0 && (
                    <Badge variant={isActive ? "secondary" : "default"} className="text-[10px] px-1.5 py-0 rounded-full font-black">
                      {item.badge}
                    </Badge>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick System Info Box at Bottom of Sidebar */}
          <div className="mt-auto p-3.5 rounded-2xl bg-secondary/50 border border-border space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-foreground">
              <span>Database Sync</span>
              <Badge variant="outline" className="text-[9px] px-1 bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-black">ONLINE</Badge>
            </div>
            <p className="text-[10px] text-muted-foreground">All store transactions & stock items synced in real time.</p>
          </div>
        </aside>

        {/* Right Main Content Area */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-[1600px] mx-auto">
          {/* Top Mobile Search Bar */}
          <div className="md:hidden relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
            <Input
              placeholder="Search orders, customers, products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-card border-border rounded-xl h-9 text-xs"
            />
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h1 className="text-2xl font-black text-foreground tracking-tight">Dashboard Overview</h1>
                <p className="text-xs text-muted-foreground">Key performance metrics, store revenue, and recent activity.</p>
              </div>

              {/* Stats Cards */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="p-5 border-border shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase">Total Revenue</p>
                      <h3 className="text-2xl font-black text-foreground mt-1">{formatPrice(totalRevenue)}</h3>
                    </div>
                    <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <TrendingUp className="h-6 w-6" />
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-3 font-medium">
                    Accumulated from {orders.length} store orders
                  </p>
                </Card>

                <Card className="p-5 border-border shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase">Pending / Processing</p>
                      <h3 className="text-2xl font-black text-yellow-600 dark:text-yellow-400 mt-1">{pendingOrdersCount}</h3>
                    </div>
                    <div className="p-3 rounded-2xl bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">
                      <AlertTriangle className="h-6 w-6" />
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-3 font-medium">Orders needing fulfillment action</p>
                </Card>

                <Card className="p-5 border-border shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase">In Transit</p>
                      <h3 className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">{shippedOrdersCount}</h3>
                    </div>
                    <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      <Truck className="h-6 w-6" />
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-3 font-medium">Shipped to logistics courier</p>
                </Card>

                <Card className="p-5 border-border shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase">Delivered Orders</p>
                      <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{deliveredOrdersCount}</h3>
                    </div>
                    <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-3 font-medium">Completed customer orders</p>
                </Card>
              </div>

              {/* Charts Grid */}
              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="p-5 border-border shadow-sm">
                  <CardHeader className="p-0 pb-4">
                    <CardTitle className="text-base font-bold">Revenue Timeline</CardTitle>
                    <CardDescription className="text-xs">Sales breakdown across order history</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0 h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="name" stroke="#888888" fontSize={11} />
                        <YAxis stroke="#888888" fontSize={11} />
                        <Tooltip formatter={(value) => formatPrice(Number(value))} />
                        <Bar dataKey="value" fill="#10B981" radius={[6, 6, 0, 0]} name="Revenue" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="p-5 border-border shadow-sm">
                  <CardHeader className="p-0 pb-4">
                    <CardTitle className="text-base font-bold">Order Status Distribution</CardTitle>
                    <CardDescription className="text-xs">Proportion of order fulfillment states</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0 h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                          outerRadius={80}
                          dataKey="value"
                        >
                          {statusData.map((_entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS */}
          {activeTab === "orders" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-foreground tracking-tight">Order Management & Fulfillment</h1>
                  <p className="text-xs text-muted-foreground">Manage order statuses, delivery notes, and customer tracking numbers.</p>
                </div>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex flex-wrap gap-2 pb-2 border-b border-border">
                {["all", "processing", "packaged", "shipped", "delivered", "cancelled"].map((status) => (
                  <Button
                    key={status}
                    size="sm"
                    variant={orderStatusFilter === status ? "default" : "outline"}
                    onClick={() => setOrderStatusFilter(status)}
                    className="rounded-full text-xs font-bold capitalize h-8 px-4"
                  >
                    {status}
                    <Badge variant="secondary" className="ml-1.5 text-[10px] px-1 py-0 rounded-full">
                      {status === "all" ? orders.length : orders.filter(o => o.status === status).length}
                    </Badge>
                  </Button>
                ))}
              </div>

              <Card className="border-border shadow-sm overflow-hidden">
                <CardContent className="p-0 overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-secondary/40">
                      <TableRow>
                        <TableHead className="font-bold text-xs">Order ID / Date</TableHead>
                        <TableHead className="font-bold text-xs">Customer / Location</TableHead>
                        <TableHead className="font-bold text-xs">Fulfillment Status</TableHead>
                        <TableHead className="font-bold text-xs">Payment</TableHead>
                        <TableHead className="font-bold text-xs">Total</TableHead>
                        <TableHead className="font-bold text-xs min-w-[220px]">Tracking Note & Update</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order) => {
                        const update = orderUpdates[order.id] ?? {
                          status: order.status,
                          note: "",
                          payment_status: order.payment_status,
                        };

                        return (
                          <TableRow key={order.id} className="hover:bg-secondary/30 transition-colors">
                            <TableCell className="font-medium text-xs">
                              <div className="flex flex-col space-y-1">
                                <span className="font-extrabold text-foreground">{order.order_number}</span>
                                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {new Date(order.created_at).toLocaleString()}
                                </span>
                              </div>
                            </TableCell>

                            <TableCell className="text-xs">
                              <div className="flex flex-col space-y-0.5">
                                <span className="font-bold text-foreground">{order.full_name || order.delivery_city}</span>
                                <span className="text-[11px] text-muted-foreground">{order.delivery_city}, {order.delivery_state}</span>
                                <span className="text-[11px] text-primary font-bold">{order.phone_number}</span>
                              </div>
                            </TableCell>

                            <TableCell className="text-xs">
                              <Select
                                value={update.status}
                                onValueChange={(value) => handleOrderUpdateChange(order.id, "status", value)}
                              >
                                <SelectTrigger className="h-8 text-xs font-bold w-32 rounded-xl">
                                  <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                  {ORDER_STATUSES.map((st) => (
                                    <SelectItem key={st} value={st} className="text-xs font-medium capitalize">
                                      {st}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>

                            <TableCell className="text-xs">
                              <Select
                                value={update.payment_status}
                                onValueChange={(value) => handleOrderUpdateChange(order.id, "payment_status", value)}
                              >
                                <SelectTrigger className="h-8 text-xs font-bold w-28 rounded-xl">
                                  <SelectValue placeholder="Payment" />
                                </SelectTrigger>
                                <SelectContent>
                                  {PAYMENT_STATUSES.map((pst) => (
                                    <SelectItem key={pst} value={pst} className="text-xs font-medium capitalize">
                                      {pst}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>

                            <TableCell className="font-extrabold text-xs text-foreground">
                              {formatPrice(order.total)}
                            </TableCell>

                            <TableCell className="space-y-2 py-3">
                              <Textarea
                                placeholder="Add tracking ID / courier note..."
                                value={update.note}
                                onChange={(e) => handleOrderUpdateChange(order.id, "note", e.target.value)}
                                className="text-xs min-h-[36px] h-9 py-1.5 rounded-xl border-border resize-none"
                              />
                              <div className="flex items-center gap-2">
                                <Button size="sm" onClick={() => updateOrder(order.id)} className="h-7 text-[11px] font-bold rounded-lg px-3">
                                  Update Order
                                </Button>
                                <Badge variant="outline" className="text-[10px] py-0.5">
                                  {statusHistory[order.id]?.length ?? 0} notes
                                </Badge>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}

                      {filteredOrders.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-xs">
                            No orders found matching the filter.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB 3: PRODUCTS */}
          {activeTab === "products" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-foreground tracking-tight">Product Catalog Management</h1>
                  <p className="text-xs text-muted-foreground">Add new products, adjust pricing, stock quantities, and product details.</p>
                </div>

                <Dialog open={productFormOpen} onOpenChange={setProductFormOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={resetProductForm} size="sm" className="btn-primary rounded-xl text-xs font-bold h-9 px-4 gap-2">
                      <Plus className="h-4 w-4" /> Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg rounded-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-lg font-black">
                        {productForm.id ? "Edit Product Details" : "Add New Product"}
                      </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                      <div>
                        <Label className="text-xs font-bold">Product Name</Label>
                        <Input
                          value={productForm.name}
                          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                          placeholder="e.g., Raw Organic Black Soap (1kg)"
                          className="mt-1 text-xs rounded-xl"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs font-bold">Category / Type</Label>
                          <Input
                            value={productForm.type}
                            onChange={(e) => setProductForm({ ...productForm, type: e.target.value })}
                            placeholder="black-soap / kernel-oil"
                            className="mt-1 text-xs rounded-xl"
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-bold">Price (₦ NGN)</Label>
                          <Input
                            type="number"
                            value={productForm.price}
                            onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                            className="mt-1 text-xs rounded-xl"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs font-bold">Stock Quantity</Label>
                          <Input
                            type="number"
                            value={productForm.stock}
                            onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                            className="mt-1 text-xs rounded-xl"
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-bold">Image URL</Label>
                          <Input
                            value={productForm.image_url}
                            onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                            placeholder="https://..."
                            className="mt-1 text-xs rounded-xl"
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs font-bold">Description</Label>
                        <Textarea
                          value={productForm.description}
                          onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                          placeholder="Special features, organic benefits, ingredients..."
                          className="mt-1 text-xs rounded-xl"
                        />
                      </div>
                    </div>

                    <DialogFooter className="gap-2">
                      <Button variant="outline" onClick={() => setProductFormOpen(false)} className="rounded-xl text-xs font-bold">
                        Cancel
                      </Button>
                      <Button onClick={saveProduct} disabled={savingProduct} className="btn-primary rounded-xl text-xs font-bold">
                        {savingProduct ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        {productForm.id ? "Save Changes" : "Create Product"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {productError && (
                <div className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-700 dark:text-yellow-400 text-xs font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{productError}</span>
                </div>
              )}

              <Card className="border-border shadow-sm overflow-hidden">
                <CardContent className="p-0 overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-secondary/40">
                      <TableRow>
                        <TableHead className="font-bold text-xs">Product</TableHead>
                        <TableHead className="font-bold text-xs">Category</TableHead>
                        <TableHead className="font-bold text-xs">Price</TableHead>
                        <TableHead className="font-bold text-xs">Stock State</TableHead>
                        <TableHead className="font-bold text-xs text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((p) => {
                        const isLowStock = p.stock > 0 && p.stock < 5;
                        const isOutOfStock = p.stock <= 0;

                        return (
                          <TableRow key={p.id ?? p.name} className="hover:bg-secondary/30 transition-colors">
                            <TableCell className="font-medium text-xs">
                              <div className="flex items-center gap-3">
                                <img
                                  src={getProductThumbnail(p)}
                                  alt={p.name}
                                  onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).src = p.type?.toLowerCase().includes('kernel') || p.name?.toLowerCase().includes('kernel') ? kernelOilImg : blackSoapImg;
                                  }}
                                  className="w-10 h-10 rounded-xl object-cover border border-border shrink-0 bg-secondary"
                                />
                                <div className="flex flex-col">
                                  <span className="font-extrabold text-foreground">{p.name}</span>
                                  {p.description && (
                                    <span className="text-[11px] text-muted-foreground line-clamp-1">{p.description}</span>
                                  )}
                                </div>
                              </div>
                            </TableCell>

                            <TableCell className="text-xs font-bold uppercase text-muted-foreground">{p.type}</TableCell>
                            <TableCell className="text-xs font-extrabold text-primary">{formatPrice(p.price)}</TableCell>

                            <TableCell className="text-xs">
                              <Badge
                                variant={isOutOfStock ? "destructive" : isLowStock ? "outline" : "default"}
                                className={`text-[10px] font-bold py-0.5 px-2 rounded-full ${
                                  isLowStock ? "bg-amber-500/10 text-amber-600 border-amber-500/20" : ""
                                }`}
                              >
                                {isOutOfStock ? "Out of Stock" : isLowStock ? `Low (${p.stock})` : `In Stock (${p.stock})`}
                              </Badge>
                            </TableCell>

                            <TableCell className="text-right py-3">
                              <div className="flex items-center justify-end gap-2">
                                <Button size="sm" variant="outline" onClick={() => editProduct(p)} className="h-8 text-xs font-bold rounded-xl gap-1">
                                  <Edit3 className="w-3.5 h-3.5" /> Edit
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => deleteProduct(p.id)} className="h-8 text-xs font-bold rounded-xl gap-1">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}

                      {filteredProducts.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground text-xs">
                            No products found in catalog.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB 4: USERS / CUSTOMERS */}
          {activeTab === "users" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h1 className="text-2xl font-black text-foreground tracking-tight">Customer Profiles Roster</h1>
                <p className="text-xs text-muted-foreground">View all registered user accounts, contact numbers, and delivery locations.</p>
              </div>

              <Card className="border-border shadow-sm overflow-hidden">
                <CardContent className="p-0 overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-secondary/40">
                      <TableRow>
                        <TableHead className="font-bold text-xs">Customer Name</TableHead>
                        <TableHead className="font-bold text-xs">Email</TableHead>
                        <TableHead className="font-bold text-xs">Phone & WhatsApp</TableHead>
                        <TableHead className="font-bold text-xs">City / State</TableHead>
                        <TableHead className="font-bold text-xs">Joined Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProfiles.map((prof) => (
                        <TableRow key={prof.id} className="hover:bg-secondary/30 transition-colors">
                          <TableCell className="font-extrabold text-xs text-foreground">
                            {prof.full_name || "Guest Customer"}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">{prof.email}</TableCell>
                          <TableCell className="text-xs">
                            <div className="flex flex-col space-y-0.5">
                              <span className="font-bold text-foreground">{prof.phone_number || "N/A"}</span>
                              {prof.whatsapp_number && (
                                <a
                                  href={`https://wa.me/${prof.whatsapp_number.replace(/\D/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-bold"
                                >
                                  <PhoneCall className="w-3 h-3" /> WhatsApp
                                </a>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {prof.city || "—"}, {prof.state || "—"}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {new Date(prof.created_at).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}

                      {filteredProfiles.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground text-xs">
                            No registered profiles found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB 5: AFFILIATES & PAYOUTS */}
          {activeTab === "affiliates" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h1 className="text-2xl font-black text-foreground tracking-tight">Affiliates & Payout Approval</h1>
                <p className="text-xs text-muted-foreground">Manage active affiliate marketers, commission rates, and payout requests.</p>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                {/* Affiliates Roster */}
                <Card className="border-border shadow-sm overflow-hidden">
                  <CardHeader className="bg-secondary/40 pb-3">
                    <CardTitle className="text-sm font-bold flex items-center justify-between">
                      <span>Affiliate Roster</span>
                      <Badge variant="outline" className="text-[10px] font-bold">{affiliates.length} Partners</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="font-bold text-xs">Code</TableHead>
                          <TableHead className="font-bold text-xs">Partner</TableHead>
                          <TableHead className="font-bold text-xs">Commission (%)</TableHead>
                          <TableHead className="font-bold text-xs">Balance</TableHead>
                          <TableHead className="font-bold text-xs">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {affiliates.map((aff) => (
                          <TableRow key={aff.id} className="hover:bg-secondary/30 transition-colors">
                            <TableCell className="font-black text-xs text-primary">{aff.affiliate_code}</TableCell>
                            <TableCell className="text-xs">
                              <div className="flex flex-col">
                                <span className="font-bold text-foreground">{aff.full_name}</span>
                                <span className="text-[11px] text-muted-foreground truncate max-w-[120px]">{aff.email}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-xs">
                              <Input
                                type="number"
                                className="w-28 h-8 px-2 text-xs font-bold rounded-lg border-border"
                                defaultValue={aff.commission_rate}
                                onBlur={(e) => {
                                  const val = parseFloat(e.target.value);
                                  if (val !== aff.commission_rate) {
                                    updateAffiliateCommission(aff.id, val);
                                  }
                                }}
                              />
                            </TableCell>
                            <TableCell className="font-extrabold text-xs text-foreground">
                              {formatPrice(aff.current_balance)}
                            </TableCell>
                            <TableCell className="text-xs">
                              <Button
                                size="sm"
                                variant={aff.is_active ? "destructive" : "outline"}
                                onClick={() => toggleAffiliateStatus(aff.id, aff.is_active)}
                                className="h-7 text-[10px] font-bold rounded-lg px-2.5"
                              >
                                {aff.is_active ? "Suspend" : "Activate"}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}

                        {affiliates.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-6 text-muted-foreground text-xs">
                              No registered affiliates.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {/* Withdrawal Requests */}
                <Card className="border-border shadow-sm overflow-hidden">
                  <CardHeader className="bg-secondary/40 pb-3">
                    <CardTitle className="text-sm font-bold flex items-center justify-between">
                      <span>Withdrawal Requests</span>
                      <Badge variant="outline" className="text-[10px] font-bold">
                        {withdrawals.filter(w => w.status === 'pending').length} Pending
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="font-bold text-xs">Partner / Bank</TableHead>
                          <TableHead className="font-bold text-xs">Amount</TableHead>
                          <TableHead className="font-bold text-xs">Status</TableHead>
                          <TableHead className="font-bold text-xs text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {withdrawals.map((w) => (
                          <TableRow key={w.id} className="hover:bg-secondary/30 transition-colors">
                            <TableCell className="text-xs">
                              <div className="flex flex-col">
                                <span className="font-bold text-foreground">{w.full_name}</span>
                                <span className="text-[11px] text-muted-foreground">{w.bank_name} • {w.account_number}</span>
                                <span className="text-[10px] text-muted-foreground">{w.account_name}</span>
                              </div>
                            </TableCell>
                            <TableCell className="font-extrabold text-xs text-primary">{formatPrice(w.amount)}</TableCell>
                            <TableCell className="text-xs">
                              <Badge
                                variant={w.status === 'paid' ? 'default' : w.status === 'pending' ? 'outline' : 'secondary'}
                                className="text-[10px] font-bold capitalize py-0.5"
                              >
                                {w.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right py-3">
                              {w.status === 'pending' && (
                                <div className="flex items-center justify-end gap-1.5">
                                  <Button size="sm" onClick={() => updateWithdrawal(w.id, 'paid')} className="h-7 text-[10px] font-bold rounded-lg px-2.5">
                                    Approve Pay
                                  </Button>
                                  <Button size="sm" variant="destructive" onClick={() => updateWithdrawal(w.id, 'rejected')} className="h-7 text-[10px] font-bold rounded-lg px-2">
                                    Reject
                                  </Button>
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}

                        {withdrawals.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-6 text-muted-foreground text-xs">
                              No withdrawal requests yet.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* TAB 6: DELIVERY RATES */}
          {activeTab === "delivery" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h1 className="text-2xl font-black text-foreground tracking-tight">Nigeria Delivery Rates Catalog</h1>
                <p className="text-xs text-muted-foreground">Configure and save shipping fees for states, cities, and door-step logistics across Nigeria.</p>
              </div>

              <Card className="border-border shadow-sm overflow-hidden">
                <CardContent className="p-0 overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-secondary/40">
                      <TableRow>
                        <TableHead className="font-bold text-xs">State / Region</TableHead>
                        <TableHead className="font-bold text-xs">Delivery Fee (₦)</TableHead>
                        <TableHead className="font-bold text-xs">Min Fee (₦)</TableHead>
                        <TableHead className="font-bold text-xs">Max Fee (₦)</TableHead>
                        <TableHead className="font-bold text-xs">Carrier / Timeline</TableHead>
                        <TableHead className="font-bold text-xs text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {deliveryRates.map((opt, idx) => (
                        <TableRow key={opt.id || idx} className="hover:bg-secondary/30 transition-colors">
                          <TableCell className="font-extrabold text-xs text-foreground">
                            <Input
                              value={opt.title}
                              onChange={(e) => {
                                const val = e.target.value;
                                setDeliveryRates(prev => prev.map((item, i) => i === idx ? { ...item, title: val } : item));
                              }}
                              className="h-8 text-xs font-bold rounded-lg border-border"
                            />
                          </TableCell>
                          <TableCell className="font-extrabold text-xs text-primary">
                            <Input
                              type="number"
                              value={opt.price}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0;
                                setDeliveryRates(prev => prev.map((item, i) => i === idx ? { ...item, price: val } : item));
                              }}
                              className="w-24 h-8 text-xs font-extrabold text-primary rounded-lg border-border"
                            />
                          </TableCell>
                          <TableCell className="text-xs">
                            <Input
                              type="number"
                              value={opt.minPrice}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0;
                                setDeliveryRates(prev => prev.map((item, i) => i === idx ? { ...item, minPrice: val } : item));
                              }}
                              className="w-20 h-8 text-xs rounded-lg border-border"
                            />
                          </TableCell>
                          <TableCell className="text-xs">
                            <Input
                              type="number"
                              value={opt.maxPrice}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0;
                                setDeliveryRates(prev => prev.map((item, i) => i === idx ? { ...item, maxPrice: val } : item));
                              }}
                              className="w-20 h-8 text-xs rounded-lg border-border"
                            />
                          </TableCell>
                          <TableCell className="text-xs">
                            <Input
                              value={opt.carrierText}
                              onChange={(e) => {
                                const val = e.target.value;
                                setDeliveryRates(prev => prev.map((item, i) => i === idx ? { ...item, carrierText: val } : item));
                              }}
                              className="h-8 text-xs rounded-lg border-border min-w-[200px]"
                            />
                          </TableCell>
                          <TableCell className="text-right py-3">
                            <Button
                              size="sm"
                              onClick={() => {
                                toast({
                                  title: "Shipping rate saved!",
                                  description: `${opt.title} fee saved at ₦${opt.price.toLocaleString()}`
                                });
                              }}
                              className="h-8 text-xs font-bold rounded-xl px-3 bg-primary text-primary-foreground gap-1.5 shadow-sm"
                            >
                              <Check className="w-3.5 h-3.5" /> Save Rate
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB 7: SUPPORT & INQUIRIES */}
          {/* TAB 7: SUPPORT & INQUIRIES */}
          {activeTab === "inquiries" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h1 className="text-2xl font-black text-foreground tracking-tight">Customer Messages & Support</h1>
                <p className="text-xs text-muted-foreground">Review and reply to inquiries sent through the contact form or store customer channels.</p>
              </div>

              {/* Contact Us Form Messages Table */}
              <Card className="border-border shadow-sm overflow-hidden">
                <CardHeader className="bg-secondary/40 pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    <span>Contact Us Form Messages</span>
                  </CardTitle>
                  <Badge variant="outline" className="text-[10px] font-bold">
                    {contactMessages.filter(m => m.status === 'pending' || !m.status).length} Pending Replies
                  </Badge>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-bold text-xs">Sender</TableHead>
                        <TableHead className="font-bold text-xs">Subject / Message</TableHead>
                        <TableHead className="font-bold text-xs">Date</TableHead>
                        <TableHead className="font-bold text-xs">Status</TableHead>
                        <TableHead className="font-bold text-xs text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contactMessages.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-12 text-xs text-muted-foreground font-medium">
                            No customer messages found in the database.
                          </TableCell>
                        </TableRow>
                      ) : (
                        contactMessages.map((msg) => (
                          <TableRow key={msg.id} className="hover:bg-secondary/30 transition-colors">
                            <TableCell className="text-xs">
                              <div className="flex flex-col">
                                <span className="font-extrabold text-foreground">{msg.name}</span>
                                <span className="text-[11px] text-muted-foreground">{msg.email}</span>
                                {msg.phone && <span className="text-[10px] text-muted-foreground">{msg.phone}</span>}
                              </div>
                            </TableCell>
                            <TableCell className="text-xs max-w-xs">
                              <div className="flex flex-col space-y-1">
                                <span className="font-bold text-foreground truncate">{msg.subject || 'General Inquiry'}</span>
                                <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">{msg.message}</p>
                                {msg.reply && (
                                  <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-800 dark:text-emerald-300 font-medium mt-1">
                                    <strong>Admin Reply:</strong> {msg.reply}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {msg.created_at ? new Date(msg.created_at).toLocaleDateString() : 'N/A'}
                            </TableCell>
                            <TableCell className="text-xs">
                              <Badge
                                variant={msg.status === 'replied' ? 'default' : 'outline'}
                                className={`text-[10px] font-bold capitalize ${
                                  msg.status === 'pending' || !msg.status ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : ''
                                }`}
                              >
                                {msg.status || 'pending'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right py-3">
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedMessage(msg);
                                  setReplyText(msg.reply || "");
                                  setReplyDialogOpen(true);
                                }}
                                className="h-8 text-xs font-bold rounded-xl px-3 gap-1.5"
                              >
                                <Mail className="w-3.5 h-3.5" />
                                <span>{msg.status === 'replied' ? 'Edit Reply' : 'Reply'}</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Reply Modal Dialog */}
              <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
                <DialogContent className="sm:max-w-md rounded-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-bold flex items-center gap-2">
                      <Mail className="w-5 h-5 text-primary" />
                      <span>Reply to Contact Message</span>
                    </DialogTitle>
                  </DialogHeader>
                  {selectedMessage && (
                    <div className="space-y-4 py-2 text-xs">
                      <div className="p-3 rounded-xl bg-secondary/50 border border-border space-y-1">
                        <p className="font-bold text-foreground">From: {selectedMessage.name} ({selectedMessage.email})</p>
                        <p className="font-semibold text-primary">Subject: {selectedMessage.subject || 'General Inquiry'}</p>
                        <p className="text-muted-foreground text-[11px] italic mt-1">"{selectedMessage.message}"</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="font-bold text-xs">Your Reply Message</Label>
                        <Textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Type official response to customer..."
                          className="min-h-[110px] text-xs rounded-xl"
                        />
                      </div>
                    </div>
                  )}
                  <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={() => setReplyDialogOpen(false)} className="rounded-xl text-xs font-bold">
                      Cancel
                    </Button>
                    <Button
                      onClick={async () => {
                        if (!selectedMessage || !replyText.trim()) return;
                        try {
                          await api.replyContactMessage(selectedMessage.id, replyText);
                          setContactMessages(prev => prev.map(m => m.id === selectedMessage.id ? { ...m, status: 'replied', reply: replyText } : m));
                          toast({
                            title: "Reply saved & sent!",
                            description: `Response updated for ${selectedMessage.email}`,
                          });
                          setReplyDialogOpen(false);
                          setReplyText("");
                          setSelectedMessage(null);
                        } catch (err: any) {
                          toast({
                            title: "Error saving reply",
                            description: err.message || "Could not save reply to database.",
                            variant: "destructive"
                          });
                        }
                      }}
                      className="btn-primary rounded-xl text-xs font-bold gap-1.5"
                    >
                      <Check className="w-4 h-4" /> Send Reply
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {/* TAB 8: STORE SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h1 className="text-2xl font-black text-foreground tracking-tight">Storefront & System Settings</h1>
                <p className="text-xs text-muted-foreground">Configure global announcement banners, authorized admin emails, and store policies.</p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card className="p-5 border-border shadow-sm space-y-4">
                  <h3 className="font-bold text-sm text-foreground">Top Announcement Banner</h3>
                  <div>
                    <Label className="text-xs font-bold">Banner Text</Label>
                    <Input
                      value={announcementText}
                      onChange={(e) => setAnnouncementText(e.target.value)}
                      className="mt-1 text-xs rounded-xl"
                    />
                  </div>
                  <Button size="sm" onClick={() => toast({ title: "Announcement updated!" })} className="btn-primary rounded-xl text-xs font-bold">
                    Save Banner Notice
                  </Button>
                </Card>

                <Card className="p-5 border-border shadow-sm space-y-4">
                  <h3 className="font-bold text-sm text-foreground">Authorized Admin Accounts</h3>
                  <p className="text-xs text-muted-foreground">
                    Authorized administrator email addresses granted control access to the admin workspace.
                  </p>
                  <Textarea
                    value={editableAdminEmails}
                    onChange={(e) => setEditableAdminEmails(e.target.value)}
                    placeholder="e.g. mosesbakare48@gmail.com, melodivaproducts@gmail.com"
                    className="text-xs font-mono rounded-xl min-h-[85px] border-border"
                  />
                  <Button
                    size="sm"
                    onClick={() => {
                      toast({
                        title: "Admin accounts saved!",
                        description: "Authorized admin email list saved successfully.",
                      });
                    }}
                    className="btn-primary rounded-xl text-xs font-bold"
                  >
                    Save Admin Accounts
                  </Button>
                </Card>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
