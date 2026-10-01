import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Product, Order, OrderStatus } from '../src/types.ts';
import { INITIAL_PRODUCTS } from '../src/data/initialProducts.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const findDataDir = () => {
  const currentLevel = path.resolve(__dirname, 'data');
  const parentLevel = path.resolve(__dirname, '../data');
  if (fs.existsSync(currentLevel)) return currentLevel;
  if (fs.existsSync(parentLevel)) return parentLevel;
  return currentLevel;
};
const DATA_DIR = findDataDir();
const DB_FILE = path.join(DATA_DIR, 'ostad_gear_database.json');

export interface StoreSettings {
  insideDhakaFee: number;
  outsideDhakaFee: number;
  bkashNumber: string;
  nagadNumber: string;
  rocketNumber: string;
  bannerText: string;
  activePromoCode: string;
  activePromoDiscount: number;
}

export interface DatabaseSchema {
  version: string;
  lastUpdated: string;
  products: Product[];
  orders: Order[];
  settings: StoreSettings;
  logs: { id: string; timestamp: string; action: string; details?: string }[];
}

const DEFAULT_SETTINGS: StoreSettings = {
  insideDhakaFee: 60,
  outsideDhakaFee: 120,
  bkashNumber: '01859-994321',
  nagadNumber: '01712-445566',
  rocketNumber: '01911-332211',
  bannerText: '🔥 DHAKA URBAN STREETWEAR DROP \'26 - LIMITED STOCK AVAILABLE',
  activePromoCode: 'OSTAD10',
  activePromoDiscount: 10,
};

const DEFAULT_DEMO_ORDERS: Order[] = [
  {
    id: 'ord-demo-1',
    orderNumber: 'OG-BD-1042',
    customerName: 'তানভীর আহমেদ',
    phone: '01711223344',
    district: 'Dhaka',
    thanaCity: 'মিরপুর-১০',
    address: 'বাড়ি #১২, রোড #০৫, ব্লক-সি',
    deliveryZone: 'inside_dhaka',
    deliveryFee: 60,
    paymentMethod: 'bkash',
    paymentNumber: '01711223344',
    trxId: 'BK9X82LA0P',
    items: [
      {
        productId: 'prod-ds-1',
        title: 'Cyberpunk Tokyo Oversized Drop Shoulder Tee',
        category: 'dropshoulder',
        image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=900&auto=format&fit=crop&q=80',
        size: 'L',
        price: 650,
        quantity: 1,
      }
    ],
    subtotal: 650,
    discount: 0,
    total: 710,
    status: 'shipped',
    orderDate: '2026-02-24T14:20:00Z',
    deliveryCourier: 'Pathao Courier',
    trackingCode: 'PTH-9021',
  },
  {
    id: 'ord-demo-2',
    orderNumber: 'OG-BD-1043',
    customerName: 'মেহেদী জামান',
    phone: '01899887766',
    district: 'Chattogram',
    thanaCity: 'জিইসি মোড়',
    address: 'হোল্ডিং ৪৫, নাসিরাবাদ হাউজিং',
    deliveryZone: 'outside_dhaka',
    deliveryFee: 120,
    paymentMethod: 'cod',
    items: [
      {
        productId: 'prod-jr-1',
        title: 'Retro Madrid Gold Special Edition Fan Jersey',
        category: 'jersey',
        image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=900&auto=format&fit=crop&q=80',
        size: 'XL',
        price: 790,
        quantity: 1,
      }
    ],
    subtotal: 790,
    discount: 0,
    total: 910,
    status: 'pending',
    orderDate: '2026-02-25T11:00:00Z',
    deliveryCourier: 'Steadfast Courier',
    trackingCode: 'STF-4392',
  },
];

class DatabaseManager {
  private db: DatabaseSchema | null = null;

  constructor() {
    this.ensureDatabase();
  }

