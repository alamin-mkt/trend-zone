// ====================================================================
// TREND ZONE TYPE DEFINITIONS
// ====================================================================

export type UserRole = 'customer' | 'admin' | 'staff';

export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export type PaymentStatus = 'Unpaid' | 'Awaiting Verification' | 'Paid' | 'Rejected' | 'Refunded';

export type PaymentMethodCode = 'cod' | 'bkash' | 'nagad' | 'rocket';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
}

export interface Address {
  id: string;
  profile_id: string;
  recipient_name: string;
  phone: string;
  division: string;
  district: string;
  area: string;
  street_address: string;
  is_default: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text?: string;
  sort_order: number;
  is_primary: boolean;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  title: string; // e.g. "Pink / M"
  price: number;
  sale_price?: number | null;
  stock_quantity: number;
  image_url?: string;
  is_active: boolean;
  attributes?: Record<string, string>; // { size: 'M', color: 'Pink' }
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category_id?: string;
  category?: Category;
  short_description?: string;
  description: string;
  base_price: number;
  sale_price?: number | null;
  stock_quantity: number;
  is_variable: boolean;
  is_featured: boolean;
  is_hot: boolean;
  is_new: boolean;
  is_active: boolean;
  rating: number;
  review_count: number;
  images: ProductImage[];
  variants?: ProductVariant[];
  created_at: string;
  updated_at?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  variantId?: string;
  variant?: ProductVariant;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string;
  variant_id?: string;
  product_name: string;
  variant_title?: string;
  sku?: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
  image_url?: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id?: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  division: string;
  district: string;
  area: string;
  street_address: string;
  delivery_notes?: string;
  subtotal: number;
  delivery_charge: number;
  discount_amount: number;
  total_amount: number;
  payment_method: PaymentMethodCode;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  manual_payment_trx_id?: string;
  manual_payment_sender_phone?: string;
  admin_notes?: string;
  created_at: string;
  updated_at?: string;
  items?: OrderItem[];
}

export interface PaymentSetting {
  id: string;
  method_code: PaymentMethodCode;
  display_name: string;
  is_enabled: boolean;
  account_number?: string;
  account_type?: string;
  instructions?: string;
  sort_order: number;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  image_url: string;
  button_text: string;
  destination_url: string;
  badge?: string;
  sort_order: number;
  is_active: boolean;
  banner_type: 'hero' | 'promo';
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  is_enabled: boolean;
  sort_order: number;
}

export interface StoreGeneralSettings {
  store_name: string;
  store_tagline: string;
  currency: string;
  currency_symbol: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  logo_url: string;
  delivery_inside_dhaka: number;
  delivery_outside_dhaka: number;
  free_delivery_threshold: number;
  announcement_text?: string;
}

export interface StorePolicies {
  return_policy: string;
  privacy_policy: string;
  terms_and_conditions: string;
}

export interface StockMovement {
  id: string;
  product_id: string;
  variant_id?: string;
  order_id?: string;
  movement_type: 'ORDER_PLACED' | 'ORDER_CANCELLED' | 'MANUAL_ADJUSTMENT' | 'INITIAL_STOCK';
  quantity_change: number;
  previous_stock: number;
  new_stock: number;
  reason?: string;
  created_at: string;
  product_name?: string;
  variant_title?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount: number;
  is_active: boolean;
  expires_at?: string;
}
