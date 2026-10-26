-- ====================================================================
-- STYLE HUT E-COMMERCE DATABASE INITIAL SCHEMA & SECURITY
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS & DOMAINS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('customer', 'admin', 'staff');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('Unpaid', 'Awaiting Verification', 'Paid', 'Rejected', 'Refunded');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE stock_movement_type AS ENUM ('ORDER_PLACED', 'ORDER_CANCELLED', 'MANUAL_ADJUSTMENT', 'INITIAL_STOCK');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- 3. PROFILES TABLE (Linked with Supabase Auth)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT,
    role user_role DEFAULT 'customer' NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. SAVED ADDRESSES
CREATE TABLE IF NOT EXISTS addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    recipient_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    division TEXT NOT NULL,
    district TEXT NOT NULL,
    area TEXT NOT NULL,
    street_address TEXT NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. PRODUCTS
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    sku TEXT UNIQUE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    short_description TEXT,
    description TEXT,
    base_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (base_price >= 0),
    sale_price NUMERIC(12, 2) CHECK (sale_price IS NULL OR (sale_price >= 0 AND sale_price <= base_price)),
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    is_variable BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_hot BOOLEAN DEFAULT FALSE,
    is_new BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    rating NUMERIC(2, 1) DEFAULT 5.0,
    review_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 7. PRODUCT IMAGES
CREATE TABLE IF NOT EXISTS product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    sort_order INT DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 8. PRODUCT ATTRIBUTES & VALUES
CREATE TABLE IF NOT EXISTS product_attributes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE, -- e.g. Size, Color
    code TEXT NOT NULL UNIQUE, -- e.g. size, color
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS product_attribute_values (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attribute_id UUID NOT NULL REFERENCES product_attributes(id) ON DELETE CASCADE,
    value TEXT NOT NULL, -- e.g. S, M, L, XL or Pink, Black
    display_order INT DEFAULT 0,
    UNIQUE (attribute_id, value)
);

-- 9. PRODUCT VARIANTS (Variable Products)
CREATE TABLE IF NOT EXISTS product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sku TEXT NOT NULL UNIQUE,
    title TEXT, -- e.g. "M / Pink"
    price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    sale_price NUMERIC(12, 2) CHECK (sale_price IS NULL OR (sale_price >= 0 AND sale_price <= price)),
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS variant_attribute_values (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
    attribute_id UUID NOT NULL REFERENCES product_attributes(id) ON DELETE CASCADE,
    attribute_value_id UUID NOT NULL REFERENCES product_attribute_values(id) ON DELETE CASCADE,
    UNIQUE (variant_id, attribute_id)
);

-- 10. WISHLISTS
CREATE TABLE IF NOT EXISTS wishlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE (user_id, product_id)
);

-- 11. CARTS & CART ITEMS (Database synced)
CREATE TABLE IF NOT EXISTS carts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_token TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE (cart_id, product_id, variant_id)
);

-- 12. ORDERS
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT NOT NULL UNIQUE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    guest_session_token TEXT,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    division TEXT NOT NULL,
    district TEXT NOT NULL,
    area TEXT NOT NULL,
    street_address TEXT NOT NULL,
    delivery_notes TEXT,
    subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
    delivery_charge NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (delivery_charge >= 0),
    discount_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (discount_amount >= 0),
    total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
    payment_method TEXT NOT NULL, -- 'cod', 'bkash', 'nagad', 'rocket'
    payment_status payment_status DEFAULT 'Unpaid' NOT NULL,
    order_status order_status DEFAULT 'Pending' NOT NULL,
    manual_payment_trx_id TEXT,
    manual_payment_sender_phone TEXT,
    idempotency_key TEXT UNIQUE,
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 13. ORDER ITEMS (Immutable historical snapshot)
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    variant_title TEXT,
    sku TEXT,
    unit_price NUMERIC(12, 2) NOT NULL CHECK (unit_price >= 0),
    quantity INT NOT NULL CHECK (quantity > 0),
    subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 14. PAYMENT SETTINGS
