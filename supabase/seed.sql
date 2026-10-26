-- ====================================================================
-- STYLE HUT SEED DATA
-- Bangladesh Fashion & Lifestyle Initial Catalog & Settings
-- ====================================================================

-- 1. STORE SETTINGS
INSERT INTO store_settings (key, value) VALUES
('general', '{
  "store_name": "Style Hut",
  "store_tagline": "Be Your Own Style",
  "currency": "BDT",
  "currency_symbol": "৳",
  "phone": "+880 1712 345678",
  "whatsapp": "+880 1712 345678",
  "email": "support@stylehut.com.bd",
  "address": "123, Fashion Avenue, Gulshan-2, Dhaka, Bangladesh",
  "logo_url": "/images/style-hut-logo.png",
  "delivery_inside_dhaka": 60,
  "delivery_outside_dhaka": 120,
  "free_delivery_threshold": 2000,
  "announcement_text": "Free shipping across Bangladesh on orders over ৳ 2000! Hotline: +880 1712 345678"
}'::jsonb),
('seo', '{
  "meta_title": "Style Hut | Be Your Own Style - Premier Women Fashion Bangladesh",
  "meta_description": "Shop the finest Sarees, Salwar Kameez, Kurtis, Hijabs, Designer Bags, and Beauty Products in Bangladesh. Fast home delivery and Cash on Delivery available.",
  "meta_keywords": "style hut, bangladesh fashion, sarees, kurtis, salwar kameez, women bags, bKash shopping"
}'::jsonb),
('policies', '{
  "return_policy": "We offer a 7-day hassle-free return policy for any manufacturing defects or sizing issues. Products must be unused with original tags intact.",
  "privacy_policy": "Style Hut values your privacy. Your personal information is encrypted and never shared with third parties except for delivery fulfillment.",
  "terms_and_conditions": "All prices are in Bangladeshi Taka (৳). Orders placed with Cash on Delivery will be confirmed via phone before dispatch."
}'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 2. SOCIAL LINKS
INSERT INTO social_links (platform, url, is_enabled, sort_order) VALUES
('facebook', 'https://facebook.com/stylehut.bd', TRUE, 1),
('instagram', 'https://instagram.com/stylehut.bd', TRUE, 2),
('youtube', 'https://youtube.com/@stylehutbd', TRUE, 3),
('pinterest', 'https://pinterest.com/stylehutbd', TRUE, 4)
ON CONFLICT (platform) DO UPDATE SET url = EXCLUDED.url;

-- 3. PAYMENT SETTINGS (Configurable from Admin Panel)
INSERT INTO payment_settings (method_code, display_name, is_enabled, account_number, account_type, instructions, sort_order) VALUES
('cod', 'Cash on Delivery', TRUE, NULL, NULL, 'Pay with cash upon receiving your parcel at your doorstep. Please keep the exact amount ready.', 1),
('bkash', 'bKash Manual Payment', TRUE, '01712345678', 'Personal', '1. Go to your bKash Mobile App or dial *247#\n2. Select "Send Money"\n3. Enter our bKash Number: 01712345678\n4. Enter total bill amount\n5. Enter reference: StyleHut\n6. Enter your secret PIN to confirm\n7. Copy the Transaction ID (TrxID) and paste it below.', 2),
('nagad', 'Nagad Manual Payment', TRUE, '01812345678', 'Personal', '1. Go to your Nagad Mobile App or dial *167#\n2. Select "Send Money"\n3. Enter our Nagad Number: 01812345678\n4. Enter total bill amount\n5. Enter reference: StyleHut\n6. Enter your secret PIN to confirm\n7. Copy the Transaction ID and paste it below.', 3),
('rocket', 'Rocket Manual Payment', TRUE, '01912345678-9', 'Personal', '1. Dial *322# or open Rocket App\n2. Select "Send Money"\n3. Enter our Rocket 12-digit Number: 01912345678-9\n4. Enter the exact bill amount\n5. Enter your PIN to confirm\n6. Paste the Transaction ID below.', 4)
ON CONFLICT (method_code) DO UPDATE SET
    account_number = EXCLUDED.account_number,
    instructions = EXCLUDED.instructions;

