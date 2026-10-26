// ====================================================================
// TREND ZONE UNIFIED DATA SERVICE (Supabase + Resilient Local Persistence)
// ====================================================================

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  Category,
  Product,
  ProductVariant,
  Banner,
  PaymentSetting,
  StoreGeneralSettings,
  StorePolicies,
  Order,
  OrderStatus,
  PaymentStatus,
  StockMovement,
  Coupon
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_BANNERS,
  INITIAL_PAYMENT_SETTINGS,
  INITIAL_STORE_SETTINGS,
  INITIAL_POLICIES,
  INITIAL_ORDERS,
  INITIAL_STOCK_MOVEMENTS
} from './mockData';

const STORAGE_KEYS = {
  CATEGORIES: 'tz_categories_v1',
  PRODUCTS: 'tz_products_v1',
  BANNERS: 'tz_banners_v1',
  PAYMENTS: 'tz_payments_v1',
  STORE_SETTINGS: 'tz_store_settings_v1',
  POLICIES: 'tz_policies_v1',
  ORDERS: 'tz_orders_v1',
  STOCK_MOVEMENTS: 'tz_stock_movements_v1',
};

// Safe LocalStorage helpers
function getStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Storage error:', err);
  }
}

export const DataService = {
  // -------------------------------------------------------------
  // CATEGORIES
  // -------------------------------------------------------------
  async getCategories(): Promise<Category[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });
      if (!error && data && data.length > 0) return data as Category[];
    }
    const categories = getStored<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    return categories.sort((a, b) => a.sort_order - b.sort_order);
  },

  async saveCategory(category: Partial<Category>): Promise<Category> {
    const categories = getStored<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    let saved: Category;

    if (category.id) {
      const index = categories.findIndex(c => c.id === category.id);
      if (index !== -1) {
        categories[index] = { ...categories[index], ...category } as Category;
        saved = categories[index];
      } else {
        saved = {
          id: category.id,
          name: category.name || '',
          slug: category.slug || '',
          sort_order: category.sort_order || 0,
          is_active: category.is_active ?? true,
          ...category
        } as Category;
        categories.push(saved);
      }
    } else {
      saved = {
        id: `cat-${Date.now()}`,
        name: category.name || '',
        slug: category.slug || (category.name || '').toLowerCase().replace(/\s+/g, '-'),
        description: category.description || '',
        image_url: category.image_url || '',
        sort_order: category.sort_order ?? categories.length + 1,
        is_active: category.is_active ?? true,
        created_at: new Date().toISOString(),
      };
      categories.push(saved);
    }

    setStored(STORAGE_KEYS.CATEGORIES, categories);

    if (isSupabaseConfigured() && supabase) {
      await supabase.from('categories').upsert(saved);
    }

    return saved;
  },

  async deleteCategory(id: string): Promise<boolean> {
    const categories = getStored<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    const updated = categories.filter(c => c.id !== id);
    setStored(STORAGE_KEYS.CATEGORIES, updated);

    if (isSupabaseConfigured() && supabase) {
      await supabase.from('categories').delete().eq('id', id);
    }
    return true;
  },

  // -------------------------------------------------------------
  // PRODUCTS
  // -------------------------------------------------------------
  async getProducts(params?: {
    categorySlug?: string;
    searchQuery?: string;
    isFeatured?: boolean;
    isHot?: boolean;
    isNew?: boolean;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'popular';
    inStockOnly?: boolean;
  }): Promise<Product[]> {
    let products = getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);

    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase.from('products').select('*, images:product_images(*), variants:product_variants(*)');
        if (params?.categorySlug) {
          // get category id
          const { data: cat } = await supabase.from('categories').select('id').eq('slug', params.categorySlug).single();
          if (cat) query = query.eq('category_id', cat.id);
        }
        if (params?.isFeatured) query = query.eq('is_featured', true);
        if (params?.isHot) query = query.eq('is_hot', true);
        if (params?.isNew) query = query.eq('is_new', true);
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          products = data as Product[];
        }
      } catch (err) {
        console.warn('Supabase fetch failed, falling back to local dataset', err);
      }
    }

    // Attach category object if missing
    const categories = await this.getCategories();
    products = products.map(p => ({
      ...p,
      category: categories.find(c => c.id === p.category_id || c.slug === p.category_id)
    }));

    // In-memory filters
    if (params?.categorySlug) {
      products = products.filter(p => p.category?.slug === params.categorySlug || p.category_id === params.categorySlug);
    }

    if (params?.searchQuery) {
      const q = params.searchQuery.toLowerCase().trim();
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q) ||
        p.category?.name.toLowerCase().includes(q)
      );
    }

    if (params?.isFeatured) {
      products = products.filter(p => p.is_featured);
    }

    if (params?.isHot) {
      products = products.filter(p => p.is_hot);
    }

    if (params?.isNew) {
      products = products.filter(p => p.is_new);
    }

    if (params?.inStockOnly) {
      products = products.filter(p => p.stock_quantity > 0 || (p.variants && p.variants.some(v => v.stock_quantity > 0)));
    }

    if (params?.minPrice !== undefined) {
      products = products.filter(p => (p.sale_price ?? p.base_price) >= params.minPrice!);
    }

    if (params?.maxPrice !== undefined) {
      products = products.filter(p => (p.sale_price ?? p.base_price) <= params.maxPrice!);
    }

    if (params?.sortBy === 'price-asc') {
      products.sort((a, b) => (a.sale_price ?? a.base_price) - (b.sale_price ?? b.base_price));
    } else if (params?.sortBy === 'price-desc') {
      products.sort((a, b) => (b.sale_price ?? b.base_price) - (a.sale_price ?? a.base_price));
    } else if (params?.sortBy === 'popular') {
      products.sort((a, b) => (b.review_count || 0) - (a.review_count || 0));
    } else {
      // Default: newest
      products.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return products;
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    const products = await this.getProducts();
    const product = products.find(p => p.slug === slug || p.id === slug);
    return product || null;
  },

  async saveProduct(productData: Partial<Product>): Promise<Product> {
    const products = getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    let saved: Product;

    if (productData.id) {
      const idx = products.findIndex(p => p.id === productData.id);
      if (idx !== -1) {
        products[idx] = {
          ...products[idx],
          ...productData,
          updated_at: new Date().toISOString()
        } as Product;
        saved = products[idx];
      } else {
        saved = {
          ...productData,
          id: productData.id,
          created_at: new Date().toISOString()
        } as Product;
        products.push(saved);
      }
    } else {
      const id = `prod-${Date.now()}`;
      saved = {
        id,
        name: productData.name || 'Untitled Product',
        slug: productData.slug || (productData.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        sku: productData.sku || `SH-${Math.floor(1000 + Math.random() * 9000)}`,
        category_id: productData.category_id,
        short_description: productData.short_description || '',
        description: productData.description || '',
        base_price: Number(productData.base_price) || 0,
        sale_price: productData.sale_price ? Number(productData.sale_price) : null,
        stock_quantity: Number(productData.stock_quantity) || 0,
        is_variable: Boolean(productData.is_variable),
        is_featured: Boolean(productData.is_featured),
        is_hot: Boolean(productData.is_hot),
        is_new: productData.is_new ?? true,
        is_active: productData.is_active ?? true,
        rating: 5.0,
        review_count: 0,
        images: productData.images || [],
        variants: productData.variants || [],
        created_at: new Date().toISOString()
      };
      products.unshift(saved);
    }

    setStored(STORAGE_KEYS.PRODUCTS, products);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('products').upsert({
          id: saved.id,
          name: saved.name,
          slug: saved.slug,
          sku: saved.sku,
          category_id: saved.category_id,
          short_description: saved.short_description,
          description: saved.description,
          base_price: saved.base_price,
          sale_price: saved.sale_price,
          stock_quantity: saved.stock_quantity,
          is_variable: saved.is_variable,
          is_featured: saved.is_featured,
          is_hot: saved.is_hot,
          is_new: saved.is_new,
          is_active: saved.is_active,
          updated_at: new Date().toISOString()
        });
      } catch (err) {
        console.warn('Supabase product save failed:', err);
      }
    }

    return saved;
  },

  async deleteProduct(id: string): Promise<boolean> {
    const products = getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const updated = products.filter(p => p.id !== id);
    setStored(STORAGE_KEYS.PRODUCTS, updated);

    if (isSupabaseConfigured() && supabase) {
      await supabase.from('products').delete().eq('id', id);
    }
    return true;
  },

  // -------------------------------------------------------------
  // BANNERS
  // -------------------------------------------------------------
  async getBanners(type: 'hero' | 'promo' = 'hero'): Promise<Banner[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('is_active', true)
        .eq('banner_type', type)
        .order('sort_order', { ascending: true });
      if (!error && data && data.length > 0) return data as Banner[];
    }
    const banners = getStored<Banner[]>(STORAGE_KEYS.BANNERS, INITIAL_BANNERS);
    return banners
      .filter(b => b.is_active && (b.banner_type === type || (!b.banner_type && type === 'hero')))
      .sort((a, b) => a.sort_order - b.sort_order);
  },

  async getAllBanners(): Promise<Banner[]> {
    const banners = getStored<Banner[]>(STORAGE_KEYS.BANNERS, INITIAL_BANNERS);
    return banners.sort((a, b) => a.sort_order - b.sort_order);
  },

  async saveBanner(bannerData: Partial<Banner>): Promise<Banner> {
    const banners = getStored<Banner[]>(STORAGE_KEYS.BANNERS, INITIAL_BANNERS);
    let saved: Banner;

    if (bannerData.id) {
      const idx = banners.findIndex(b => b.id === bannerData.id);
      if (idx !== -1) {
        banners[idx] = { ...banners[idx], ...bannerData } as Banner;
        saved = banners[idx];
      } else {
        saved = bannerData as Banner;
        banners.push(saved);
      }
    } else {
      saved = {
        id: `ban-${Date.now()}`,
        title: bannerData.title || '',
        subtitle: bannerData.subtitle || '',
        image_url: bannerData.image_url || '',
        button_text: bannerData.button_text || 'Shop Now',
        destination_url: bannerData.destination_url || '/products',
        badge: bannerData.badge || '',
        sort_order: bannerData.sort_order ?? banners.length + 1,
        is_active: bannerData.is_active ?? true,
        banner_type: bannerData.banner_type || 'hero',
      };
      banners.push(saved);
    }

    setStored(STORAGE_KEYS.BANNERS, banners);

    if (isSupabaseConfigured() && supabase) {
      await supabase.from('banners').upsert(saved);
    }

    return saved;
  },

  async deleteBanner(id: string): Promise<boolean> {
    const banners = getStored<Banner[]>(STORAGE_KEYS.BANNERS, INITIAL_BANNERS);
    const updated = banners.filter(b => b.id !== id);
    setStored(STORAGE_KEYS.BANNERS, updated);

    if (isSupabaseConfigured() && supabase) {
      await supabase.from('banners').delete().eq('id', id);
    }
    return true;
  },

  // -------------------------------------------------------------
  // PAYMENT SETTINGS
  // -------------------------------------------------------------
  async getPaymentSettings(): Promise<PaymentSetting[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('payment_settings')
        .select('*')
        .order('sort_order', { ascending: true });
      if (!error && data && data.length > 0) return data as PaymentSetting[];
    }
    return getStored<PaymentSetting[]>(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENT_SETTINGS);
  },

  async updatePaymentSetting(setting: PaymentSetting): Promise<void> {
    const list = getStored<PaymentSetting[]>(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENT_SETTINGS);
    const idx = list.findIndex(p => p.id === setting.id || p.method_code === setting.method_code);
    if (idx !== -1) {
      list[idx] = setting;
    } else {
      list.push(setting);
    }
    setStored(STORAGE_KEYS.PAYMENTS, list);

    if (isSupabaseConfigured() && supabase) {
      await supabase.from('payment_settings').upsert(setting);
    }
  },

  // -------------------------------------------------------------
  // STORE SETTINGS & POLICIES
  // -------------------------------------------------------------
  async getStoreSettings(): Promise<StoreGeneralSettings> {
    if (isSupabaseConfigured() && supabase) {
      const { data } = await supabase.from('store_settings').select('value').eq('key', 'general').single();
      if (data?.value) return data.value as StoreGeneralSettings;
    }
    return getStored<StoreGeneralSettings>(STORAGE_KEYS.STORE_SETTINGS, INITIAL_STORE_SETTINGS);
  },

  async updateStoreSettings(settings: StoreGeneralSettings): Promise<void> {
    setStored(STORAGE_KEYS.STORE_SETTINGS, settings);
    if (isSupabaseConfigured() && supabase) {
      await supabase.from('store_settings').upsert({
        key: 'general',
        value: settings,
        updated_at: new Date().toISOString()
      });
    }
  },

  async getPolicies(): Promise<StorePolicies> {
    return getStored<StorePolicies>(STORAGE_KEYS.POLICIES, INITIAL_POLICIES);
  },

  async updatePolicies(policies: StorePolicies): Promise<void> {
    setStored(STORAGE_KEYS.POLICIES, policies);
    if (isSupabaseConfigured() && supabase) {
      await supabase.from('store_settings').upsert({
        key: 'policies',
        value: policies,
        updated_at: new Date().toISOString()
      });
    }
  },

  // -------------------------------------------------------------
  // ORDERS & SECURE CHECKOUT
  // -------------------------------------------------------------
  async getOrders(): Promise<Order[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('orders')
        .select('*, items:order_items(*)')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data as Order[];
    }
    const orders = getStored<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    return orders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async getOrderById(idOrNumber: string): Promise<Order | null> {
    const orders = await this.getOrders();
    return orders.find(o => o.id === idOrNumber || o.order_number === idOrNumber) || null;
  },

  async trackOrder(orderNumber: string, phone: string): Promise<{ found: boolean; order?: Order; message?: string }> {
    const cleanNumber = orderNumber.trim().toUpperCase();
    const cleanPhone = phone.trim().replace(/[^0-9]/g, '');

    const orders = await this.getOrders();
    const matched = orders.find(o => {
      const oNum = o.order_number.toUpperCase();
      const oPhone = o.customer_phone.replace(/[^0-9]/g, '');
      return (oNum === cleanNumber || oNum.endsWith(cleanNumber)) && (oPhone === cleanPhone || oPhone.endsWith(cleanPhone) || cleanPhone.endsWith(oPhone));
    });

    if (matched) {
      return { found: true, order: matched };
    }
    return { found: false, message: 'No matching order found for this Order Number and Phone Number.' };
  },

  // Trusted atomic order placement
  async createOrderSecure(params: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    division: string;
    district: string;
    area: string;
    streetAddress: string;
    deliveryNotes?: string;
    paymentMethod: PaymentSetting['method_code'];
    manualTrxId?: string;
    manualSenderPhone?: string;
    deliveryCharge: number;
    couponCode?: string;
    items: Array<{
      productId: string;
      variantId?: string;
      quantity: number;
    }>;
    idempotencyKey?: string;
  }): Promise<{ success: boolean; orderNumber: string; orderId: string; total: number; message: string }> {
    // 1. If Supabase RPC is available:
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.rpc('create_order_secure', {
          p_customer_name: params.customerName,
          p_customer_phone: params.customerPhone,
          p_customer_email: params.customerEmail || null,
          p_division: params.division,
          p_district: params.district,
          p_area: params.area,
          p_street_address: params.streetAddress,
          p_delivery_notes: params.deliveryNotes || null,
          p_payment_method: params.paymentMethod,
          p_manual_trx_id: params.manualTrxId || null,
          p_manual_sender_phone: params.manualSenderPhone || null,
          p_delivery_charge: params.deliveryCharge,
          p_coupon_code: params.couponCode || null,
          p_items: params.items.map(i => ({
            product_id: i.productId,
            variant_id: i.variantId || null,
            quantity: i.quantity
          })),
          p_idempotency_key: params.idempotencyKey || null
        });

        if (!error && data?.success) {
          return {
            success: true,
            orderNumber: data.order_number,
            orderId: data.order_id,
            total: data.total,
            message: 'Order placed successfully!'
          };
        }
      } catch (rpcErr) {
        console.warn('Supabase RPC call failed, using client fallback processor', rpcErr);
      }
    }

    // 2. Client-side trusted fallback processor
    const products = getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    let subtotal = 0;
    const orderItems: any[] = [];
    const orderId = `ord-${Date.now()}`;
    const orderNumber = `SH-${Math.floor(100000 + Math.random() * 900000)}`;

    // Validate stock and compute real prices from products in storage
    for (const item of params.items) {
      const prod = products.find(p => p.id === item.productId);
      if (!prod) throw new Error(`Product not found: ${item.productId}`);

      let unitPrice = prod.sale_price ?? prod.base_price;
      let variantTitle: string | undefined;
      let sku = prod.sku;
      let imageUrl = prod.images?.[0]?.image_url || '';

      if (item.variantId && prod.variants) {
        const variant = prod.variants.find(v => v.id === item.variantId);
        if (!variant) throw new Error(`Product variant not found: ${item.variantId}`);
        if (variant.stock_quantity < item.quantity) {
          throw new Error(`Insufficient stock for ${prod.name} (${variant.title}). Available: ${variant.stock_quantity}`);
        }
        unitPrice = variant.sale_price ?? variant.price;
        variantTitle = variant.title;
        sku = variant.sku;
        imageUrl = variant.image_url || imageUrl;

        // Deduct variant stock
        variant.stock_quantity -= item.quantity;
      } else {
        if (prod.stock_quantity < item.quantity) {
          throw new Error(`Insufficient stock for ${prod.name}. Available: ${prod.stock_quantity}`);
        }
        // Deduct simple stock
        prod.stock_quantity -= item.quantity;
      }

      const itemSubtotal = unitPrice * item.quantity;
      subtotal += itemSubtotal;

      orderItems.push({
        id: `oi-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        order_id: orderId,
        product_id: prod.id,
        variant_id: item.variantId,
        product_name: prod.name,
        variant_title: variantTitle,
        sku,
        unit_price: unitPrice,
        quantity: item.quantity,
        subtotal: itemSubtotal,
        image_url: imageUrl
      });
    }

    // Coupon calculation
    let discount = 0;
    if (params.couponCode) {
      const code = params.couponCode.trim().toUpperCase();
      if (code === 'STYLE10' && subtotal >= 1000) {
        discount = Math.round(subtotal * 0.10);
      } else if (code === 'STYLE200' && subtotal >= 2500) {
        discount = 200;
      } else if (code === 'EID2026' && subtotal >= 3000) {
        discount = Math.round(subtotal * 0.15);
      }
    }

    const total = subtotal - discount + params.deliveryCharge;
    const initialPaymentStatus: PaymentStatus = params.paymentMethod === 'cod' ? 'Unpaid' : 'Awaiting Verification';

    const newOrder: Order = {
      id: orderId,
      order_number: orderNumber,
      customer_name: params.customerName,
      customer_phone: params.customerPhone,
      customer_email: params.customerEmail,
      division: params.division,
      district: params.district,
      area: params.area,
      street_address: params.streetAddress,
      delivery_notes: params.deliveryNotes,
      subtotal,
      delivery_charge: params.deliveryCharge,
      discount_amount: discount,
      total_amount: total,
      payment_method: params.paymentMethod,
      payment_status: initialPaymentStatus,
      order_status: 'Pending',
      manual_payment_trx_id: params.manualTrxId,
      manual_payment_sender_phone: params.manualSenderPhone,
      created_at: new Date().toISOString(),
      items: orderItems
    };

    // Save updated products (with deducted stock)
    setStored(STORAGE_KEYS.PRODUCTS, products);

    // Save new order
    const orders = getStored<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    orders.unshift(newOrder);
    setStored(STORAGE_KEYS.ORDERS, orders);

    // Record stock movement
    const movements = getStored<StockMovement[]>(STORAGE_KEYS.STOCK_MOVEMENTS, INITIAL_STOCK_MOVEMENTS);
    for (const oi of orderItems) {
      movements.unshift({
        id: `sm-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        product_id: oi.product_id,
        variant_id: oi.variant_id,
        order_id: orderId,
        movement_type: 'ORDER_PLACED',
        quantity_change: -oi.quantity,
        previous_stock: 0,
        new_stock: 0,
        reason: `Order #${orderNumber}`,
        created_at: new Date().toISOString(),
        product_name: oi.product_name,
        variant_title: oi.variant_title
      });
    }
    setStored(STORAGE_KEYS.STOCK_MOVEMENTS, movements);

    return {
      success: true,
      orderNumber,
      orderId,
      total,
      message: 'Order placed successfully!'
    };
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
    const orders = getStored<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    const ord = orders.find(o => o.id === orderId);
    if (!ord) return false;

    // If order was already cancelled, don't allow changing
    if (ord.order_status === 'Cancelled' && status !== 'Cancelled') {
      return false;
    }

    ord.order_status = status;
    ord.updated_at = new Date().toISOString();
    setStored(STORAGE_KEYS.ORDERS, orders);

    if (isSupabaseConfigured() && supabase) {
      await supabase.from('orders').update({ order_status: status, updated_at: new Date().toISOString() }).eq('id', orderId);
    }
    return true;
  },

  async updatePaymentStatus(orderId: string, status: PaymentStatus): Promise<boolean> {
    const orders = getStored<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    const ord = orders.find(o => o.id === orderId);
    if (!ord) return false;

    ord.payment_status = status;
    ord.updated_at = new Date().toISOString();
    setStored(STORAGE_KEYS.ORDERS, orders);

    if (isSupabaseConfigured() && supabase) {
      await supabase.from('orders').update({ payment_status: status, updated_at: new Date().toISOString() }).eq('id', orderId);
    }
    return true;
  },

  async cancelOrderAndRestoreStock(orderId: string, reason: string = 'Cancelled by Admin'): Promise<boolean> {
    const orders = getStored<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    const ord = orders.find(o => o.id === orderId);
    if (!ord || ord.order_status === 'Cancelled') return false;

    // Restore stock
    const products = getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const movements = getStored<StockMovement[]>(STORAGE_KEYS.STOCK_MOVEMENTS, INITIAL_STOCK_MOVEMENTS);

    if (ord.items) {
      for (const item of ord.items) {
        const prod = products.find(p => p.id === item.product_id);
        if (prod) {
          if (item.variant_id && prod.variants) {
            const variant = prod.variants.find(v => v.id === item.variant_id);
            if (variant) {
              const prev = variant.stock_quantity;
              variant.stock_quantity += item.quantity;
              movements.unshift({
                id: `sm-${Date.now()}-${Math.random().toString(36).substring(7)}`,
                product_id: prod.id,
                variant_id: variant.id,
                order_id: ord.id,
                movement_type: 'ORDER_CANCELLED',
                quantity_change: item.quantity,
                previous_stock: prev,
                new_stock: variant.stock_quantity,
                reason: `Cancellation: ${reason}`,
                created_at: new Date().toISOString(),
                product_name: prod.name,
                variant_title: variant.title
              });
            }
          } else {
            const prev = prod.stock_quantity;
            prod.stock_quantity += item.quantity;
            movements.unshift({
              id: `sm-${Date.now()}-${Math.random().toString(36).substring(7)}`,
              product_id: prod.id,
              order_id: ord.id,
              movement_type: 'ORDER_CANCELLED',
              quantity_change: item.quantity,
              previous_stock: prev,
              new_stock: prod.stock_quantity,
              reason: `Cancellation: ${reason}`,
              created_at: new Date().toISOString(),
              product_name: prod.name
            });
          }
        }
      }
    }

    ord.order_status = 'Cancelled';
    ord.admin_notes = (ord.admin_notes ? ord.admin_notes + '\n' : '') + `[Cancelled: ${reason}]`;
    ord.updated_at = new Date().toISOString();

    setStored(STORAGE_KEYS.PRODUCTS, products);
    setStored(STORAGE_KEYS.ORDERS, orders);
    setStored(STORAGE_KEYS.STOCK_MOVEMENTS, movements);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.rpc('cancel_order_and_restore_stock', { p_order_id: orderId, p_reason: reason });
      } catch (err) {
        console.warn('RPC stock restoration failed on remote:', err);
      }
    }

    return true;
  },

  // -------------------------------------------------------------
  // INVENTORY & STOCK MOVEMENTS
  // -------------------------------------------------------------
  async getStockMovements(): Promise<StockMovement[]> {
    return getStored<StockMovement[]>(STORAGE_KEYS.STOCK_MOVEMENTS, INITIAL_STOCK_MOVEMENTS);
  },

  async adjustStock(productId: string, variantId: string | undefined, newStock: number, reason: string): Promise<boolean> {
    const products = getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const prod = products.find(p => p.id === productId);
    if (!prod) return false;

    const movements = getStored<StockMovement[]>(STORAGE_KEYS.STOCK_MOVEMENTS, INITIAL_STOCK_MOVEMENTS);

    if (variantId && prod.variants) {
      const v = prod.variants.find(varItem => varItem.id === variantId);
      if (!v) return false;
      const prev = v.stock_quantity;
      const diff = newStock - prev;
      v.stock_quantity = newStock;
      movements.unshift({
        id: `sm-${Date.now()}`,
        product_id: prod.id,
        variant_id: v.id,
        movement_type: 'MANUAL_ADJUSTMENT',
        quantity_change: diff,
        previous_stock: prev,
        new_stock: newStock,
        reason: reason || 'Manual Admin Inventory Adjustment',
        created_at: new Date().toISOString(),
        product_name: prod.name,
        variant_title: v.title
      });
    } else {
      const prev = prod.stock_quantity;
      const diff = newStock - prev;
      prod.stock_quantity = newStock;
      movements.unshift({
        id: `sm-${Date.now()}`,
        product_id: prod.id,
        movement_type: 'MANUAL_ADJUSTMENT',
        quantity_change: diff,
        previous_stock: prev,
        new_stock: newStock,
        reason: reason || 'Manual Admin Inventory Adjustment',
        created_at: new Date().toISOString(),
        product_name: prod.name
      });
    }

    setStored(STORAGE_KEYS.PRODUCTS, products);
    setStored(STORAGE_KEYS.STOCK_MOVEMENTS, movements);
    return true;
  }
};