CREATE TABLE IF NOT EXISTS payment_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    method_code TEXT NOT NULL UNIQUE, -- 'cod', 'bkash', 'nagad', 'rocket'
    display_name TEXT NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE NOT NULL,
    account_number TEXT,
    account_type TEXT, -- 'Personal', 'Merchant', 'Agent'
    instructions TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 15. BANNERS
CREATE TABLE IF NOT EXISTS banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    subtitle TEXT,
    image_url TEXT NOT NULL,
    button_text TEXT DEFAULT 'Shop Now',
    destination_url TEXT DEFAULT '/products',
    badge TEXT,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    banner_type TEXT DEFAULT 'hero', -- 'hero', 'promo'
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 16. STORE SETTINGS
CREATE TABLE IF NOT EXISTS store_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 17. SOCIAL LINKS
CREATE TABLE IF NOT EXISTS social_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform TEXT NOT NULL UNIQUE,
    url TEXT NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0
);

-- 18. ORDER EVENTS (Audit Log)
CREATE TABLE IF NOT EXISTS order_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    notes TEXT,
    created_by TEXT DEFAULT 'system',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 19. STOCK MOVEMENTS (Audit Trail for inventory changes)
CREATE TABLE IF NOT EXISTS stock_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    movement_type stock_movement_type NOT NULL,
    quantity_change INT NOT NULL,
    previous_stock INT NOT NULL,
    new_stock INT NOT NULL,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 20. COUPONS
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,
    discount_type TEXT NOT NULL DEFAULT 'percentage', -- 'percentage' or 'fixed'
    discount_value NUMERIC(10, 2) NOT NULL,
    min_order_amount NUMERIC(10, 2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ====================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active_featured ON products(is_active, is_featured);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_variants_product ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_banners_active ON banners(is_active, sort_order);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_attribute_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE variant_attribute_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- Helper function: Is Current User an Admin?
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Profiles Policies
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id OR is_admin());

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- 2. Addresses Policies
CREATE POLICY "Users manage own addresses" ON addresses
    FOR ALL USING (auth.uid() = profile_id OR is_admin());

-- 3. Categories Policies (Public Read, Admin Write)
CREATE POLICY "Public read active categories" ON categories
    FOR SELECT USING (is_active = TRUE OR is_admin());

CREATE POLICY "Admin manage categories" ON categories
    FOR ALL USING (is_admin());

-- 4. Products & Images Policies (Public Read, Admin Write)
CREATE POLICY "Public read active products" ON products
    FOR SELECT USING (is_active = TRUE OR is_admin());

CREATE POLICY "Admin manage products" ON products
    FOR ALL USING (is_admin());

CREATE POLICY "Public read product images" ON product_images
    FOR SELECT USING (TRUE);

CREATE POLICY "Admin manage product images" ON product_images
    FOR ALL USING (is_admin());

-- 5. Attributes & Variants Policies
CREATE POLICY "Public read attributes" ON product_attributes FOR SELECT USING (TRUE);
CREATE POLICY "Admin manage attributes" ON product_attributes FOR ALL USING (is_admin());

CREATE POLICY "Public read attribute values" ON product_attribute_values FOR SELECT USING (TRUE);
CREATE POLICY "Admin manage attribute values" ON product_attribute_values FOR ALL USING (is_admin());

CREATE POLICY "Public read variants" ON product_variants FOR SELECT USING (is_active = TRUE OR is_admin());
CREATE POLICY "Admin manage variants" ON product_variants FOR ALL USING (is_admin());

CREATE POLICY "Public read variant attributes" ON variant_attribute_values FOR SELECT USING (TRUE);
CREATE POLICY "Admin manage variant attributes" ON variant_attribute_values FOR ALL USING (is_admin());

-- 6. Wishlist Policies
CREATE POLICY "Users manage own wishlist" ON wishlists
    FOR ALL USING (auth.uid() = user_id);