-- 4. BANNERS (Hero Slider & Promotional Cards)
INSERT INTO banners (title, subtitle, image_url, button_text, destination_url, badge, sort_order, is_active, banner_type) VALUES
('Your One Stop Shopping Destination', 'Trending Products • Fashion • Lifestyle • More', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop', 'Shop Now', '/products', 'Trending Products', 1, TRUE, 'hero'),
('Festive Eid & Wedding Luxury Collection', 'Handcrafted Jamdani & Katan Sarees with Pure Zari', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop', 'Explore Sarees', '/category/saree', 'Exclusive', 2, TRUE, 'hero'),
('Chic Designer Kurtis & Fusion Wear', 'Effortless elegance for every day boutique styling', 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1200&auto=format&fit=crop', 'View Collection', '/category/kurti', 'New Arrivals', 3, TRUE, 'hero'),
('Fashion Collection', 'Up to 50% OFF on selected designer wear', 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=600&auto=format&fit=crop', 'Shop Now', '/category/salwar-kameez', 'Up to 50% OFF', 1, TRUE, 'promo'),
('Smart Accessories', 'Latest & Best Designer Handbags & Clutches', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600&auto=format&fit=crop', 'Shop Now', '/category/bags', 'Top Rated', 2, TRUE, 'promo'),
('Beauty Essentials', 'Glow Naturally with Organic Skincare & Serums', 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=600&auto=format&fit=crop', 'Shop Now', '/category/beauty', 'Natural Care', 3, TRUE, 'promo');

-- 5. CATEGORIES
INSERT INTO categories (id, name, slug, description, image_url, sort_order, is_active) VALUES
('c0000000-0000-0000-0000-000000000001', 'Women''s Fashion', 'womens-fashion', 'Exquisite sarees, three-piece sets, kurtis and western wear', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=400&auto=format&fit=crop', 1, TRUE),
('c0000000-0000-0000-0000-000000000002', 'Saree', 'saree', 'Traditional Jamdani, Katan, Silk and Georgette Sarees', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=400&auto=format&fit=crop', 2, TRUE),
('c0000000-0000-0000-0000-000000000003', 'Salwar Kameez', 'salwar-kameez', 'Premium 3-piece sets in cotton, lawn, silk and organza', 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=400&auto=format&fit=crop', 3, TRUE),
('c0000000-0000-0000-0000-000000000004', 'Kurti', 'kurti', 'Comfortable single kurtis, tops, tunics and co-ords', 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=400&auto=format&fit=crop', 4, TRUE),
('c0000000-0000-0000-0000-000000000005', 'Hijab & Abaya', 'hijab', 'Chiffon, georgette, silk hijabs and modern modest abayas', 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=400&auto=format&fit=crop', 5, TRUE),
('c0000000-0000-0000-0000-000000000006', 'Bags & Accessories', 'bags', 'Totes, crossbody bags, evening clutches and wallets', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=400&auto=format&fit=crop', 6, TRUE),
('c0000000-0000-0000-0000-000000000007', 'Jewellery', 'jewellery', 'Kundan, antique gold-plated, pearl and meenakari jewellery', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=400&auto=format&fit=crop', 7, TRUE),
('c0000000-0000-0000-0000-000000000008', 'Beauty & Care', 'beauty', 'Skincare essentials, glow serums, fragrances and makeup', 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=400&auto=format&fit=crop', 8, TRUE)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, image_url = EXCLUDED.image_url;

-- 6. ATTRIBUTES (Size & Color)
INSERT INTO product_attributes (id, name, code) VALUES
('a0000000-0000-0000-0000-000000000001', 'Size', 'size'),
('a0000000-0000-0000-0000-000000000002', 'Color', 'color')
ON CONFLICT (id) DO NOTHING;

INSERT INTO product_attribute_values (id, attribute_id, value, display_order) VALUES
('v0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'S', 1),
('v0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'M', 2),
('v0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'L', 3),
('v0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'XL', 4),
('v0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000002', 'Pink', 1),
('v0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000002', 'Black', 2),
('v0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000002', 'Maroon', 3),
('v0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000002', 'Royal Blue', 4)
ON CONFLICT (id) DO NOTHING;

-- 7. PRODUCTS (Variable and Simple Products)

-- Product 1: Premium Pink Handbag (matching reference item 1!)
INSERT INTO products (id, name, slug, sku, category_id, short_description, description, base_price, sale_price, stock_quantity, is_variable, is_featured, is_hot, is_new, is_active, rating, review_count)
VALUES (
    'p0000000-0000-0000-0000-000000000001',
    'Women''s Handbag',
    'womens-handbag-pink',
    'SH-BAG-001',
    'c0000000-0000-0000-0000-000000000006',
    'Luxurious vegan leather handbag with gold accents and shoulder strap.',
    'Elevate your daily look with the Style Hut signature Women''s Handbag. Crafted from high-grade textured vegan leather with polished gold-tone hardware, multiple compartments, and an adjustable shoulder strap for all-day comfort.',
    1650.00,
    1250.00,
    25,
    TRUE,
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    4.9,
    12
) ON CONFLICT (id) DO UPDATE SET sale_price = EXCLUDED.sale_price;

INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
('p0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop', 'Women''s Handbag Pink Front', 1, TRUE),
('p0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop', 'Women''s Handbag Details', 2, FALSE);

-- Product 1 Variants (Size / Color)
INSERT INTO product_variants (id, product_id, sku, title, price, sale_price, stock_quantity, image_url, is_active) VALUES
('pv000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000001', 'SH-BAG-001-PK-M', 'Pink / Medium', 1650.00, 1250.00, 15, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop', TRUE),
('pv000000-0000-0000-0000-000000000002', 'p0000000-0000-0000-0000-000000000001', 'SH-BAG-001-BK-M', 'Black / Medium', 1650.00, 1350.00, 10, 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Product 2: Smart Watch (matching reference item 2!)
INSERT INTO products (id, name, slug, sku, category_id, short_description, description, base_price, sale_price, stock_quantity, is_variable, is_featured, is_hot, is_new, is_active, rating, review_count)
VALUES (
    'p0000000-0000-0000-0000-000000000002',
    'Smart Watch Lifestyle',
    'smart-watch-lifestyle',
    'SH-WATCH-002',
    'c0000000-0000-0000-0000-000000000006',
    'Bluetooth calling, AMOLED display, fitness tracker and battery backup.',
    'A sleek, lightweight smartwatch designed for modern lifestyle. Tracks health vitals, heart rate, sleep cycles, and supports BT calling with crisp audio.',
    4999.00,
    3499.00,
    18,
    FALSE,
    TRUE,
    FALSE,
    TRUE,
    TRUE,
    4.8,
    18
) ON CONFLICT (id) DO UPDATE SET sale_price = EXCLUDED.sale_price;

INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
('p0000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=800&auto=format&fit=crop', 'Smart Watch Lifestyle', 1, TRUE);

-- Product 3: Face Glow Serum (matching reference item 3!)
INSERT INTO products (id, name, slug, sku, category_id, short_description, description, base_price, sale_price, stock_quantity, is_variable, is_featured, is_hot, is_new, is_active, rating, review_count)
VALUES (
    'p0000000-0000-0000-0000-000000000003',
    'Face Serum Glow Elixir',
    'face-serum-glow-elixir',
    'SH-BEAUTY-003',
    'c0000000-0000-0000-0000-000000000008',
    'Hyaluronic Acid & Niacinamide radiance boost for all skin types.',
    'Formulated with organic botanicals, 2% hyaluronic acid, and pure niacinamide to illuminate your skin and reduce fine lines naturally.',
    1200.00,
    850.00,
    30,
    TRUE,
    TRUE,
    FALSE,
    FALSE,
    TRUE,
    5.0,
    24
) ON CONFLICT (id) DO UPDATE SET sale_price = EXCLUDED.sale_price;

INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
('p0000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop', 'Face Serum Glow Elixir', 1, TRUE);

INSERT INTO product_variants (id, product_id, sku, title, price, sale_price, stock_quantity, image_url, is_active) VALUES
('pv000000-0000-0000-0000-000000000003', 'p0000000-0000-0000-0000-000000000003', 'SH-SERUM-30ML', '30ml', 1200.00, 850.00, 20, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop', TRUE),
('pv000000-0000-0000-0000-000000000004', 'p0000000-0000-0000-0000-000000000003', 'SH-SERUM-50ML', '50ml', 1800.00, 1350.00, 10, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Product 4: Running Shoes (matching reference item 4!)
INSERT INTO products (id, name, slug, sku, category_id, short_description, description, base_price, sale_price, stock_quantity, is_variable, is_featured, is_hot, is_new, is_active, rating, review_count)
VALUES (
    'p0000000-0000-0000-0000-000000000004',
    'Comfort Running Shoes',
    'comfort-running-shoes',
    'SH-SHOE-004',
    'c0000000-0000-0000-0000-000000000001',
    'Ultra-cushioned breathable mesh sneakers with slip-resistant sole.',
    'Engineered for maximum comfort during morning runs or long city walks. Breathable knit upper with responsive foam midsole.',
    2999.00,
    2199.00,
    14,
    FALSE,
    TRUE,
    FALSE,
    TRUE,
    TRUE,
    4.7,
    16
) ON CONFLICT (id) DO UPDATE SET sale_price = EXCLUDED.sale_price;

INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
('p0000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop', 'Comfort Running Shoes', 1, TRUE);

-- Product 5: Sunglasses UV400 (matching reference item 5!)
INSERT INTO products (id, name, slug, sku, category_id, short_description, description, base_price, sale_price, stock_quantity, is_variable, is_featured, is_hot, is_new, is_active, rating, review_count)
VALUES (
    'p0000000-0000-0000-0000-000000000005',
    'Cat-Eye Sunglasses',
    'cat-eye-sunglasses',
    'SH-SUN-005',
    'c0000000-0000-0000-0000-000000000006',
    'Polarized lenses with 100% UV400 sun protection and gold frame accents.',
    'Sophisticated cat-eye silhouette designed to flatter every face shape. High-definition polarized lenses reduce glare completely.',
    1499.00,
    950.00,
    22,
    FALSE,
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    4.9,
    10
) ON CONFLICT (id) DO UPDATE SET sale_price = EXCLUDED.sale_price;

INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
('p0000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop', 'Cat-Eye Sunglasses', 1, TRUE);

-- Product 6: Royal Dhakai Jamdani Saree (Signature Style Hut)
INSERT INTO products (id, name, slug, sku, category_id, short_description, description, base_price, sale_price, stock_quantity, is_variable, is_featured, is_hot, is_new, is_active, rating, review_count)
VALUES (
    'p0000000-0000-0000-0000-000000000006',
    'Royal Dhakai Jamdani Saree',
    'royal-dhakai-jamdani-saree',
    'SH-SAREE-006',
    'c0000000-0000-0000-0000-000000000002',
    'Authentic handwoven 84-count pure cotton Jamdani with golden zari motifs.',
    'A heritage masterpiece woven by skilled artisans of Narayanganj. Features traditional floral jaal work on soft pink base, perfect for weddings and celebratory festivities.',
    7500.00,
    5800.00,
    8,
    FALSE,
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    5.0,
    31
) ON CONFLICT (id) DO UPDATE SET sale_price = EXCLUDED.sale_price;

INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
('p0000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop', 'Royal Dhakai Jamdani Saree', 1, TRUE);

-- Product 7: Embroidered Lawn Salwar Kameez
INSERT INTO products (id, name, slug, sku, category_id, short_description, description, base_price, sale_price, stock_quantity, is_variable, is_featured, is_hot, is_new, is_active, rating, review_count)
VALUES (
    'p0000000-0000-0000-0000-000000000007',
    'Embroidered Organza Salwar Kameez',
    'embroidered-organza-salwar-kameez',
    'SH-SUIT-007',
    'c0000000-0000-0000-0000-000000000003',
    'Luxury 3-piece suit with resham threadwork, chiffon dupatta, and silk trouser.',
    'Boutique designer three-piece set crafted from fine organza with delicate threadwork, paired with a matching printed chiffon dupatta and tailored cigarette trousers.',
    4500.00,
    3650.00,
    15,
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    TRUE,
    4.9,
    19
) ON CONFLICT (id) DO UPDATE SET sale_price = EXCLUDED.sale_price;

INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
('p0000000-0000-0000-0000-000000000007', 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop', 'Embroidered Salwar Kameez', 1, TRUE);

INSERT INTO product_variants (id, product_id, sku, title, price, sale_price, stock_quantity, image_url, is_active) VALUES
('pv000000-0000-0000-0000-000000000007', 'p0000000-0000-0000-0000-000000000007', 'SH-SUIT-007-S', 'Size: S (36)', 4500.00, 3650.00, 5, 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop', TRUE),
('pv000000-0000-0000-0000-000000000008', 'p0000000-0000-0000-0000-000000000007', 'SH-SUIT-007-M', 'Size: M (38)', 4500.00, 3650.00, 6, 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop', TRUE),
('pv000000-0000-0000-0000-000000000009', 'p0000000-0000-0000-0000-000000000007', 'Size: L (40)', 4500.00, 3650.00, 4, 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Product 8: Pure Silk Chiffon Hijab
INSERT INTO products (id, name, slug, sku, category_id, short_description, description, base_price, sale_price, stock_quantity, is_variable, is_featured, is_hot, is_new, is_active, rating, review_count)
VALUES (
    'p0000000-0000-0000-0000-000000000008',
    'Premium Georgette Chiffon Hijab',
    'premium-georgette-chiffon-hijab',
    'SH-HIJAB-008',
    'c0000000-0000-0000-0000-000000000005',
    'Breathable non-slip premium georgette fabric in pastel hues.',
    'Designed for elegance and ease. Measuring 75 x 185 cm, this luxurious chiffon hijab drapes smoothly without slipping.',
    750.00,
    550.00,
    45,
    TRUE,
    TRUE,
    FALSE,
    FALSE,
    TRUE,
    4.9,
    42
) ON CONFLICT (id) DO UPDATE SET sale_price = EXCLUDED.sale_price;

INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
('p0000000-0000-0000-0000-000000000008', 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=800&auto=format&fit=crop', 'Georgette Chiffon Hijab', 1, TRUE);

INSERT INTO product_variants (id, product_id, sku, title, price, sale_price, stock_quantity, image_url, is_active) VALUES
('pv000000-0000-0000-0000-000000000010', 'p0000000-0000-0000-0000-000000000008', 'SH-HIJAB-008-PK', 'Blush Pink', 750.00, 550.00, 20, 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=800&auto=format&fit=crop', TRUE),
('pv000000-0000-0000-0000-000000000011', 'p0000000-0000-0000-0000-000000000008', 'SH-HIJAB-008-MN', 'Deep Maroon', 750.00, 550.00, 15, 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=800&auto=format&fit=crop', TRUE),
('pv000000-0000-0000-0000-000000000012', 'p0000000-0000-0000-0000-000000000008', 'SH-HIJAB-008-BK', 'Classic Black', 750.00, 550.00, 10, 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=800&auto=format&fit=crop', TRUE)
ON CONFLICT (id) DO NOTHING;

-- 8. INITIAL COUPONS
INSERT INTO coupons (code, discount_type, discount_value, min_order_amount, is_active) VALUES
('STYLE10', 'percentage', 10.00, 1000.00, TRUE),
('STYLE200', 'fixed', 200.00, 2500.00, TRUE),
('EID2026', 'percentage', 15.00, 3000.00, TRUE)
ON CONFLICT (code) DO NOTHING;

-- 9. SAMPLE RECENT ORDERS (For Admin Dashboard verification)
INSERT INTO orders (
    order_number, customer_name, customer_phone, customer_email,
    division, district, area, street_address, delivery_notes,
    subtotal, delivery_charge, discount_amount, total_amount,
    payment_method, payment_status, order_status, manual_payment_trx_id,
    created_at
) VALUES
('SH-1024', 'Rahima Noor', '01711223344', 'rahima@gmail.com', 'Chattogram', 'Chattogram', 'GEC Circle', 'House 45, Road 2, O.R. Nizam Road', 'Please ring the bell', 1250.00, 120.00, 0.00, 1370.00, 'bkash', 'Paid', 'Processing', 'TRX982736154', NOW() - INTERVAL '1 hour'),
('SH-1023', 'Nayeem Hasan', '01822334455', 'nayeem@gmail.com', 'Dhaka', 'Dhaka', 'Dhanmondi', 'House 12, Road 7/A', 'Call before arrival', 3499.00, 60.00, 200.00, 3359.00, 'cod', 'Unpaid', 'Delivered', NULL, NOW() - INTERVAL '1 day'),
('SH-1022', 'Fatema Jannat', '01933445566', 'fatema@gmail.com', 'Dhaka', 'Dhaka', 'Uttara', 'Sector 4, Road 18, House 9', NULL, 850.00, 60.00, 0.00, 910.00, 'nagad', 'Awaiting Verification', 'Pending', 'NGD77281938', NOW() - INTERVAL '3 hours'),
('SH-1021', 'Shakil Ahmed', '01644556677', 'shakil@gmail.com', 'Sylhet', 'Sylhet', 'Zindabazar', 'Shop 14, City Centre', NULL, 2199.00, 120.00, 0.00, 2319.00, 'cod', 'Unpaid', 'Processing', NULL, NOW() - INTERVAL '2 days'),
('SH-1020', 'Sumii Akter', '01555667788', 'sumi@gmail.com', 'Dhaka', 'Dhaka', 'Mirpur', 'Section 10, Block C, Lane 4', NULL, 950.00, 60.00, 0.00, 1010.00, 'rocket', 'Paid', 'Delivered', 'ROK6625143', NOW() - INTERVAL '3 days')
ON CONFLICT (order_number) DO NOTHING;
