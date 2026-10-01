import type { Product, Order, OrderStatus } from '../types';

export interface DbHealth {
  status: string;
  database: string;
  type: string;
  stats: {
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    deliveredOrders: number;
    totalItemsSold: number;
    lastUpdated?: string;
  };
}

export const api = {
  // Check DB Health
  async checkHealth(): Promise<DbHealth | null> {
    try {
      const res = await fetch('/api/health');
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  // Products
  async getProducts(): Promise<Product[] | null> {
    try {
      const res = await fetch(`/api/products?_t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Accept': 'application/json' },
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.warn('[API] Could not fetch products from server database, using fallback:', err);
      return null;
    }
  },

  async createProduct(product: Product): Promise<Product | null> {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(product),
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.warn('[API] Error saving product to DB:', err);
      return null;
    }
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    try {
      const res = await fetch(`/api/products/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.warn('[API] Error updating product in DB:', err);
      return null;
    }
  },

  async deleteProduct(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/products/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' },
      });
      return res.ok;
    } catch (err) {
      console.warn('[API] Error deleting product from DB:', err);
      return false;
    }
  },

  // Orders
  async getOrders(): Promise<Order[] | null> {
    try {
      const res = await fetch(`/api/orders?_t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Accept': 'application/json' },
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.warn('[API] Could not fetch orders from server database, using fallback:', err);
      return null;
    }
  },

  async createOrder(order: Order): Promise<Order | null> {
    const postOrder = async () => {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(order),
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server returned HTTP ${res.status}: ${errorText}`);
      }
      const data = await res.json();
      return data.data || order;
    };

    try {
      return await postOrder();
    } catch (err) {
      console.warn('[API] First attempt to save order failed, retrying...', err);
      try {
        await new Promise(r => setTimeout(r, 600));
        return await postOrder();
      } catch (err2) {
        console.error('[API] Error saving order to DB after retry:', err2);
        return null;
      }
    }
  },

  async updateOrderStatus(
    id: string,
    status: OrderStatus,
    notes?: string,
    deliveryCourier?: string,
    trackingCode?: string
  ): Promise<Order | null> {
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(id)}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ status, notes, deliveryCourier, trackingCode }),
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.warn('[API] Error updating order status in DB:', err);
      return null;
    }
  },

  async deleteOrder(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' },
      });
      return res.ok;
    } catch (err) {
      console.warn('[API] Error deleting order from DB:', err);
      return false;
    }
  },

  // Export DB
  async downloadDbBackup(): Promise<void> {
    try {
      const [prodsRes, ordsRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/orders'),
      ]);
      const products = prodsRes.ok ? (await prodsRes.json()).data : [];
      const orders = ordsRes.ok ? (await ordsRes.json()).data : [];

      const backupData = {
        store: 'OSTAD GEAR',
        exportedAt: new Date().toISOString(),
        products,
        orders,
      };

      const blob = new Blob([JSON.stringify(backupData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ostad-gear-db-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export DB backup:', err);
    }
  },
};
