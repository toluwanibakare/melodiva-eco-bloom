const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

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
    const response = await this.request<{ token: string; user: { id: string; email: string } }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setToken(response.token);
    return response;
  }

  async signIn(email: string, password: string) {
    const response = await this.request<{ token: string; user: { id: string; email: string } }>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(response.token);
    return response;
  }

  async signOut() {
    try {
      await this.request('/auth/signout', { method: 'POST' });
    } catch (error) {
      console.error('Signout error:', error);
    } finally {
      this.setToken(null);
    }
  }

  async getSession() {
    try {
      // If no token, return null session
      if (!this.token) {
        return { data: { session: null } };
      }

      const response = await this.request<{ user: { id: string; email: string; created_at: string } }>('/auth/session');
      return { data: { session: { user: response.user } } };
    } catch (error: any) {
      // If 401, clear invalid token and return null session
      if (error?.status === 401 || (error instanceof Error && error.message.includes('401'))) {
        this.setToken(null);
      }
      return { data: { session: null } };
    }
  }

  async changePassword(oldPassword: string, newPassword: string) {
    return this.request('/auth/change-password', {
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
    return this.request<{ resetToken: string }>('/auth/forgot-password/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async forgotPasswordReset(resetToken: string, newPassword: string) {
    return this.request('/auth/forgot-password/reset', {
      method: 'POST',
      body: JSON.stringify({ resetToken, newPassword }),
    });
  }

  // Profile methods
  async getProfile() {
    return this.request('/profiles/me');
  }

  async updateProfile(data: {
    full_name?: string;
    phone_number?: string;
    whatsapp_number?: string;
    address?: string;
    state?: string;
    city?: string;
  }) {
    return this.request('/profiles/me', {
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
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMyOrders() {
    return this.request('/orders/my-orders');
  }

  async getOrder(orderId: string) {
    return this.request(`/orders/${orderId}`);
  }

  async getOrderHistory(orderId: string) {
    return this.request(`/orders/${orderId}/history`);
  }

  // Affiliate methods
  async checkAffiliate() {
    return this.request<{ isAffiliate: boolean }>('/affiliates/check');
  }

  async joinAffiliate() {
    return this.request<{ affiliate_code: string }>('/affiliates/join', {
      method: 'POST',
    });
  }

  async getAffiliateDashboard() {
    return this.request('/affiliates/dashboard');
  }

  async createWithdrawal(data: {
    amount: number;
    bank_name: string;
    account_number: string;
    account_name: string;
  }) {
    return this.request('/affiliates/withdrawals', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async verifyAffiliateCode(code: string) {
    return this.request<{ valid: boolean; code: string; commission_rate: number }>(`/affiliates/verify/${code}`);
  }

  // Contact methods
  async submitContactMessage(data: { name: string; email: string; message: string }) {
    return this.request('/contact/messages', {
      method: 'POST',
      body: JSON.stringify(data),
    });
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

  async updateWithdrawalStatus(id: string, status: string) {
    return this.request(`/admin/withdrawals/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
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
