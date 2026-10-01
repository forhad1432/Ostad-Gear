export type ProductCategory = 'tshirt' | 'jersey' | 'dropshoulder' | 'hoodie';

export type ProductSize = 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  title: string;
  titleBn?: string;
  category: ProductCategory;
  price: number;
  originalPrice: number;
  stock: number;
  sizes: ProductSize[];
  colors: ProductColor[];
  image: string;
  additionalImages?: string[];
  description: string;
  fabricDetails: {
    gsm: number;
    composition: string;
    fit: string;
    care: string;
  };
  rating: number;
  reviewsCount: number;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  createdAt: string;
}

export interface CartItem {
  id: string; // unique item combo key: productId-size-color
  product: Product;
  selectedSize: ProductSize;
  selectedColor?: string;
  quantity: number;
}

export type PaymentMethod = 'bkash' | 'nagad' | 'rocket' | 'cod';

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  title: string;
  category: string;
  image: string;
  size: ProductSize;
  color?: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  altPhone?: string;
  district: string;
  thanaCity: string;
  address: string;
  deliveryZone: 'inside_dhaka' | 'outside_dhaka';
  deliveryFee: number;
  paymentMethod: PaymentMethod;
  paymentNumber?: string;
  trxId?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  status: OrderStatus;
  orderDate: string;
  deliveryCourier?: string;
  trackingCode?: string;
  notes?: string;
}

export interface CategoryInfo {
  id: ProductCategory;
  name: string;
  nameBn: string;
  tagline: string;
  image: string;
}
