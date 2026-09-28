export interface DemoUser {
  id: string;
  email: string;
  full_name: string;
  phone_number: string;
  whatsapp_number: string;
  address: string;
  state: string;
  city: string;
  created_at: string;
}

export const DEMO_USER_DATA: DemoUser = {
  id: 'demo-user-882',
  email: 'demo@melodivaskincare.com',
  full_name: 'Melodiva Demo User',
  phone_number: '08078725283',
  whatsapp_number: '08078725283',
  address: '12 Allen Avenue, Ikeja',
  state: 'Lagos',
  city: 'Ikeja',
  created_at: '2026-09-01T00:00:00.000Z',
};

export const DEMO_PROMO_CODES: Record<string, { type: 'affiliate' | 'coupon'; value: number }> = {
  MELODIVA10: { type: 'affiliate', value: 10 },
  DEMO10: { type: 'affiliate', value: 10 },
  XFMD: { type: 'affiliate', value: 10 },
  WELCOME5: { type: 'coupon', value: 500 },
};

export const INITIAL_DEMO_ORDERS = [
  {
    id: 'demo-order-882194',
    order_number: 'ORD-882194',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    status: 'shipped',
    payment_status: 'completed',
    payment_reference: 'PAY-DEMO-882194',
    subtotal: 7300,
    discount: 730,
    delivery_fee: 1500,
    total: 8070,
    affiliate_code: 'MELODIVA10',
    delivery_address: '12 Allen Avenue, Ikeja',
    delivery_state: 'Lagos',
    delivery_city: 'Ikeja',
    phone_number: '08078725283',
    whatsapp_number: '08078725283',
    items: [
      {
        id: 'black-soap-exquisite-500',
        name: 'Black Soap - Exquisite (500g)',
        price: 4500,
        quantity: 1,
        image: '/assets/bs_et-500.jpg',
        size: '500g',
        variant: 'Exquisite'
      },
      {
        id: 'kernel-oil-500',
        name: 'Pure Kernel Oil (500ml)',
        price: 2800,
        quantity: 1,
        image: '/assets/ke_500.jpg',
        size: '500ml'
      }
    ]
  },
  {
    id: 'demo-order-771029',
    order_number: 'ORD-771029',
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    status: 'delivered',
    payment_status: 'completed',
    payment_reference: 'PAY-DEMO-771029',
    subtotal: 3800,
    discount: 0,
    delivery_fee: 1500,
    total: 5300,
    affiliate_code: '',
    delivery_address: '12 Allen Avenue, Ikeja',
    delivery_state: 'Lagos',
    delivery_city: 'Ikeja',
    phone_number: '08078725283',
    whatsapp_number: '08078725283',
    items: [
      {
        id: 'black-soap-natural-500',
        name: 'Black Soap - Natural (500g)',
        price: 3800,
        quantity: 1,
        image: '/assets/bs_nf-500.jpg',
        size: '500g',
        variant: 'Natural'
      }
    ]
  }
];

class DemoStore {
  private STORAGE_KEY = 'melodiva_demo_active';
  private PROFILE_KEY = 'melodiva_demo_profile';
  private ORDERS_KEY = 'melodiva_demo_orders';
  private ISSUES_KEY = 'melodiva_demo_issues';

  isDemoActive(): boolean {
    return localStorage.getItem(this.STORAGE_KEY) === 'true';
  }

  enableDemoMode(): void {
    localStorage.setItem(this.STORAGE_KEY, 'true');
    localStorage.setItem('auth_token', 'demo-token-active-2026');

    if (!localStorage.getItem(this.PROFILE_KEY)) {
      localStorage.setItem(this.PROFILE_KEY, JSON.stringify(DEMO_USER_DATA));
    }
    if (!localStorage.getItem(this.ORDERS_KEY)) {
      localStorage.setItem(this.ORDERS_KEY, JSON.stringify(INITIAL_DEMO_ORDERS));
    }
  }

  disableDemoMode(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem('auth_token');
  }

  getDemoProfile(): DemoUser {
    const data = localStorage.getItem(this.PROFILE_KEY);
    if (data) {
      try { return JSON.parse(data); } catch (e) { }
    }
    return DEMO_USER_DATA;
  }

  updateDemoProfile(updated: Partial<DemoUser>): DemoUser {
    const current = this.getDemoProfile();
    const next = { ...current, ...updated };
    localStorage.setItem(this.PROFILE_KEY, JSON.stringify(next));
    return next;
  }

  getDemoOrders(): any[] {
    const data = localStorage.getItem(this.ORDERS_KEY);
    if (data) {
      try { return JSON.parse(data); } catch (e) { }
    }
    return INITIAL_DEMO_ORDERS;
  }

  addDemoOrder(order: any): any {
    const orders = this.getDemoOrders();
    const nextOrders = [order, ...orders];
    localStorage.setItem(this.ORDERS_KEY, JSON.stringify(nextOrders));
    return order;
  }

  findDemoOrder(query: string): any | null {
    const orders = this.getDemoOrders();
    const clean = query.trim().toUpperCase();
    return (
      orders.find(
        (o) =>
          o.id === query ||
          o.order_number?.toUpperCase() === clean ||
          o.payment_reference?.toUpperCase() === clean
      ) || null
    );
  }

  getDemoIssues(): any[] {
    const data = localStorage.getItem(this.ISSUES_KEY);
    if (data) {
      try { return JSON.parse(data); } catch (e) { }
    }
    return [];
  }

  addDemoIssue(issue: any): any {
    const issues = this.getDemoIssues();
    const next = [issue, ...issues];
    localStorage.setItem(this.ISSUES_KEY, JSON.stringify(next));
    return issue;
  }
}

export const demoStore = new DemoStore();
