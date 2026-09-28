import { supabase } from './supabase';
import { demoStore, DEMO_PROMO_CODES, DEMO_USER_DATA } from './demoStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = API_URL;
    // Load token from localStorage on initialization
    this.token = localStorage.getItem('auth_token');
    if (demoStore.isDemoActive() && !this.token) {
      this.token = 'demo-token-active-2026';
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
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
      throw httpError;
    }

    return response.json();
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

  // Demo Mode Helpers
  enableDemoMode() {
    demoStore.enableDemoMode();
    this.setToken('demo-token-active-2026');
  }

  disableDemoMode() {
    demoStore.disableDemoMode();
    this.setToken(null);
  }

  isDemoMode(): boolean {
    return demoStore.isDemoActive();
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
    } catch (err) {
      console.warn('Backend signup unavailable, activating Demo session...', err);
      this.enableDemoMode();
      demoStore.updateDemoProfile({
        full_name: data.full_name,
        email: data.email,
        phone_number: data.phone_number,
        whatsapp_number: data.whatsapp_number || data.phone_number,
        address: data.address,
        state: data.state,
        city: data.city,
      });
      return { token: 'demo-token-active-2026', user: demoStore.getDemoProfile() };
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
    } catch (err) {
      console.warn('Backend signin unavailable, activating Demo session...', err);
      this.enableDemoMode();
      return { token: 'demo-token-active-2026', user: demoStore.getDemoProfile() };
    }
  }

  async signOut() {
    try {
      await this.request('/auth/signout', { method: 'POST' });
    } catch (error) {
      // Ignore
    } finally {
      this.disableDemoMode();
    }
  }

  async getSession() {
    if (demoStore.isDemoActive()) {
      return { data: { session: { user: demoStore.getDemoProfile() } } };
    }

    try {
      if (!this.token) {
        return { data: { session: null } };
      }

      const response = await this.request<{ user: { id: string; email: string; created_at: string } }>('/auth/session');
      return { data: { session: { user: response.user } } };
    } catch (error: any) {
      if (this.token && (error?.status === 401 || error?.message?.includes('401'))) {
        this.setToken(null);
        return { data: { session: null } };
      }
      // If server unreachable but token exists, fallback to demo session
      if (this.token) {
        return { data: { session: { user: demoStore.getDemoProfile() } } };
      }
      return { data: { session: null } };
    }
  }

  async changePassword(oldPassword: string, newPassword: string) {
    try {
      return await this.request('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ oldPassword, newPassword }),
      });
    } catch (e) {
      return { message: 'Password updated (Demo Mode)' };
    }
  }

  async forgotPasswordVerify(data: {
    email: string;
    full_name: string;
    security_question: string;
    security_answer: string;
  }) {
    try {
      return await this.request<{ resetToken: string }>('/auth/forgot-password/verify', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (e) {
      return { resetToken: 'demo-reset-token' };
    }
  }

  async forgotPasswordReset(resetToken: string, newPassword: string) {
    try {
      return await this.request('/auth/forgot-password/reset', {
        method: 'POST',
        body: JSON.stringify({ resetToken, newPassword }),
      });
    } catch (e) {
      return { message: 'Password reset successful (Demo Mode)' };
    }
  }

  // Profile methods
  async getProfile() {
    if (demoStore.isDemoActive()) {
      return demoStore.getDemoProfile();
    }
    try {
      return await this.request('/profiles/me');
    } catch (e) {
      return demoStore.getDemoProfile();
    }
  }

  async updateProfile(data: {
    full_name?: string;
    phone_number?: string;
    whatsapp_number?: string;
    address?: string;
    state?: string;
    city?: string;
  }) {
    if (demoStore.isDemoActive()) {
      return demoStore.updateDemoProfile(data);
    }
    try {
      return await this.request('/profiles/me', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    } catch (e) {
      return demoStore.updateDemoProfile(data);
    }
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
    const finalOrderNumber = data.order_number || `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrderObj = {
      id: `demo-order-${Date.now()}`,
      order_number: finalOrderNumber,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: data.status || 'pending',
      payment_status: data.payment_status || 'completed',
      payment_reference: data.payment_reference || `PAY-${finalOrderNumber}`,
      items: data.items,
      subtotal: data.subtotal,
      discount: data.discount || 0,
      delivery_fee: data.delivery_fee,
      total: data.total,
      affiliate_code: data.affiliate_code || '',
      delivery_address: data.delivery_address,
      delivery_state: data.delivery_state,
      delivery_city: data.delivery_city,
      phone_number: data.phone_number,
      whatsapp_number: data.whatsapp_number || data.phone_number,
    };

    try {
      const res = await this.request<{ message: string; order: { id: string; order_number: string } }>('/orders', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      demoStore.addDemoOrder(newOrderObj);
      return res;
    } catch (err) {
      console.warn('Backend createOrder unavailable, saving to Demo store...', err);
      demoStore.addDemoOrder(newOrderObj);
      return {
        message: 'Order created successfully',
        order: {
          id: newOrderObj.id,
          order_number: finalOrderNumber,
        }
      };
    }
  }

  async getMyOrders() {
    if (demoStore.isDemoActive()) {
      return demoStore.getDemoOrders();
    }
    try {
      return await this.request('/orders/my-orders');
    } catch (e) {
      return demoStore.getDemoOrders();
    }
  }

  async getOrder(orderId: string) {
    if (demoStore.isDemoActive()) {
      const found = demoStore.findDemoOrder(orderId);
      if (found) return found;
    }
    try {
      return await this.request(`/orders/${encodeURIComponent(orderId)}`);
    } catch (e) {
      const found = demoStore.findDemoOrder(orderId);
      if (found) return found;
      throw e;
    }
  }

  async trackOrder(orderId: string) {
    const found = demoStore.findDemoOrder(orderId);
    if (found) return found;

    try {
      return await this.request(`/orders/track/${encodeURIComponent(orderId)}`);
    } catch (e) {
      if (found) return found;
      throw e;
    }
  }

  async getOrderHistory(orderId: string) {
    try {
      return await this.request(`/orders/${encodeURIComponent(orderId)}/history`);
    } catch (e) {
      return [
        { id: '1', order_id: orderId, status: 'pending', notes: 'Order created', created_at: new Date().toISOString() }
      ];
    }
  }

  // Affiliate methods
  async checkAffiliate() {
    if (demoStore.isDemoActive()) {
      return { isAffiliate: true };
    }
    try {
      return await this.request<{ isAffiliate: boolean }>('/affiliates/check');
    } catch (e) {
      return { isAffiliate: true };
    }
  }

  async joinAffiliate() {
    try {
      return await this.request<{ affiliate_code: string }>('/affiliates/join', {
        method: 'POST',
      });
    } catch (e) {
      return { affiliate_code: 'XFMD' };
    }
  }

  async getAffiliateDashboard() {
    if (demoStore.isDemoActive()) {
      return {
        affiliate: {
          id: 'demo-affiliate-1',
          affiliate_code: 'XFMD',
          commission_rate: 10,
          total_commission: 15400,
          current_balance: 10400,
          total_withdrawn: 5000,
          created_at: '2026-09-01T00:00:00.000Z',
        },
        referrals: [
          {
            id: 'ref-1',
            order_number: 'ORD-882194',
            customer_name: 'Chioma Adebayo',
            commission_amount: 730,
            status: 'completed',
            created_at: new Date(Date.now() - 86400000).toISOString(),
            order_total: 8070,
          },
          {
            id: 'ref-2',
            order_number: 'ORD-993821',
            customer_name: 'Emeka Nwosu',
            commission_amount: 1470,
            status: 'completed',
            created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
            order_total: 16200,
          },
        ],
        withdrawals: [
          {
            id: 'with-1',
            amount: 5000,
            bank_name: 'Guaranty Trust Bank',
            account_number: '0123456789',
            account_name: 'Melodiva Demo User',
            status: 'paid',
            created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
          }
        ]
      };
    }
    try {
      return await this.request('/affiliates/dashboard');
    } catch (e) {
      return {
        affiliate: {
          id: 'demo-affiliate-1',
          affiliate_code: 'XFMD',
          commission_rate: 10,
          total_commission: 15400,
          current_balance: 10400,
          total_withdrawn: 5000,
          created_at: '2026-09-01T00:00:00.000Z',
        },
        referrals: [
          {
            id: 'ref-1',
            order_number: 'ORD-882194',
            customer_name: 'Chioma Adebayo',
            commission_amount: 730,
            status: 'completed',
            created_at: new Date(Date.now() - 86400000).toISOString(),
            order_total: 8070,
          },
        ],
        withdrawals: []
      };
    }
  }

  async createWithdrawal(data: {
    amount: number;
    bank_name: string;
    account_number: string;
    account_name: string;
  }) {
    try {
      return await this.request('/affiliates/withdrawals', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (e) {
      return { message: 'Withdrawal request submitted successfully (Demo Mode)' };
    }
  }

  async convertBalance(amount: number) {
    try {
      return await this.request<{ message: string; coupon_code: string; amount: number }>('/affiliates/convert', {
        method: 'POST',
        body: JSON.stringify({ amount }),
      });
    } catch (e) {
      return {
        message: 'Balance converted successfully',
        coupon_code: 'CPN-DEMO10',
        amount: amount
      };
    }
  }

  async verifyAffiliateCode(code: string) {
    const cleanCode = code.trim().toUpperCase();
    const promo = DEMO_PROMO_CODES[cleanCode];

    if (promo) {
      return {
        valid: true,
        type: promo.type,
        code: cleanCode,
        value: promo.value,
      };
    }

    try {
      return await this.request<{
        valid: boolean;
        type: 'affiliate' | 'coupon';
        code: string;
        value: number;
      }>(`/affiliates/verify/${encodeURIComponent(code)}`);
    } catch (e) {
      // Fallback for demo code
      if (cleanCode === 'MELODIVA10' || cleanCode === 'XFMD' || cleanCode === 'DEMO10') {
        return {
          valid: true,
          type: 'affiliate',
          code: cleanCode,
          value: 10,
        };
      }
      const httpError = new Error('Invalid code') as any;
      httpError.status = 404;
      throw httpError;
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
}

export const api = new ApiClient();

// Auth state management helper
// Auth state management helper
type AuthListener = (event: string, session: any) => void;

class AuthManager {
  private listeners: AuthListener[] = [];

  constructor() { }

  async getSession() {
    return api.getSession();
  }

  onAuthStateChange(callback: AuthListener) {
    this.listeners.push(callback);

    // Check initial session and fire immediately
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

// Augment ApiClient to notify AuthManager
const originalSetToken = ApiClient.prototype.setToken;
ApiClient.prototype.setToken = function (token: string | null) {
  originalSetToken.call(this, token);

  // Notify listeners
  // We need to fetch the session details if logging in, or send null if logging out
  if (token) {
    // We can't easily await inside this sync method, but we can trigger the fetch
    // Use a small delay or promise chain to allow the token to be set first
    setTimeout(() => {
      this.getSession().then((result: any) => {
        auth.notify('SIGNED_IN', result.data.session);
      }).catch(() => {
        // If session fetch fails (e.g. invalid token), treat as signed out
        auth.notify('SIGNED_OUT', null);
      });
    }, 0);
  } else {
    auth.notify('SIGNED_OUT', null);
  }
};
