import { supabase } from './supabase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// App-wide concurrency gate. Shared hosting caps simultaneous PHP hits
// (entry processes); the browser fires its own preflight alongside each
// request, so cap API calls at 2 and let the rest queue instead of
// bursting and getting 503s that surface as CORS errors.
class RequestGate {
  private active = 0;
  private waiting: Array<() => void> = [];

  constructor(private max: number = 2) {}

  async run<T>(fn: () => Promise<T>): Promise<T> {
    if (this.active >= this.max) {
      await new Promise<void>((resolve) => this.waiting.push(resolve));
    }
    this.active++;
    try {
      return await fn();
    } finally {
      this.active--;
      const next = this.waiting.shift();
      if (next) next();
    }
  }
}

const apiGate = new RequestGate(2);

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = API_URL;
    // Load token from localStorage on initialization
    this.token = localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    // Shared cPanel hosting caps concurrent PHP requests (entry processes).
    // When the cap is hit, LiteSpeed answers 503 with no CORS headers, which
    // surfaces as a network TypeError. GETs are idempotent, so retry them
    // with backoff; never auto-retry mutations (would duplicate orders/charges).
    const method = (options.method || 'GET').toUpperCase();
    const retryable = method === 'GET';
    const maxAttempts = retryable ? 3 : 1;

    const execute = async (): Promise<T> => {
      let lastError: any = null;

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
          ...options.headers,
        };

        // Add auth token if available
        if (this.token) {
          headers['Authorization'] = `Bearer ${this.token}`;
        }

        const response = await fetch(url, {
          ...options,
          headers,
        });

        if (!response.ok) {
          const error = await response.json().catch(() => ({ error: response.statusText }));
          const errorMessage = error.error || `HTTP error! status: ${response.status}`;
          const httpError = new Error(errorMessage) as any;
          httpError.status = response.status;
          if (retryable && [502, 503, 504, 429].includes(response.status) && attempt < maxAttempts) {
            lastError = httpError;
            await new Promise((r) => setTimeout(r, 400 * attempt));
            continue;
          }
          throw httpError;
        }

        return response.json();
      } catch (err: any) {
        // Network-level failure (no HTTP status: DNS, timeout, or a
        // CORS-stripped 503 page) — retry GETs, fail anything else.
        if (retryable && err?.status === undefined && attempt < maxAttempts) {
          lastError = err;
          await new Promise((r) => setTimeout(r, 400 * attempt));
          continue;
        }
        throw err;
        }
      }

      throw lastError;
    };

    return apiGate.run(execute);
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  // Auth methods
  async signUp(data: {
    email: string;
    password: string;
    full_name: string;
    phone_number: string;
    whatsapp_number?: string;
    address: string;
    state: string;
    city: string;
    security_question: string;
    security_answer: string;
  }) {
    try {
      const response = await this.request<{ token: string; user: { id: string; email: string } }>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      this.setToken(response.token);
      return response;
    } catch (err: any) {
      console.warn('Backend signup unavailable/failed. Attempting Supabase Auth fallback...', err);
      try {
        const { data: supaData, error: supaError } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              full_name: data.full_name,
              phone_number: data.phone_number,
              whatsapp_number: data.whatsapp_number || data.phone_number,
              address: data.address,
              state: data.state,
              city: data.city,
            }
          }
        });
        if (supaError) throw supaError;
        if (supaData?.session) {
          this.setToken(supaData.session.access_token);
          return {
            token: supaData.session.access_token,
            user: { id: supaData.user?.id || 'supa-id', email: data.email }
          };
        }
      } catch (supaErr: any) {
        if (supaErr?.message) throw supaErr;
      }
      throw new Error(err?.message || 'Database connection error. Please verify MySQL service is running or check network connection.');
    }
  }

  async signIn(email: string, password: string) {
    try {
      const response = await this.request<{ token: string; user: { id: string; email: string } }>('/auth/signin', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      this.setToken(response.token);
      return response;
    } catch (err: any) {
      console.warn('Backend signin unavailable/failed. Attempting Supabase Auth fallback...', err);
      try {
        const { data: supaData, error: supaError } = await supabase.auth.signInWithPassword({ email, password });
        if (supaError) throw supaError;
        if (supaData?.session) {
          this.setToken(supaData.session.access_token);
          return {
            token: supaData.session.access_token,
            user: { id: supaData.user.id, email: supaData.user.email || email }
          };
        }
      } catch (supaErr: any) {
        if (err?.status === 401 || supaErr?.message?.includes('Invalid')) {
          throw new Error('Invalid email or password');
        }
      }
      throw new Error(err?.message || 'Database connection error (ECONNREFUSED). Please ensure MySQL service is running or check network connection.');
    }
  }

  async signOut() {
    try {
      await this.request('/auth/signout', { method: 'POST' });
    } catch (error) {
      // Ignore
    } finally {
      try { await supabase.auth.signOut(); } catch (e) { /* ignore */ }
      this.setToken(null);
    }
  }

  async getSession() {
    try {
      if (!this.token) {
        return { data: { session: null } };
      }

      const response = await this.request<{ user: { id: string; email: string; created_at: string } }>('/auth/session');
      return { data: { session: { user: response.user } } };
    } catch (error: any) {
      if (this.token) {
        try {
          const { data: supaSession } = await supabase.auth.getSession();
          if (supaSession?.session?.user) {
            return { data: { session: { user: supaSession.session.user } } };
          }
        } catch (e) {
          // ignore
        }
        if (error?.status === 401 || error?.message?.includes('401')) {
          this.setToken(null);
        }
      }
      return { data: { session: null } };
    }
  }

  async changePassword(oldPassword: string, newPassword: string) {
    return await this.request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ oldPassword, newPassword }),
    });
  }

  async forgotPasswordVerify(data: {
    email: string;
    full_name: string;
    security_question: string;
    security_answer: string;
  }) {
    return await this.request<{ resetToken: string }>('/auth/forgot-password/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async forgotPasswordReset(resetToken: string, newPassword: string) {
    return await this.request('/auth/forgot-password/reset', {
      method: 'POST',
      body: JSON.stringify({ resetToken, newPassword }),
    });
  }

  // Profile methods
  async getProfile() {
    return await this.request('/profiles/me');
  }

  async updateProfile(data: {
    full_name?: string;
    phone_number?: string;
    whatsapp_number?: string;
    address?: string;
    state?: string;
    city?: string;
  }) {
    return await this.request('/profiles/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Order methods
  async createOrder(data: {
    order_number?: string;
    items: any[];
    subtotal: number;
    discount: number;
    delivery_fee: number;
    total: number;
    affiliate_code?: string;
    delivery_address: string;
    delivery_state: string;
    delivery_city: string;
    phone_number: string;
    whatsapp_number?: string;
    payment_reference?: string;
    payment_status?: string;
    status?: string;
  }) {
    return await this.request<{ message: string; order: { id: string; order_number: string } }>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMyOrders() {
    return await this.request('/orders/my-orders');
  }

  async getOrder(orderId: string) {
    return await this.request(`/orders/${encodeURIComponent(orderId)}`);
  }

  async trackOrder(orderId: string) {
    return await this.request(`/orders/track/${encodeURIComponent(orderId)}`);
  }

  async getOrderHistory(orderId: string) {
    return await this.request(`/orders/${encodeURIComponent(orderId)}/history`);
  }

  async verifyPayment(reference: string) {
    return await this.request<{
      verified: boolean;
      status: 'paid' | 'failed';
      amount: number | null;
      currency: string | null;
      reference: string;
      gateway_response?: string | null;
    }>(`/orders/verify-payment/${encodeURIComponent(reference)}`);
  }

  // Affiliate methods
  async checkAffiliate() {
    return await this.request<{ isAffiliate: boolean }>('/affiliates/check');
  }

  async joinAffiliate() {
    return await this.request<{ affiliate_code: string }>('/affiliates/join', {
      method: 'POST',
    });
  }

  async joinAffiliateWaitlist(data: {
    full_name: string;
    email: string;
    phone_number: string;
    social_handle?: string;
  }) {
    return await this.request<{ message: string; whatsapp_community_link: string }>('/affiliates/waitlist', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getAffiliateDashboard() {
    return await this.request('/affiliates/dashboard');
  }

  async createWithdrawal(data: {
    amount: number;
    bank_name: string;
    account_number: string;
    account_name: string;
  }) {
    return await this.request('/affiliates/withdrawals', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async convertBalance(amount: number) {
    return await this.request<{ message: string; coupon_code: string; amount: number }>('/affiliates/convert', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  }

  async verifyAffiliateCode(code: string) {
    const normalizedCode = code.trim().toUpperCase();
    try {
      const res = await this.request<{
        valid: boolean;
        type: 'affiliate' | 'coupon';
        code: string;
        value: number;
        discount_type?: 'fixed' | 'percentage' | 'free_delivery';
        min_order_amount?: number;
        expiry_date?: string | null;
      }>(`/affiliates/verify/${encodeURIComponent(normalizedCode)}`);
      return res;
    } catch (e) {
      console.warn('API verify code endpoint unavailable, checking Supabase...', e);
    }

    try {
      // 1. Check Affiliates
      const { data: affData } = await supabase
        .from('affiliates')
        .select('*')
        .eq('affiliate_code', normalizedCode)
        .eq('is_active', true)
        .maybeSingle();

      if (affData) {
        return {
          valid: true,
          type: 'affiliate' as const,
          code: affData.affiliate_code,
          value: Number(affData.commission_rate || 5)
        };
      }

      // 2. Check Coupons
      const { data: couponData } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', normalizedCode)
        .maybeSingle();

      if (couponData && (couponData.is_active !== false && couponData.status !== 'inactive')) {
        if (couponData.expiry_date && new Date(couponData.expiry_date) < new Date()) {
          throw new Error('Coupon code has expired');
        }
        return {
          valid: true,
          type: 'coupon' as const,
          code: couponData.code,
          discount_type: (couponData.discount_type || 'fixed') as 'fixed' | 'percentage' | 'free_delivery',
          value: Number(couponData.amount || 0),
          min_order_amount: Number(couponData.min_order_amount || 0),
          expiry_date: couponData.expiry_date || null
        };
      }

      // Fallback launch code check for OCTOBERFREE
      if (normalizedCode === 'OCTOBERFREE') {
        const now = new Date();
        const expiry = new Date('2026-10-31T23:59:59Z');
        if (now <= expiry) {
          return {
            valid: true,
            type: 'coupon' as const,
            code: 'OCTOBERFREE',
            discount_type: 'free_delivery' as const,
            value: 0,
            min_order_amount: 20000,
            expiry_date: '2026-10-31T23:59:59Z'
          };
        }
      }

      throw new Error('Invalid promo or coupon code');
    } catch (err: any) {
      throw new Error(err?.message || 'Invalid promo code');
    }
  }

  // Contact methods
  async submitContactMessage(data: { name: string; email: string; message: string; phone?: string; subject?: string }) {
    try {
      return await this.request('/contact/messages', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (e) {
      console.warn('API /contact/messages endpoint unavailable, writing to Supabase...', e);
      const { data: result, error } = await supabase
        .from('contact_messages')
        .insert([{
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          subject: data.subject || 'General Inquiry',
          message: data.message,
          status: 'pending',
          created_at: new Date().toISOString()
        }]);
      if (error) throw error;
      return result;
    }
  }

  async submitReview(data: {
    name: string;
    rating: number;
    comment: string;
    is_anonymous: boolean;
  }) {
    return this.request('/contact/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getReviews() {
    return this.request('/contact/reviews');
  }

  // Admin methods
  async getAdminOrders() {
    return this.request('/admin/orders');
  }

  async getAdminProfiles() {
    return this.request('/admin/profiles');
  }

  async getAdminOrderHistory() {
    return this.request('/admin/order-history');
  }

  async updateOrder(orderId: string, data: {
    status?: string;
    payment_status?: string;
    note?: string;
  }) {
    return this.request(`/admin/orders/${orderId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getAdminProducts() {
    return this.request('/admin/products');
  }

  async createProduct(data: {
    name: string;
    type: string;
    description?: string;
    price: number;
    stock: number;
    image_url?: string;
  }) {
    return this.request('/admin/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProduct(productId: string, data: {
    name: string;
    type: string;
    description?: string;
    price: number;
    stock: number;
    image_url?: string;
  }) {
    return this.request(`/admin/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProduct(productId: string) {
    return this.request(`/admin/products/${productId}`, {
      method: 'DELETE',
    });
  }

  // Admin Affiliate Methods
  async getAdminAffiliates() {
    return this.request('/admin/affiliates');
  }

  async getAdminWithdrawals() {
    return this.request('/admin/withdrawals');
  }

  async updateAffiliate(id: string, data: {
    commission_rate?: number;
    is_active?: boolean;
  }) {
    return this.request(`/admin/affiliates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updateWithdrawalStatus(id: string, status: string) {
    return this.request(`/admin/withdrawals/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async getAdminContactMessages() {
    try {
      const res = await this.request<any[]>('/admin/contact-messages');
      if (Array.isArray(res)) return res;
    } catch (e) {
      console.warn('API /admin/contact-messages failed, querying Supabase...', e);
    }
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching contact messages from Supabase:', err);
      return [];
    }
  }

  async replyContactMessage(id: string, reply: string) {
    try {
      return await this.request(`/admin/contact-messages/${id}/reply`, {
        method: 'POST',
        body: JSON.stringify({ reply }),
      });
    } catch (e) {
      console.warn('API reply endpoint failed, updating Supabase directly...', e);
      const { data, error } = await supabase
        .from('contact_messages')
        .update({ reply, status: 'replied', updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
      return { success: true, data };
    }
  }

  // Order Issues / Claims Methods
  async submitOrderIssue(data: {
    order_id: string;
    order_number: string;
    customer_name: string;
    customer_email: string;
    customer_phone?: string;
    issue_type: string;
    description: string;
    media_urls?: string[];
    user_id?: string;
  }) {
    try {
      return await this.request('/orders/issues', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (e) {
      console.warn('API /orders/issues unavailable, writing to Supabase...', e);
      const { data: result, error } = await supabase
        .from('order_issues')
        .insert([{
          order_id: data.order_id,
          order_number: data.order_number,
          user_id: data.user_id || null,
          customer_name: data.customer_name,
          customer_email: data.customer_email,
          customer_phone: data.customer_phone || null,
          issue_type: data.issue_type || 'damaged_item',
          description: data.description,
          media_urls: data.media_urls || [],
          status: 'pending',
          created_at: new Date().toISOString()
        }]);
      if (error) throw error;
      return result;
    }
  }

  async getOrderIssues(orderId: string) {
    try {
      return await this.request<any[]>(`/orders/${encodeURIComponent(orderId)}/issues`);
    } catch (e) {
      console.warn('API getOrderIssues unavailable, querying Supabase...', e);
      const { data, error } = await supabase
        .from('order_issues')
        .select('*')
        .or(`order_id.eq.${orderId},order_number.eq.${orderId}`)
        .order('created_at', { ascending: false });
      if (error) return [];
      return data || [];
    }
  }

  async getAdminOrderIssues() {
    try {
      const res = await this.request<any[]>('/admin/order-issues');
      if (Array.isArray(res)) return res;
    } catch (e) {
      console.warn('API /admin/order-issues failed, querying Supabase...', e);
    }
    try {
      const { data, error } = await supabase
        .from('order_issues')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching order issues from Supabase:', err);
      return [];
    }
  }

  async updateOrderIssue(id: string, data: { status?: string; admin_reply?: string }) {
    try {
      return await this.request(`/admin/order-issues/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    } catch (e) {
      console.warn('API updateOrderIssue failed, updating Supabase directly...', e);
      const updateData: any = { updated_at: new Date().toISOString() };
      if (data.status) updateData.status = data.status;
      if (data.admin_reply !== undefined) updateData.admin_reply = data.admin_reply;

      const { data: res, error } = await supabase
        .from('order_issues')
        .update(updateData)
        .eq('id', id);
      if (error) throw error;
      return { success: true, data: res };
    }
  }

  // Admin Coupon Management Methods
  async getAdminCoupons() {
    try {
      const res = await this.request<any[]>('/admin/coupons');
      if (Array.isArray(res)) return res;
    } catch (e) {
      console.warn('API /admin/coupons failed, fallback to Supabase...', e);
    }
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      if (data && data.length > 0) return data;
      return [
        {
          id: 'october-free-seed',
          code: 'OCTOBERFREE',
          discount_type: 'free_delivery',
          amount: 0,
          min_order_amount: 20000,
          expiry_date: '2026-10-31T23:59:59Z',
          status: 'active',
          is_active: true,
          created_at: new Date().toISOString()
        }
      ];
    } catch (err) {
      console.error('Supabase fetch coupons failed:', err);
      return [
        {
          id: 'october-free-seed',
          code: 'OCTOBERFREE',
          discount_type: 'free_delivery',
          amount: 0,
          min_order_amount: 20000,
          expiry_date: '2026-10-31T23:59:59Z',
          status: 'active',
          is_active: true,
          created_at: new Date().toISOString()
        }
      ];
    }
  }

  async createAdminCoupon(data: {
    code: string;
    discount_type: 'fixed' | 'percentage' | 'free_delivery';
    amount: number;
    min_order_amount: number;
    expiry_date?: string | null;
  }) {
    try {
      return await this.request('/admin/coupons', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (e) {
      console.warn('API create coupon failed, fallback to Supabase...', e);
      const normalizedCode = data.code.trim().toUpperCase();
      const payload = {
        code: normalizedCode,
        discount_type: data.discount_type,
        amount: data.amount,
        min_order_amount: data.min_order_amount,
        expiry_date: data.expiry_date || null,
        status: 'active',
        is_active: true,
        created_at: new Date().toISOString()
      };
      const { data: res, error } = await supabase
        .from('coupons')
        .insert([payload])
        .select()
        .single();
      if (error) throw error;
      return { message: 'Coupon created', coupon: res };
    }
  }

  async toggleAdminCoupon(id: string, is_active: boolean) {
    try {
      return await this.request(`/admin/coupons/${id}/toggle`, {
        method: 'PUT',
        body: JSON.stringify({ is_active }),
      });
    } catch (e) {
      console.warn('API toggle coupon failed, fallback to Supabase...', e);
      const { error } = await supabase
        .from('coupons')
        .update({
          is_active,
          status: is_active ? 'active' : 'inactive'
        })
        .eq('id', id);
      if (error) throw error;
      return { message: 'Coupon updated' };
    }
  }

  async deleteAdminCoupon(id: string) {
    try {
      return await this.request(`/admin/coupons/${id}`, {
        method: 'DELETE',
      });
    } catch (e) {
      console.warn('API delete coupon failed, fallback to Supabase...', e);
      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return { message: 'Coupon deleted' };
    }
  }
}

export const api = new ApiClient();

type AuthListener = (event: string, session: any) => void;

class AuthManager {
  private listeners: AuthListener[] = [];

  constructor() { }

  async getSession() {
    return api.getSession();
  }

  onAuthStateChange(callback: AuthListener) {
    this.listeners.push(callback);

    api.getSession().then(({ data: { session } }) => {
      if (session) {
        callback('SIGNED_IN', session);
      }
    });

    return {
      data: {
        subscription: {
          unsubscribe: () => {
            this.listeners = this.listeners.filter(l => l !== callback);
          },
        },
      },
    };
  }

  notify(event: string, session: any) {
    this.listeners.forEach(callback => callback(event, session));
  }
}

export const auth = new AuthManager();

const originalSetToken = ApiClient.prototype.setToken;
ApiClient.prototype.setToken = function (token: string | null) {
  originalSetToken.call(this, token);

  if (token) {
    setTimeout(() => {
      this.getSession().then((result: any) => {
        auth.notify('SIGNED_IN', result.data.session);
      }).catch(() => {
        auth.notify('SIGNED_OUT', null);
      });
    }, 0);
  } else {
    auth.notify('SIGNED_OUT', null);
  }
};
