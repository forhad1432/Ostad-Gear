import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { 
  Filter, 
  ArrowUpDown, 
  ShoppingBag, 
  Sparkles, 
  Layers, 
  Check, 
  SlidersHorizontal,
  Flame,
  Search,
  Truck,
  RotateCcw,
  ShieldCheck
} from 'lucide-react';

import { Product, ProductCategory, ProductSize, CartItem, Order, OrderStatus } from './types';
import { INITIAL_PRODUCTS } from './data/initialProducts';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { AdminPanel } from './components/AdminPanel';
import { MasterPromptModal } from './components/MasterPromptModal';
import { WishlistModal } from './components/WishlistModal';
import { Footer } from './components/Footer';

// Seed sample demo orders so Admin starts with real records
const INITIAL_DEMO_ORDERS: Order[] = [
  {
    id: 'ord-demo-1',
    orderNumber: 'OG-BD-1042',
    customerName: 'তানভীর হাসান',
    phone: '01711223344',
    district: 'Dhaka',
    thanaCity: 'মিরপুর ১০',
    address: 'বাড়ি ১৪, রোড ৪, ব্লক সি',
    deliveryZone: 'inside_dhaka',
    deliveryFee: 60,
    paymentMethod: 'bkash',
    paymentNumber: '01711223344',
    trxId: '8N47A6B29C',
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

export default function App() {
  // Persistent Products
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('tc_products');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_PRODUCTS;
  });

  // Persistent Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('tc_orders');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_DEMO_ORDERS;
  });

  // Persistent Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('tc_cart');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });

  // Persistent Wishlist
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('tc_wishlist');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });

  // Admin Auth State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('tc_admin_session') === 'true';
  });

  // Server Database Status
  const [dbConnected, setDbConnected] = useState<boolean>(true);

  // Helper to play notification chime on new order
  const playOrderAlert = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
      osc.start();
      osc.stop(ctx.currentTime + 0.55);
    } catch {
      // Audio autoplay restrictions or unsupported
    }
  };

  // Master function to sync orders and products from server DB
  const refreshOrdersFromServer = useCallback(async (isBackground = false) => {
    try {
      const serverOrders = await api.getOrders();
      if (serverOrders && Array.isArray(serverOrders)) {
        setOrders(prev => {
          const prevOrderNumbers = new Set(prev.map(o => o.orderNumber).filter(Boolean));
          const prevIds = new Set(prev.map(o => o.id));
          const hasNew = serverOrders.some(
            so => !prevIds.has(so.id) && (!so.orderNumber || !prevOrderNumbers.has(so.orderNumber))
          );

          if (hasNew && isBackground) {
            playOrderAlert();
          }

          // Combine server orders with any local orders that have not synced yet
          const serverOrderNumbers = new Set(serverOrders.map(o => o.orderNumber).filter(Boolean));
          const serverIds = new Set(serverOrders.map(o => o.id));
          const localOnly = prev.filter(
            p => !serverIds.has(p.id) && (!p.orderNumber || !serverOrderNumbers.has(p.orderNumber))
          );
          return [...serverOrders, ...localOnly];
        });
        setDbConnected(true);
      }
    } catch (err) {
      if (!isBackground) console.warn('Could not refresh orders:', err);
    }
  }, []);

  // Sync with Server Database on mount
  useEffect(() => {
    let isMounted = true;
    async function loadDatabase() {
      try {
        const [serverProducts, serverOrders] = await Promise.all([
          api.getProducts(),
          api.getOrders(),
        ]);
        if (isMounted) {
          if (serverProducts && serverProducts.length > 0) {
            setProducts(serverProducts);
          }
          if (serverOrders && serverOrders.length > 0) {
            setOrders(serverOrders);
          }
          setDbConnected(true);
        }
      } catch (err) {
        console.warn('Could not sync with server DB, using local state:', err);
      }
    }
    loadDatabase();
    return () => {
      isMounted = false;
    };
  }, []);

  // UI state
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [selectedSizeFilter, setSelectedSizeFilter] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(2000);

  // Modals & Drawers
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderSuccessOpen, setIsOrderSuccessOpen] = useState(false);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [trackingInitialQuery, setTrackingInitialQuery] = useState('');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isMasterPromptOpen, setIsMasterPromptOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Live polling: every 3s if Admin is open/logged in, every 6s otherwise
  useEffect(() => {
    const pollInterval = isAdminOpen || isAdminLoggedIn ? 3000 : 6000;
    const interval = setInterval(() => {
      refreshOrdersFromServer(true);
    }, pollInterval);

    return () => clearInterval(interval);
  }, [isAdminOpen, isAdminLoggedIn, refreshOrdersFromServer]);

  // Window focus & visibility listener: immediately sync latest orders when user returns to tab
  useEffect(() => {
    const handleSync = () => {
      if (!document.hidden) {
        refreshOrdersFromServer(true);
      }
    };
    window.addEventListener('focus', handleSync);
    document.addEventListener('visibilitychange', handleSync);
    return () => {
      window.removeEventListener('focus', handleSync);
      document.removeEventListener('visibilitychange', handleSync);
    };
  }, [refreshOrdersFromServer]);

  // When admin modal is opened, trigger immediate refresh
  useEffect(() => {
    if (isAdminOpen) {
      refreshOrdersFromServer(false);
    }
  }, [isAdminOpen, refreshOrdersFromServer]);

  // Real-Time Cross-Device SSE Order Listener
  useEffect(() => {
    let es: EventSource | null = null;
    let reconnectTimeout: any = null;

    const connectSSE = () => {
      try {
        es = new EventSource('/api/orders/stream');
        es.onmessage = (event) => {
          try {
            const payload = JSON.parse(event.data);
            if (payload.event === 'ORDER_CREATED' && payload.data) {
              const newOrder: Order = payload.data;
              setOrders((prev) => {
                const exists = prev.some(
                  (o) => o.id === newOrder.id || (o.orderNumber && o.orderNumber === newOrder.orderNumber)
                );
                if (exists) return prev;
                playOrderAlert();
                return [newOrder, ...prev];
              });
            } else if (payload.event === 'ORDER_UPDATED' && payload.data) {
              const updated: Order = payload.data;
              setOrders((prev) =>
                prev.map((o) =>
                  o.id === updated.id || (o.orderNumber && o.orderNumber === updated.orderNumber) ? updated : o
                )
              );
            } else if (payload.event === 'ORDER_DELETED' && payload.data) {
              const { id } = payload.data;
              setOrders((prev) => prev.filter((o) => o.id !== id && o.orderNumber !== id));
            } else if (payload.event === 'DATABASE_RESET') {
              refreshOrdersFromServer(false);
            }
          } catch {
            // Heartbeat or ping
          }
        };

        es.onerror = () => {
          if (es) {
            es.close();
            es = null;
          }
          reconnectTimeout = setTimeout(connectSSE, 4000);
        };
      } catch (err) {
        console.warn('SSE stream error:', err);
      }
    };

    connectSSE();

    return () => {
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (es) es.close();
    };
  }, [refreshOrdersFromServer]);

  // Secret Admin Access (Ctrl+Shift+A, URL parameter ?admin=1, or #admin)
  useEffect(() => {
    const checkUrlForAdmin = () => {
      const params = new URLSearchParams(window.location.search);
      if (params.get('admin') === '1' || params.get('admin') === 'true' || window.location.hash === '#admin') {
        setIsAdminOpen(true);
      }
    };
    checkUrlForAdmin();
    window.addEventListener('hashchange', checkUrlForAdmin);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', checkUrlForAdmin);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Coupon
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);

  // Ref to catalog
  const catalogRef = useRef<HTMLDivElement>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('tc_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('tc_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('tc_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('tc_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Cart operations
  const handleAddToCart = (product: Product, size: ProductSize, quantity = 1, color?: string) => {
    const itemKey = `${product.id}-${size}-${color || 'def'}`;
    setCart((prev) => {
      const existing = prev.find(item => item.id === itemKey);
      if (existing) {
        return prev.map(item =>
          item.id === itemKey
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { id: itemKey, product, selectedSize: size, selectedColor: color, quantity }];
    });
  };

  const handleUpdateCartQty = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(itemId);
      return;
    }
    setCart((prev) =>
      prev.map(item => item.id === itemId ? { ...item, quantity: newQty } : item)
    );
  };

  const handleRemoveCartItem = (itemId: string) => {
    setCart(prev => prev.filter(i => i.id !== itemId));
  };

  // Buy Now direct trigger
  const handleBuyNow = (product: Product, size: ProductSize, quantity = 1, color?: string) => {
    handleAddToCart(product, size, quantity, color);
    setSelectedProductForDetail(null);
    setIsCheckoutOpen(true);
  };

  // Wishlist toggle
  const handleToggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isWishlisted = (productId: string) => wishlist.some(p => p.id === productId);

  // Coupon handling
  const handleApplyCoupon = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (clean === 'DISCOUNT10' || clean === 'EID2026') {
      const sub = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
      const discount = Math.round(sub * 0.1);
      setAppliedCoupon(clean);
      setCouponDiscount(discount);
      return true;
    }
    return false;
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
  };

  // Update discount if cart changes
  useEffect(() => {
    if (appliedCoupon) {
      const sub = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
      setCouponDiscount(Math.round(sub * 0.1));
    }
  }, [cart, appliedCoupon]);

  // Order Placement
  const handleOrderSuccess = async (newOrder: Order) => {
    // 1. Persist to Server Database (with retry)
    const saved = await api.createOrder(newOrder);
    if (!saved) {
      throw new Error('অর্ডারটি সার্ভার ডাটাবেসে সেভ করা সম্ভব হয়নি। অনুগ্রহ করে ইন্টারনেট সংযোগ চেক করে আবার চেষ্টা করুন।');
    }

    // 2. Update state and UI
    setOrders(prev => {
      const others = prev.filter(o => o.id !== saved.id && o.orderNumber !== saved.orderNumber);
      return [saved, ...others];
    });
    setCart([]);
    handleRemoveCoupon();
    setLastPlacedOrder(saved);
    setIsOrderSuccessOpen(true);
    playOrderAlert();
  };

  // Admin Actions (Requested credentials: FORHAD1 / 123456)
  const handleAdminLogin = (id: string, pass: string): boolean => {
    if (id.trim().toUpperCase() === 'FORHAD1' && pass === '123456') {
      setIsAdminLoggedIn(true);
      localStorage.setItem('tc_admin_session', 'true');
      return true;
    }
    return false;
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('tc_admin_session');
  };

  const handleAddProduct = (newProd: Omit<Product, 'id' | 'createdAt'>) => {
    const fullProd: Product = {
      ...newProd,
      id: 'prod-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setProducts(prev => [fullProd, ...prev]);
    // Persist to Server Database
    api.createProduct(fullProd).catch(err => console.error('Error creating product in DB:', err));
  };

  const handleUpdateProduct = (updated: Product) => {
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
    // Persist to Server Database
    api.updateProduct(updated.id, updated).catch(err => console.error('Error updating product in DB:', err));
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    setCart(prev => prev.filter(c => c.product.id !== productId));
    // Persist to Server Database
    api.deleteProduct(productId).catch(err => console.error('Error deleting product from DB:', err));
  };

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    // 1. Optimistic UI update
    setOrders(prev =>
      prev.map(o => (o.id === orderId || o.orderNumber === orderId ? { ...o, status } : o))
    );

    // 2. Persist to Server Database and re-apply confirmed record
    try {
      const updated = await api.updateOrderStatus(orderId, status);
      if (updated) {
        setOrders(prev =>
          prev.map(o => (o.id === updated.id || o.orderNumber === updated.orderNumber ? updated : o))
        );
      }
    } catch (err) {
      console.error('Error updating order status in DB:', err);
    }
  };

  const handleAddOrder = async (newOrder: Order) => {
    // 1. Optimistic UI update
    setOrders(prev => [newOrder, ...prev.filter(o => o.id !== newOrder.id && o.orderNumber !== newOrder.orderNumber)]);
    playOrderAlert();

    // 2. Persist to Server Database
    try {
      const saved = await api.createOrder(newOrder);
      if (saved) {
        setOrders(prev => [saved, ...prev.filter(o => o.id !== saved.id && o.orderNumber !== saved.orderNumber)]);
      }
    } catch (err) {
      console.error('Error adding manual order in DB:', err);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId && o.orderNumber !== orderId));
    try {
      await api.deleteOrder(orderId);
    } catch (err) {
      console.error('Error deleting order in DB:', err);
    }
  };

  const handleResetData = async () => {
    try {
      await fetch('/api/reset-db', { method: 'POST' });
    } catch (e) {
      console.error('Error resetting DB:', e);
    }
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_DEMO_ORDERS);
    localStorage.removeItem('tc_products');
    localStorage.removeItem('tc_orders');
  };

  // Scroll to catalog
  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Filter & Search Logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesBn = p.titleBn?.toLowerCase().includes(q) || false;
        const matchesCat = p.category.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        if (!matchesTitle && !matchesBn && !matchesCat && !matchesDesc) {
          return false;
        }
      }
      // Size filter
      if (selectedSizeFilter !== 'all') {
        if (!p.sizes.includes(selectedSizeFilter as ProductSize)) {
          return false;
        }
      }
      // Price filter
      if (p.price > maxPrice) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (selectedSort === 'price-low') return a.price - b.price;
      if (selectedSort === 'price-high') return b.price - a.price;
      if (selectedSort === 'rating') return b.rating - a.rating;
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [products, selectedCategory, searchQuery, selectedSizeFilter, maxPrice, selectedSort]);

  const totalCartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#0c0d10] text-[#f3f4f6] flex flex-col selection:bg-amber-500 selection:text-black">
      
      {/* Navbar */}
      <Navbar
        cartCount={totalCartItemCount}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenTrackOrder={() => {
          setTrackingInitialQuery('');
          setIsTrackerOpen(true);
        }}
        onOpenMasterPrompt={() => setIsMasterPromptOpen(true)}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          scrollToCatalog();
        }}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (q) scrollToCatalog();
        }}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* Hero Section */}
      <Hero
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          scrollToCatalog();
        }}
        onExploreClick={scrollToCatalog}
      />

      {/* Main Catalog Section */}
      <main ref={catalogRef} className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-8">
        
        {/* Filter & Sorting Toolbar */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
            
            {/* Title & Count */}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
                  {selectedCategory === 'all' ? 'সকল কালেকশন (All Collections)' : 
                   selectedCategory === 'dropshoulder' ? 'ড্রপ শোল্ডার টি-শার্ট (Drop Shoulder)' :
                   selectedCategory === 'jersey' ? 'স্পোর্টস জার্সি (Pro Kits & Retro)' :
                   selectedCategory === 'hoodie' ? 'হেভিওয়েট উইন্টার হুডি (Hoodies)' :
                   '১০০% কম্বড কটন টি-শার্ট (Crewneck Tees)'}
                </h2>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white/5 text-amber-400">
                  {filteredProducts.length} টি প্রোডাক্ট
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                ঢাকার ভেতর দ্রুত ডেলিভারি · সাইজ পরিবর্তন সুবিধা · ক্যাশ অন ডেলিভারি
              </p>
            </div>

            {/* Sorting & Filter Controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              
              {/* Category Segmented Tabs */}
              <div className="flex items-center gap-1 bg-[#13161c] p-1 rounded-xl border border-white/10 text-xs">
                {(['all', 'dropshoulder', 'jersey', 'hoodie', 'tshirt'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition capitalize ${
                      selectedCategory === cat
                        ? 'bg-amber-500 text-black font-bold shadow-sm'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {cat === 'all' ? 'All' : cat === 'dropshoulder' ? 'Drop Shoulder' : cat}
                  </button>
                ))}
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-1.5 bg-[#13161c] px-3 py-1.5 rounded-xl border border-white/10 text-xs">
                <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500" />
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value as any)}
                  className="bg-transparent text-zinc-300 focus:outline-none cursor-pointer"
                >
                  <option value="featured" className="bg-[#181a22] text-white">ফিচার্ড (Featured)</option>
                  <option value="price-low" className="bg-[#181a22] text-white">মূল্য: কম থেকে বেশি</option>
                  <option value="price-high" className="bg-[#181a22] text-white">মূল্য: বেশি থেকে কম</option>
                  <option value="rating" className="bg-[#181a22] text-white">টপ রেটেড (Rating)</option>
                </select>
              </div>

            </div>

          </div>

          {/* Secondary Filter Chips (Size Filter & Price Slider) */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            
            {/* Size Filter Pills */}
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-500 font-medium">সাইজ ফিল্টার:</span>
              {['all', 'S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSizeFilter(sz)}
                  className={`w-7 h-7 rounded-lg font-mono font-bold transition flex items-center justify-center text-xs ${
                    selectedSizeFilter === sz
                      ? 'bg-amber-400 text-black'
                      : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {sz === 'all' ? 'All' : sz}
                </button>
              ))}
            </div>

            {/* Price Max Filter */}
            <div className="flex items-center gap-3 bg-white/5 px-3 py-1.5 rounded-xl">
              <span className="text-zinc-400 text-[11px]">সর্বোচ্চ বাজেট:</span>
              <input
                type="range"
                min="400"
                max="2000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-24 sm:w-32 accent-amber-400 cursor-pointer"
              />
              <span className="font-mono font-bold text-amber-400 text-xs">৳{maxPrice}</span>
            </div>

          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center space-y-4 rounded-3xl bg-[#12141a] border border-white/5 p-8">
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto text-zinc-500">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">কোনো পণ্য পাওয়া যায়নি</h3>
              <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                আপনার দেওয়া সার্চ বা ফিল্টারের সাথে মিলছে না। অনুগ্রহ করে ফিল্টার রিসেট করুন।
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setSelectedSizeFilter('all');
                setMaxPrice(2000);
              }}
              className="px-4 py-2 rounded-xl bg-amber-500 text-black text-xs font-bold hover:bg-amber-400 transition"
            >
              সব ফিল্টার রিসেট করুন
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setSelectedProductForDetail(p)}
                onAddToCart={(p, size) => handleAddToCart(p, size)}
                isWishlisted={isWishlisted(product.id)}
                onToggleWishlist={handleToggleWishlist}
              />
            ))}
          </div>
        )}

        {/* Streetwear Highlight Callout */}
        <section className="rounded-3xl p-6 sm:p-10 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent border border-amber-500/20 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-2">
            <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase">
              <Sparkles className="w-4 h-4" />
              <span>CUSTOM BULK & EVENT JERSEYS</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
              টুর্নামেন্ট জার্সি বা কাস্টম ড্রপ-শোল্ডার বাল্ক অর্ডার করতে চান?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl leading-relaxed">
              আপনার কলেজ, বিশ্ববিদ্যালয়, অফিস বা স্পোর্টস ক্লাবের নিজস্ব ডিজাইনে হাই-কোয়ালিটি জার্সি বা টি-শার্ট তৈরিতে আমাদের সাথে সরাসরি কথা বলুন।
            </p>
          </div>

          <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-2.5 justify-end">
            <a
              href="tel:01572923114"
              className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs text-center transition shadow-lg shadow-amber-500/20"
            >
              সরাসরি কল করুন: 01572923114
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61571997341321"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-[#1877F2]/15 hover:bg-[#1877F2]/25 text-[#1877F2] font-semibold text-xs border border-[#1877F2]/30 text-center transition flex items-center justify-center gap-2"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>ফেসবুক পেইজে ইনবক্স করুন</span>
            </a>
            {isAdminLoggedIn && (
              <button
                onClick={() => setIsMasterPromptOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-semibold text-xs border border-emerald-500/30 transition"
              >
                মাস্টার AI প্রম্পট দেখুন (Admin)
              </button>
            )}
          </div>
        </section>

      </main>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProductForDetail}
        onClose={() => setSelectedProductForDetail(null)}
        onAddToCart={(p, sz, qty, col) => handleAddToCart(p, sz, qty, col)}
        onBuyNow={(p, sz, qty, col) => handleBuyNow(p, sz, qty, col)}
        isWishlisted={selectedProductForDetail ? isWishlisted(selectedProductForDetail.id) : false}
        onToggleWishlist={handleToggleWishlist}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={handleApplyCoupon}
        onRemoveCoupon={handleRemoveCoupon}
        couponDiscount={couponDiscount}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        appliedCoupon={appliedCoupon}
        couponDiscount={couponDiscount}
        onOrderSuccess={handleOrderSuccess}
        onRemoveItem={handleRemoveCartItem}
        onUpdateQuantity={handleUpdateCartQty}
      />

      {/* Order Success & Invoice Modal */}
      <OrderSuccessModal
        order={lastPlacedOrder}
        onClose={() => setIsOrderSuccessOpen(false)}
        onTrackOrder={(ordNum) => {
          setTrackingInitialQuery(ordNum);
          setIsTrackerOpen(true);
        }}
      />

      {/* Order Live Tracker Modal */}
      <OrderTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        orders={orders}
        initialSearchQuery={trackingInitialQuery}
      />

      {/* Admin Control Panel */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        isLoggedIn={isAdminLoggedIn}
        onLogin={handleAdminLogin}
        onLogout={handleAdminLogout}
        products={products}
        orders={orders}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        onAddOrder={handleAddOrder}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onDeleteOrder={handleDeleteOrder}
        onResetData={handleResetData}
        onOpenMasterPrompt={() => setIsMasterPromptOpen(true)}
        dbConnected={dbConnected}
        onDownloadBackup={api.downloadDbBackup}
        onRefreshOrders={() => refreshOrdersFromServer(false)}
      />

      {/* Master Prompt Viewer Modal (Requested by user) */}
      <MasterPromptModal
        isOpen={isMasterPromptOpen}
        onClose={() => setIsMasterPromptOpen(false)}
      />

      {/* Wishlist Modal */}
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        onRemoveFromWishlist={(id) => setWishlist(prev => prev.filter(p => p.id !== id))}
        onAddToCart={(p, sz) => handleAddToCart(p, sz)}
      />

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          scrollToCatalog();
        }}
        onOpenTrackOrder={() => {
          setTrackingInitialQuery('');
          setIsTrackerOpen(true);
        }}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Floating Facebook Quick Chat & Hotline Badge */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2.5">
        <a
          href="https://www.facebook.com/profile.php?id=61571997341321"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2.5 bg-[#1877F2] hover:bg-[#166fe5] text-white pl-3.5 pr-4 py-2.5 rounded-full shadow-2xl shadow-blue-500/30 transition-all hover:scale-105 active:scale-95"
          title="Message OSTAD GEAR on Facebook"
        >
          <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          <span className="text-xs font-bold font-display tracking-wide">
            ফেসবুকে চ্যাট করুন
          </span>
        </a>
      </div>

    </div>
  );
}