-- 7. Cart Policies
CREATE POLICY "Users manage own carts" ON carts
    FOR ALL USING (auth.uid() = user_id OR session_token IS NOT NULL);

CREATE POLICY "Cart items policy" ON cart_items
    FOR ALL USING (TRUE);

-- 8. Orders & Order Items Policies
CREATE POLICY "Users view own orders" ON orders
    FOR SELECT USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "Admin manage orders" ON orders
    FOR ALL USING (is_admin());

CREATE POLICY "Users view own order items" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = order_items.order_id
            AND (orders.user_id = auth.uid() OR is_admin())
        )
    );

CREATE POLICY "Admin manage order items" ON order_items
    FOR ALL USING (is_admin());

-- 9. Settings, Banners, Social, Coupons
CREATE POLICY "Public read payment settings" ON payment_settings FOR SELECT USING (TRUE);
CREATE POLICY "Admin manage payment settings" ON payment_settings FOR ALL USING (is_admin());

CREATE POLICY "Public read banners" ON banners FOR SELECT USING (is_active = TRUE OR is_admin());
CREATE POLICY "Admin manage banners" ON banners FOR ALL USING (is_admin());

CREATE POLICY "Public read store settings" ON store_settings FOR SELECT USING (TRUE);
CREATE POLICY "Admin manage store settings" ON store_settings FOR ALL USING (is_admin());

CREATE POLICY "Public read social links" ON social_links FOR SELECT USING (TRUE);
CREATE POLICY "Admin manage social links" ON social_links FOR ALL USING (is_admin());

CREATE POLICY "Public read active coupons" ON coupons FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Admin manage coupons" ON coupons FOR ALL USING (is_admin());

CREATE POLICY "Admin view stock movements" ON stock_movements FOR ALL USING (is_admin());
CREATE POLICY "Admin view order events" ON order_events FOR ALL USING (is_admin());

-- ====================================================================
-- ATOMIC STORE PROCEDURES (Edge / Database RPC Functions)
-- ====================================================================