  private ensureDatabase(): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.db = JSON.parse(raw);
        console.log(`[Database] Loaded persistent database from ${DB_FILE}`);
      } else {
        // Seed initial database
        this.db = {
          version: '1.0.0',
          lastUpdated: new Date().toISOString(),
          products: INITIAL_PRODUCTS,
          orders: DEFAULT_DEMO_ORDERS,
          settings: DEFAULT_SETTINGS,
          logs: [
            {
              id: 'log-init',
              timestamp: new Date().toISOString(),
              action: 'DATABASE_INITIALIZED',
              details: `Initial seed with ${INITIAL_PRODUCTS.length} products and ${DEFAULT_DEMO_ORDERS.length} orders.`,
            },
          ],
        };
        this.save();
        console.log(`[Database] Created new persistent database at ${DB_FILE}`);
      }
    } catch (err) {
      console.error('[Database] Failed to read/initialize database file:', err);
      // Fallback in-memory
      this.db = {
        version: '1.0.0',
        lastUpdated: new Date().toISOString(),
        products: INITIAL_PRODUCTS,
        orders: DEFAULT_DEMO_ORDERS,
        settings: DEFAULT_SETTINGS,
        logs: [],
      };
    }
  }

  private save(): void {
    if (!this.db) return;
    this.db.lastUpdated = new Date().toISOString();
    try {
      const tempPath = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(this.db, null, 2), 'utf-8');
      fs.renameSync(tempPath, DB_FILE);
    } catch (err) {
      console.error('[Database] Error saving database to disk:', err);
    }
  }

  // Products CRUD
  public getProducts(): Product[] {
    this.ensureDatabase();
    return this.db?.products || [];
  }

  public getProductById(id: string): Product | undefined {
    this.ensureDatabase();
    return this.db?.products.find((p) => p.id === id);
  }

  public createProduct(product: Product): Product {
    this.ensureDatabase();
    if (!this.db) throw new Error('Database not initialized');
    
    // Check if duplicate ID exists, if so generate fresh
    const exists = this.db.products.some((p) => p.id === product.id);
    const finalProduct = exists
      ? { ...product, id: `prod-${Date.now()}` }
      : product;

    this.db.products.unshift(finalProduct);
    this.addLog('PRODUCT_CREATED', `Created product: ${finalProduct.title} (ID: ${finalProduct.id})`);
    this.save();
    return finalProduct;
  }

  public updateProduct(id: string, updates: Partial<Product>): Product | null {
    this.ensureDatabase();
    if (!this.db) return null;
    const index = this.db.products.findIndex((p) => p.id === id);
    if (index === -1) return null;

    this.db.products[index] = {
      ...this.db.products[index],
      ...updates,
    };
    this.addLog('PRODUCT_UPDATED', `Updated product: ${this.db.products[index].title} (ID: ${id})`);
    this.save();
    return this.db.products[index];
  }

  public deleteProduct(id: string): boolean {
    this.ensureDatabase();
    if (!this.db) return false;
    const initialLen = this.db.products.length;
    this.db.products = this.db.products.filter((p) => p.id !== id);
    const deleted = this.db.products.length < initialLen;
    if (deleted) {
      this.addLog('PRODUCT_DELETED', `Deleted product with ID: ${id}`);
      this.save();
    }
    return deleted;
  }

  // Orders CRUD
  public getOrders(): Order[] {
    this.ensureDatabase();
    return this.db?.orders || [];
  }

  public getOrderById(id: string): Order | undefined {
    this.ensureDatabase();
    return this.db?.orders.find((o) => o.id === id);
  }

  public createOrder(order: Order): Order {
    this.ensureDatabase();
    if (!this.db) throw new Error('Database not initialized');

    // Ensure all mandatory fields exist
    const sanitizedOrder: Order = {
      ...order,
      id: order.id || `ord-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      orderNumber: order.orderNumber || `OG-BD-${Math.floor(1000 + Math.random() * 9000)}`,
      orderDate: order.orderDate || new Date().toISOString(),
      status: order.status || 'pending',
      items: Array.isArray(order.items) ? order.items : [],
      customerName: order.customerName || 'Anonymous Customer',
      phone: order.phone || 'N/A',
      address: order.address || 'N/A',
      district: order.district || 'Dhaka',
      thanaCity: order.thanaCity || 'Dhaka',
      deliveryZone: order.deliveryZone || 'inside_dhaka',
      deliveryFee: typeof order.deliveryFee === 'number' ? order.deliveryFee : 60,
      paymentMethod: order.paymentMethod || 'cod',
      subtotal: typeof order.subtotal === 'number' ? order.subtotal : 0,
      discount: typeof order.discount === 'number' ? order.discount : 0,
      total: typeof order.total === 'number' ? order.total : 0,
    };

    // Deduct stock for ordered items
    sanitizedOrder.items.forEach((item) => {
      const prod = this.db?.products.find((p) => p.id === item.productId);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - (item.quantity || 1));
      }
    });

    // Check if order already exists to avoid duplicate entries
    const existingIdx = this.db.orders.findIndex(
      (o) => o.id === sanitizedOrder.id || o.orderNumber === sanitizedOrder.orderNumber
    );

    if (existingIdx >= 0) {
      this.db.orders[existingIdx] = sanitizedOrder;
    } else {
      this.db.orders.unshift(sanitizedOrder);
    }

    this.addLog('ORDER_PLACED', `New order #${sanitizedOrder.orderNumber} placed by ${sanitizedOrder.customerName} (Total: ৳${sanitizedOrder.total})`);
    this.save();
    return sanitizedOrder;
  }

  public updateOrderStatus(
    id: string,
    status: OrderStatus,
    notes?: string,
    deliveryCourier?: string,
    trackingCode?: string
  ): Order | null {
    this.ensureDatabase();
    if (!this.db) return null;
    const cleanId = String(id).trim();
    const order = this.db.orders.find(
      (o) =>
        o.id === cleanId ||
        o.orderNumber === cleanId ||
        o.id.toLowerCase() === cleanId.toLowerCase() ||
        o.orderNumber.toLowerCase() === cleanId.toLowerCase()
    );
    if (!order) return null;

    order.status = status;
    if (notes !== undefined) order.notes = notes;
    if (deliveryCourier !== undefined) order.deliveryCourier = deliveryCourier;
    if (trackingCode !== undefined) order.trackingCode = trackingCode;

    this.addLog('ORDER_STATUS_UPDATED', `Order #${order.orderNumber} status changed to ${status}`);
    this.save();
    return order;
  }

  public deleteOrder(id: string): boolean {
    this.ensureDatabase();
    if (!this.db) return false;
    const cleanId = String(id).trim();
    const initialLen = this.db.orders.length;
    this.db.orders = this.db.orders.filter(
      (o) =>
        o.id !== cleanId &&
        o.orderNumber !== cleanId &&
        o.id.toLowerCase() !== cleanId.toLowerCase() &&
        o.orderNumber.toLowerCase() !== cleanId.toLowerCase()
    );
    const deleted = this.db.orders.length < initialLen;
    if (deleted) {
      this.addLog('ORDER_DELETED', `Deleted order with ID: ${id}`);
      this.save();
    }
    return deleted;
  }

  // Settings
  public getSettings(): StoreSettings {
    this.ensureDatabase();
    return this.db?.settings || DEFAULT_SETTINGS;
  }

  public updateSettings(updates: Partial<StoreSettings>): StoreSettings {
    this.ensureDatabase();
    if (!this.db) return DEFAULT_SETTINGS;
    this.db.settings = { ...this.db.settings, ...updates };
    this.addLog('SETTINGS_UPDATED', 'Updated store settings');
    this.save();
    return this.db.settings;
  }

  // Stats
  public getStats() {
    this.ensureDatabase();
    const orders = this.db?.orders || [];
    const products = this.db?.products || [];

    const totalRevenue = orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0);

    const pendingOrders = orders.filter((o) => o.status === 'pending').length;
    const deliveredOrders = orders.filter((o) => o.status === 'delivered').length;
    const totalItemsSold = orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.items.reduce((acc, it) => acc + it.quantity, 0), 0);

    return {
      totalProducts: products.length,
      totalOrders: orders.length,
      totalRevenue,
      pendingOrders,
      deliveredOrders,
      totalItemsSold,
      lastUpdated: this.db?.lastUpdated,
    };
  }

  public resetDatabase(): void {
    this.db = {
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
      products: INITIAL_PRODUCTS,
      orders: DEFAULT_DEMO_ORDERS,
      settings: DEFAULT_SETTINGS,
      logs: [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          action: 'DATABASE_RESET',
          details: 'Database reset to default catalog.',
        },
      ],
    };
    this.save();
  }

  private addLog(action: string, details?: string): void {
    if (!this.db) return;
    this.db.logs.unshift({
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      action,
      details,
    });
    // Keep max 100 logs
    if (this.db.logs.length > 100) {
      this.db.logs = this.db.logs.slice(0, 100);
    }
  }
}

export const dbManager = new DatabaseManager();
