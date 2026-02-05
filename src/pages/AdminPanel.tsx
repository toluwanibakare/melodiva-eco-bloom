import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, auth } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  Check,
  Loader2,
  Package,
  RefreshCw,
  Users,
} from "lucide-react";

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
  user_id?: string;
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
  "pending",
  "packaged",
  "shipped",
  "delivered",
  "cancelled",
];

const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"];

const AdminPanel = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [statusHistory, setStatusHistory] = useState<
    Record<string, StatusHistoryRow[]>
  >({});
  const [orderUpdates, setOrderUpdates] = useState<
    Record<string, OrderUpdateState>
  >({});
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [productForm, setProductForm] = useState<Partial<ProductRow>>({
    name: "",
    type: "",
    description: "",
    price: 0,
    stock: 0,
    image_url: "",
  });
  const [productError, setProductError] = useState<string | null>(null);
  const [savingProduct, setSavingProduct] = useState(false);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [affiliates, setAffiliates] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);

  const updateWithdrawal = async (id: string, status: string) => {
    try {
      await api.updateWithdrawalStatus(id, status);
      toast({ title: "Withdrawal updated" });
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update withdrawal",
        variant: "destructive"
      });
    }
  };

  const adminEmails = useMemo(() => {
    return (import.meta.env.VITE_ADMIN_EMAILS ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean);
  }, []);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await auth.getSession();
      const email = session?.user.email?.toLowerCase() ?? null;
      setSessionEmail(email);

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
      const [ordersData, profilesData, historyData, productsData, affiliatesData, withdrawalsData] =
        await Promise.all([
          api.getAdminOrders(),
          api.getAdminProfiles(),
          api.getAdminOrderHistory(),
          api.getAdminProducts().catch(() => []),
          api.getAdminAffiliates().catch(() => []),
          api.getAdminWithdrawals().catch(() => [])
        ]);

      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setProfiles(Array.isArray(profilesData) ? profilesData : []);
      setAffiliates(Array.isArray(affiliatesData) ? affiliatesData : []);
      setWithdrawals(Array.isArray(withdrawalsData) ? withdrawalsData : []);

      if (Array.isArray(productsData)) {
        setProductError(null);
        setProducts(productsData);
      } else {
        setProductError("Products table not found. Create it to enable product management.");
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
        status: prev[orderId]?.status ?? "pending",
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
        title: "No changes",
        description: "Select a status or note before updating.",
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

      toast({ title: "Order updated" });
      await fetchData();
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message ?? "Could not update order.",
        variant: "destructive",
      });
    }
  };

  const resetProductForm = () =>
    setProductForm({
      id: undefined,
      name: "",
      type: "",
      description: "",
      price: 0,
      stock: 0,
      image_url: "",
    });

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
      } else {
        await api.createProduct(payload);
      }

      toast({ title: "Product saved" });
      resetProductForm();
      await fetchData();
    } catch (error: any) {
      toast({
        title: "Product error",
        description:
          error.message ??
          "Ensure the products table exists with columns: id, name, type, description, price, stock, image_url.",
        variant: "destructive",
      });
    } finally {
      setSavingProduct(false);
    }
  };

  const editProduct = (product: ProductRow) => {
    setProductForm(product);
  };

  const deleteProduct = async (id?: string) => {
    if (!id) return;
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

  const formatPrice = (price: number | null) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(Number(price ?? 0));

  const totalRevenue = orders.reduce(
    (sum, order) => sum + Number(order.total ?? 0),
    0
  );

  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const shippedOrders = orders.filter((o) => o.status === "shipped").length;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24 flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Admin tools</p>
          <h1 className="text-3xl font-bold">Operations Dashboard</h1>
        </div>
        <Button variant="outline" onClick={fetchData}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh data
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total revenue</CardTitle>
            <Check className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              From {orders.length} orders
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrders}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting packaging or payment
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">In transit</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{shippedOrders}</div>
            <p className="text-xs text-muted-foreground">
              Orders marked as shipped
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders">
        <TabsList className="mb-4">
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="affiliates">Affiliates</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Order management</CardTitle>
              <p className="text-sm text-muted-foreground">
                Update status, track deliveries, and review payment state.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {orders.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No orders found.
                </p>
              )}

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => {
                      const update = orderUpdates[order.id] ?? {
                        status: order.status,
                        note: "",
                        payment_status: order.payment_status,
                      };

                      return (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">
                            <div className="flex flex-col">
                              <span>{order.order_number}</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(order.created_at).toLocaleString()}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={update.status}
                              onValueChange={(value) =>
                                handleOrderUpdateChange(
                                  order.id,
                                  "status",
                                  value
                                )
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Status" />
                              </SelectTrigger>
                              <SelectContent>
                                {ORDER_STATUSES.map((status) => (
                                  <SelectItem key={status} value={status}>
                                    {status}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={update.payment_status}
                              onValueChange={(value) =>
                                handleOrderUpdateChange(
                                  order.id,
                                  "payment_status",
                                  value
                                )
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Payment" />
                              </SelectTrigger>
                              <SelectContent>
                                {PAYMENT_STATUSES.map((status) => (
                                  <SelectItem key={status} value={status}>
                                    {status}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>{formatPrice(order.total)}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {order.delivery_city}, {order.delivery_state}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {order.phone_number}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="space-y-2 min-w-[280px]">
                            <Label className="text-xs">Tracking note</Label>
                            <Textarea
                              placeholder="Add tracking number, courier, or internal notes"
                              value={update.note}
                              onChange={(e) =>
                                handleOrderUpdateChange(
                                  order.id,
                                  "note",
                                  e.target.value
                                )
                              }
                            />
                            <div className="flex items-center justify-between gap-2">
                              <Button
                                size="sm"
                                onClick={() => updateOrder(order.id)}
                              >
                                Update
                              </Button>
                              <Badge variant="outline">
                                {statusHistory[order.id]?.length ?? 0} updates
                              </Badge>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent tracking updates</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(statusHistory)
                .slice(0, 6)
                .map(([orderId, history]) => (
                  <Card key={orderId} className="border-muted">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Order: {orderId}
                        </span>
                        <Badge variant="secondary">
                          {history[0]?.status ?? "updated"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {history.slice(0, 3).map((item) => (
                        <div key={item.id} className="rounded bg-muted p-2">
                          <p className="text-sm font-medium">{item.status}</p>
                          {item.notes && (
                            <p className="text-xs text-muted-foreground">
                              {item.notes}
                            </p>
                          )}
                          <p className="text-[11px] text-muted-foreground">
                            {new Date(item.created_at).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Customers</CardTitle>
              <p className="text-sm text-muted-foreground">
                View registered profiles and contact information.
              </p>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Location</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profiles.map((profile) => (
                    <TableRow key={profile.id}>
                      <TableCell className="font-medium">
                        {profile.full_name}
                      </TableCell>
                      <TableCell>{profile.email}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{profile.phone_number}</span>
                          {profile.whatsapp_number && (
                            <span className="text-xs text-muted-foreground">
                              WhatsApp: {profile.whatsapp_number}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {profile.city}, {profile.state}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Product catalog</CardTitle>
              <p className="text-sm text-muted-foreground">
                Create, edit, or remove products stored in Supabase.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {productError && (
                <div className="rounded border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-900">
                  {productError}
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={productForm.name}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Product title"
                  />
                  <Label htmlFor="type">Type</Label>
                  <Input
                    id="type"
                    value={productForm.type}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        type: e.target.value,
                      }))
                    }
                    placeholder="black-soap / kernel-oil"
                  />
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={productForm.description}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="What makes this item special?"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="price">Price (NGN)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={productForm.price}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        price: Number(e.target.value),
                      }))
                    }
                  />
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={productForm.stock}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        stock: Number(e.target.value),
                      }))
                    }
                  />
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    value={productForm.image_url}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        image_url: e.target.value,
                      }))
                    }
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button onClick={saveProduct} disabled={savingProduct}>
                  {savingProduct && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  {productForm.id ? "Update product" : "Add product"}
                </Button>
                <Button variant="outline" onClick={resetProductForm}>
                  Clear form
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Catalog</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id ?? product.name}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{product.name}</span>
                          {product.description && (
                            <span className="text-xs text-muted-foreground line-clamp-2">
                              {product.description}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{product.type}</TableCell>
                      <TableCell>{formatPrice(product.price)}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => editProduct(product)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteProduct(product.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="affiliates" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Affiliates Roster</CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Commission</TableHead>
                      <TableHead>Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {affiliates.map((aff) => (
                      <TableRow key={aff.id}>
                        <TableCell className="font-medium">{aff.affiliate_code}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{aff.full_name}</span>
                            <span className="text-xs text-muted-foreground">{aff.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>{aff.commission_rate}%</TableCell>
                        <TableCell>{formatPrice(aff.current_balance)}</TableCell>
                      </TableRow>
                    ))}
                    {affiliates.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                          No affiliates found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Withdrawal Requests</CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Affiliate</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {withdrawals.map((w) => (
                      <TableRow key={w.id}>
                        <TableCell className="text-xs">
                          {new Date(w.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-xs">
                          {w.full_name}
                          <div className="text-[10px] text-muted-foreground">{w.bank_name}</div>
                        </TableCell>
                        <TableCell>{formatPrice(w.amount)}</TableCell>
                        <TableCell>
                          <Badge variant={w.status === 'paid' ? 'default' : w.status === 'pending' ? 'outline' : 'secondary'}>
                            {w.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {w.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => updateWithdrawal(w.id, 'paid')}>
                                Pay
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => updateWithdrawal(w.id, 'rejected')}>
                                Reject
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {withdrawals.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                          No pending withdrawals
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

      </Tabs>
    </div>
  );
};

export default AdminPanel;