-- A. Secure Order Creation RPC (Atomically validates price, stock, deducts inventory, records order)
CREATE OR REPLACE FUNCTION create_order_secure(
    p_customer_name TEXT,
    p_customer_phone TEXT,
    p_customer_email TEXT,
    p_division TEXT,
    p_district TEXT,
    p_area TEXT,
    p_street_address TEXT,
    p_delivery_notes TEXT,
    p_payment_method TEXT,
    p_manual_trx_id TEXT DEFAULT NULL,
    p_manual_sender_phone TEXT DEFAULT NULL,
    p_delivery_charge NUMERIC DEFAULT 60.00,
    p_coupon_code TEXT DEFAULT NULL,
    p_items JSONB DEFAULT '[]'::JSONB,
    p_idempotency_key TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_order_id UUID;
    v_order_number TEXT;
    v_subtotal NUMERIC(12, 2) := 0.00;
    v_discount NUMERIC(12, 2) := 0.00;
    v_total NUMERIC(12, 2) := 0.00;
    v_item JSONB;
    v_prod RECORD;
    v_var RECORD;
    v_item_price NUMERIC(12, 2);
    v_item_qty INT;
    v_item_subtotal NUMERIC(12, 2);
    v_user_id UUID := auth.uid();
    v_initial_pay_status payment_status;
BEGIN
    -- Idempotency check: if order with this key exists, return it
    IF p_idempotency_key IS NOT NULL THEN
        SELECT id, order_number INTO v_order_id, v_order_number
        FROM orders WHERE idempotency_key = p_idempotency_key;

        IF FOUND THEN
            RETURN jsonb_build_object(
                'success', true,
                'order_id', v_order_id,
                'order_number', v_order_number,
                'message', 'Order already placed.'
            );
        END IF;
    END IF;

    -- Generate human-friendly Order Number, e.g. SH-892104
    v_order_number := 'SH-' || LPAD((FLOOR(RANDOM() * 900000 + 100000))::TEXT, 6, '0');

    -- Determine Initial Payment Status
    IF p_payment_method = 'cod' THEN
        v_initial_pay_status := 'Unpaid';
    ELSE
        v_initial_pay_status := 'Awaiting Verification';
    END IF;

    -- Validate items array
    IF jsonb_array_length(p_items) = 0 THEN
        RAISE EXCEPTION 'Order must contain at least one item';
    END IF;

    -- First Pass: Verify Prices and Stock Atomically with row locking
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
        v_item_qty := (v_item->>'quantity')::INT;
        IF v_item_qty <= 0 THEN
            RAISE EXCEPTION 'Invalid item quantity';
        END IF;

        IF (v_item->>'variant_id') IS NOT NULL AND (v_item->>'variant_id') <> '' THEN
            -- Variable Product: Lock variant row
            SELECT * INTO v_var
            FROM product_variants
            WHERE id = (v_item->>'variant_id')::UUID AND is_active = TRUE
            FOR UPDATE;

            IF NOT FOUND THEN
                RAISE EXCEPTION 'Product variant not found or inactive';
            END IF;

            IF v_var.stock_quantity < v_item_qty THEN
                RAISE EXCEPTION 'Insufficient stock for variant % (available: %)', v_var.sku, v_var.stock_quantity;
            END IF;

            v_item_price := COALESCE(v_var.sale_price, v_var.price);
        ELSE
            -- Simple Product: Lock product row
            SELECT * INTO v_prod
            FROM products
            WHERE id = (v_item->>'product_id')::UUID AND is_active = TRUE
            FOR UPDATE;

            IF NOT FOUND THEN
                RAISE EXCEPTION 'Product not found or inactive';
            END IF;

            IF v_prod.stock_quantity < v_item_qty THEN
                RAISE EXCEPTION 'Insufficient stock for % (available: %)', v_prod.name, v_prod.stock_quantity;
            END IF;

            v_item_price := COALESCE(v_prod.sale_price, v_prod.base_price);
        END IF;

        v_item_subtotal := v_item_price * v_item_qty;
        v_subtotal := v_subtotal + v_item_subtotal;
    END LOOP;

    -- Coupon Calculation (if coupon provided)
    IF p_coupon_code IS NOT NULL AND TRIM(p_coupon_code) <> '' THEN
        DECLARE
            v_coupon RECORD;
        BEGIN
            SELECT * INTO v_coupon FROM coupons
            WHERE code = UPPER(TRIM(p_coupon_code))
              AND is_active = TRUE
              AND (expires_at IS NULL OR expires_at > NOW());

            IF FOUND AND v_subtotal >= v_coupon.min_order_amount THEN
                IF v_coupon.discount_type = 'percentage' THEN
                    v_discount := ROUND((v_subtotal * (v_coupon.discount_value / 100.0)), 2);
                ELSE
                    v_discount := LEAST(v_coupon.discount_value, v_subtotal);
                END IF;
            END IF;
        END;
    END IF;

    -- Final calculation
    v_total := (v_subtotal - v_discount) + p_delivery_charge;

    -- Insert Order
    INSERT INTO orders (
        order_number, user_id, customer_name, customer_phone, customer_email,
        division, district, area, street_address, delivery_notes,
        subtotal, delivery_charge, discount_amount, total_amount,
        payment_method, payment_status, order_status,
        manual_payment_trx_id, manual_payment_sender_phone, idempotency_key
    ) VALUES (
        v_order_number, v_user_id, p_customer_name, p_customer_phone, p_customer_email,
        p_division, p_district, p_area, p_street_address, p_delivery_notes,
        v_subtotal, p_delivery_charge, v_discount, v_total,
        p_payment_method, v_initial_pay_status, 'Pending',
        p_manual_trx_id, p_manual_sender_phone, p_idempotency_key
    ) RETURNING id INTO v_order_id;

    -- Insert Order Items and Update Inventory Atomically
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
        v_item_qty := (v_item->>'quantity')::INT;

        IF (v_item->>'variant_id') IS NOT NULL AND (v_item->>'variant_id') <> '' THEN
            SELECT * INTO v_var FROM product_variants WHERE id = (v_item->>'variant_id')::UUID;
            SELECT * INTO v_prod FROM products WHERE id = v_var.product_id;

            v_item_price := COALESCE(v_var.sale_price, v_var.price);
            v_item_subtotal := v_item_price * v_item_qty;

            -- Insert Line Item
            INSERT INTO order_items (
                order_id, product_id, variant_id, product_name, variant_title,
                sku, unit_price, quantity, subtotal, image_url
            ) VALUES (
                v_order_id, v_prod.id, v_var.id, v_prod.name, v_var.title,
                v_var.sku, v_item_price, v_item_qty, v_item_subtotal,
                COALESCE(v_var.image_url, (SELECT image_url FROM product_images WHERE product_id = v_prod.id ORDER BY is_primary DESC, sort_order ASC LIMIT 1))
            );

            -- Deduct stock
            UPDATE product_variants
            SET stock_quantity = stock_quantity - v_item_qty, updated_at = NOW()
            WHERE id = v_var.id;

            -- Record stock movement
            INSERT INTO stock_movements (
                product_id, variant_id, order_id, movement_type,
                quantity_change, previous_stock, new_stock, reason
            ) VALUES (
                v_prod.id, v_var.id, v_order_id, 'ORDER_PLACED',
                -v_item_qty, v_var.stock_quantity, v_var.stock_quantity - v_item_qty,
                'Order #' || v_order_number
            );
        ELSE
            SELECT * INTO v_prod FROM products WHERE id = (v_item->>'product_id')::UUID;

            v_item_price := COALESCE(v_prod.sale_price, v_prod.base_price);
            v_item_subtotal := v_item_price * v_item_qty;

            -- Insert Line Item
            INSERT INTO order_items (
                order_id, product_id, variant_id, product_name, variant_title,
                sku, unit_price, quantity, subtotal, image_url
            ) VALUES (
                v_order_id, v_prod.id, NULL, v_prod.name, NULL,
                v_prod.sku, v_item_price, v_item_qty, v_item_subtotal,
                (SELECT image_url FROM product_images WHERE product_id = v_prod.id ORDER BY is_primary DESC, sort_order ASC LIMIT 1)
            );

            -- Deduct stock
            UPDATE products
            SET stock_quantity = stock_quantity - v_item_qty, updated_at = NOW()
            WHERE id = v_prod.id;

            -- Record stock movement
            INSERT INTO stock_movements (
                product_id, variant_id, order_id, movement_type,
                quantity_change, previous_stock, new_stock, reason
            ) VALUES (
                v_prod.id, NULL, v_order_id, 'ORDER_PLACED',
                -v_item_qty, v_prod.stock_quantity, v_prod.stock_quantity - v_item_qty,
                'Order #' || v_order_number
            );
        END IF;
    END LOOP;

    -- Record initial order event
    INSERT INTO order_events (order_id, status, notes, created_by)
    VALUES (v_order_id, 'Pending', 'Order created by customer. Payment method: ' || p_payment_method, 'customer');

    RETURN jsonb_build_object(
        'success', true,
        'order_id', v_order_id,
        'order_number', v_order_number,
        'subtotal', v_subtotal,
        'delivery_charge', p_delivery_charge,
        'discount', v_discount,
        'total', v_total,
        'payment_status', v_initial_pay_status,
        'message', 'Order placed successfully!'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- B. Cancellation & Stock Restoration RPC (Admin)
CREATE OR REPLACE FUNCTION cancel_order_and_restore_stock(
    p_order_id UUID,
    p_reason TEXT DEFAULT 'Cancelled by admin'
)
RETURNS JSONB AS $$
DECLARE
    v_order RECORD;
    v_item RECORD;
    v_current_stock INT;
BEGIN
    SELECT * INTO v_order FROM orders WHERE id = p_order_id FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Order not found');
    END IF;

    IF v_order.order_status = 'Cancelled' THEN
        RETURN jsonb_build_object('success', false, 'message', 'Order is already cancelled');
    END IF;

    -- Update Order Status
    UPDATE orders
    SET order_status = 'Cancelled', updated_at = NOW()
    WHERE id = p_order_id;

    -- Restore Stock for all items
    FOR v_item IN SELECT * FROM order_items WHERE order_id = p_order_id LOOP
        IF v_item.variant_id IS NOT NULL THEN
            SELECT stock_quantity INTO v_current_stock FROM product_variants WHERE id = v_item.variant_id FOR UPDATE;
            UPDATE product_variants
            SET stock_quantity = stock_quantity + v_item.quantity, updated_at = NOW()
            WHERE id = v_item.variant_id;

            INSERT INTO stock_movements (
                product_id, variant_id, order_id, movement_type,
                quantity_change, previous_stock, new_stock, reason
            ) VALUES (
                v_item.product_id, v_item.variant_id, p_order_id, 'ORDER_CANCELLED',
                v_item.quantity, v_current_stock, v_current_stock + v_item.quantity,
                p_reason
            );
        ELSE
            SELECT stock_quantity INTO v_current_stock FROM products WHERE id = v_item.product_id FOR UPDATE;
            UPDATE products
            SET stock_quantity = stock_quantity + v_item.quantity, updated_at = NOW()
            WHERE id = v_item.product_id;

            INSERT INTO stock_movements (
                product_id, variant_id, order_id, movement_type,
                quantity_change, previous_stock, new_stock, reason
            ) VALUES (
                v_item.product_id, NULL, p_order_id, 'ORDER_CANCELLED',
                v_item.quantity, v_current_stock, v_current_stock + v_item.quantity,
                p_reason
            );
        END IF;
    END LOOP;

    -- Add Order Event
    INSERT INTO order_events (order_id, status, notes, created_by)
    VALUES (p_order_id, 'Cancelled', p_reason, 'admin');

    RETURN jsonb_build_object('success', true, 'message', 'Order cancelled and stock restored successfully');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- C. Secure Guest/Customer Order Tracking RPC
CREATE OR REPLACE FUNCTION track_order(
    p_order_number TEXT,
    p_phone TEXT
)
RETURNS JSONB AS $$
DECLARE
    v_order RECORD;
    v_items JSONB;
BEGIN
    SELECT * INTO v_order
    FROM orders
    WHERE UPPER(order_number) = UPPER(TRIM(p_order_number))
      AND customer_phone = TRIM(p_phone);

    IF NOT FOUND THEN
        RETURN jsonb_build_object('found', false, 'message', 'No matching order found with the provided details.');
    END IF;

    SELECT jsonb_agg(
        jsonb_build_object(
            'product_name', product_name,
            'variant_title', variant_title,
            'unit_price', unit_price,
            'quantity', quantity,
            'subtotal', subtotal,
            'image_url', image_url
        )
    ) INTO v_items
    FROM order_items
    WHERE order_id = v_order.id;

    RETURN jsonb_build_object(
        'found', true,
        'order', jsonb_build_object(
            'order_number', v_order.order_number,
            'customer_name', v_order.customer_name,
            'created_at', v_order.created_at,
            'order_status', v_order.order_status,
            'payment_status', v_order.payment_status,
            'payment_method', v_order.payment_method,
            'subtotal', v_order.subtotal,
            'delivery_charge', v_order.delivery_charge,
            'discount_amount', v_order.discount_amount,
            'total_amount', v_order.total_amount,
            'delivery_address', v_order.street_address || ', ' || v_order.area || ', ' || v_order.district || ', ' || v_order.division,
            'items', COALESCE(v_items, '[]'::JSONB)
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
