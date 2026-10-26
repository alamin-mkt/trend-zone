# Trend Zone (স্টাইল হাট) — Complete E-Commerce Platform
### Women's Fashion & Lifestyle Store for Bangladesh
**Be Your Own Style | React + Vite + TypeScript + Tailwind CSS + Supabase**

---

## 🌸 Brand Identity & Design System

- **Brand Name:** Trend Zone
- **Tagline:** *Be Your Own Style*
- **Target Market:** Bangladesh
- **Currency:** Bangladeshi Taka (৳ BDT)
- **Timezone:** Asia/Dhaka
- **Color Palette:**
  - **Primary Pink:** `#D6336C` (Main brand color, call-to-actions, primary highlights)
  - **Deep Rose:** `#A61E4D` (Headers, footers, badges, contrast elements)
  - **Ivory:** `#FFF9F2` (Warm luxury boutique background)
  - **Soft Pink:** `#FCE7EF` (Pill badges, category icon rings, alert backgrounds)
  - **Gold Accent:** `#C9A34E` (Boutique accents, checkout button, premium highlights)
  - **Dark Text:** `#33242A` (High-contrast typography)
  - **White:** `#FFFFFF` (Card surfaces, clean modals)

---

## ⚡ Tech Stack Architecture

- **Frontend:**
  - React 18
  - Vite 5 (Ultra-fast build tooling)
  - TypeScript (Full type safety across models, orders, and variants)
  - Tailwind CSS (Custom boutique theme tokens & responsive design)
  - React Router v6 (SPA routing with protected admin layouts)
  - Lucide React (Clean boutique SVG iconography)
- **Backend & Database:**
  - Supabase PostgreSQL
  - Supabase Auth (Customer login, registration, role checks)
  - Supabase Storage (Buckets for product photos, categories, hero banners, logo)
  - Supabase Row Level Security (RLS enabled on all 20+ tables)
  - Atomic RPC Functions (`create_order_secure`, `cancel_order_and_restore_stock`, `track_order`)
- **Resilient Fallback Mode:**
  - If Supabase environment credentials are not yet supplied, the system immediately boots into an in-memory & reactive local persistence layer so the entire storefront, cart drawer, checkout, and admin dashboard work seamlessly out-of-the-box!

---

## 🚀 Key Features

### 1. Storefront Experience (Matching Reference Mockup)
- **Header:**
  - Announcement top-bar with hotline, WhatsApp order link, and order tracker
  - Trend Zone brand monogram logo
  - Product search input with quick query routing
  - Customer account dropdown (Profile, Orders, Admin panel shortcut)
  - Social media icons (Facebook, Instagram, YouTube, Pinterest)
  - Wishlist icon with live item count badge
  - Shopping cart bag icon with live count badge that triggers the **Sliding Right-Side Cart Drawer**
  - Category navigation bar (Saree, Salwar Kameez, Kurti, Hijab & Abaya, Bags & Accessories, Jewellery, Beauty & Care)
  - Mobile slide-out navigation drawer with touch gestures
- **Sliding Cart Drawer:**
  - Slide-in from right edge with smooth backdrop blur
  - Item thumbnails, selected variant labels (e.g. `Pink / Medium`, `30ml`), quantity steppers `[-] [1] [+]`, delete button
  - Subtotal in ৳ BDT
  - Free delivery milestone progress
  - Pink **"View Cart"** button and Gold **"Checkout"** button matching visual reference
- **Hero Banner Carousel:**
  - Luxury gradient background with soft floral glow
  - Badge ("Trending Products"), Title, Subtitle, "Shop Now ->" pink pill button
  - Smooth slide transitions, prev/next circular arrows, auto-rotation, and pagination dots
  - Admin-manageable from the database
- **Shop by Category Section:**
  - Circular category cards with soft pink/ivory borders and high-res imagery
  - One-click navigation to category filter pages
- **Latest Products Showcase:**
  - Interactive product cards with "Hot", "New", "-XX% OFF" badges
  - Hover zoom previews, quick view shortcut, wishlist toggle heart
  - Star ratings & review counts
  - Sale price and strikethrough regular price in ৳ BDT
  - Pink **"Add to Cart"** button
  - Category filter pills ("All", "🔥 Hot Trends", "✨ New Arrivals", "⭐ Featured")
- **3-Column Promo Banners:**
  - 1. Up to 50% OFF - Fashion Collection
  - 2. Smart gadgets - Latest & Best
  - 3. Beauty Essentials - Glow Naturally
- **Trust Features Bar:**
  - Free Shipping (On orders over ৳ 2000)
  - Secure Payment (100% secure payments)
  - Easy Return (Within 7 days)
  - 24/7 Support (We're here to help)
- **Deep Rose Boutique Footer:**
  - Contact information (Gulshan-2, Dhaka / Chattogram, Phone, WhatsApp, Email)
  - Bangladesh Payment method badges (Cash on Delivery, bKash, Nagad, Rocket)
  - Social media channels & Newsletter subscription
  - Legal policy links

### 2. Product Catalog & Details
- Filter by category, price slider (৳0 – ৳10,000), in-stock toggle, and sorting (Newest, Low to High, High to Low, Popularity)
- Multi-image gallery with thumbnail switcher
- Real-time stock status indicator
- Size selector pills (S, M, L, XL) and color swatches
- Dynamic variant price, stock, and image switching upon variation selection
- "Buy Now" instant checkout action
- Delivery charge guide (Dhaka ৳60 vs Outside Dhaka ৳120) and 7-day return policy

### 3. Simple & Variable Products
- **Simple Products:** Standard SKU, single regular price, sale price, and inventory count
- **Variable Products:** Visual Variation Builder supporting multiple attributes (Size, Color), individual variant SKUs, separate variation prices, variation-specific stock, and variation images!
- Prevents duplicate variation combinations and overselling!

### 4. Bangladesh Checkout & Payment Processing
- Full Bangladesh delivery address capture: Division (8 divisions), District, Area/Thana, Street address, Delivery notes
- Dynamic Delivery fee:
  - Inside Dhaka: ৳ 60
  - Outside Dhaka: ৳ 120
  - Orders ৳ 2,000+: **Free Delivery**
- Promo coupon discount engine (`STYLE10`, `STYLE200`, `EID2026`)
- Bangladesh Payment Methods:
  - **Cash on Delivery (COD)**
  - **bKash Manual Payment:** Displays admin bKash number, account type (Personal/Merchant), send-money guide, and requires Transaction ID (TrxID) & sender phone number
  - **Nagad Manual Payment:** Displays admin Nagad number, instructions, and verifies TrxID
  - **Rocket Manual Payment:** Displays admin 12-digit DBBL Rocket number
- Fake order prevention: Server-side phone format validation (+880 11 digits), duplicate submission protection, and unique idempotency keys per order attempt!

### 5. Order Tracking
- Public guest order tracking at `/order-tracking`
- Track status (Pending → Confirmed → Processing → Shipped → Delivered) by Order Number + Phone number without exposing other users' orders!

### 6. Admin Control Center (`/admin`)
- Protected admin routes with role-based checks
- **Dashboard Overview:**
  - Total Users, Total Orders, Total Revenue, Low Stock Items stats cards
  - Sales overview trend chart
  - Recent orders table with live payment and delivery status badges
  - Quick action shortcuts
- **Product Management:**
  - Create & Edit simple and variable products
  - Visual variation manager (add custom variations or generate size presets S, M, L, XL)
  - Image manager and visibility flags
- **Category Management:**
  - Add, edit, reorder, and safely delete store categories
- **Order Management:**
  - Search by order number, customer name, phone, or TrxID
  - Filter by Order Status and Payment Status
  - Detailed modal view with customer info, delivery address, itemized receipts
  - Verify manual payments (Mark Paid / Reject)
  - **Order Cancellation with Stock Restoration:** Cancelling an order automatically restores deducted inventory back to stock and prevents duplicate restorations!
- **Inventory & Stock Movements:**
  - Table of all products and variants with stock status (In Stock, Low Stock, Out of Stock)
  - Quick stock adjustment dialog with reason logging
  - Audit trail of all stock movements
- **Payment Settings:**
  - Edit bKash, Nagad, Rocket numbers, account types, instructions, and toggle payment methods on/off
- **Banner Management:**
  - Create, edit, and reorder hero carousel slides and promo cards
- **Store Settings:**
  - Edit store name, tagline, hotline phone, WhatsApp, email, physical address, announcement bar, delivery fees, and policy texts!

---

## 📂 Project Structure

```
trend-zone/
├── public/
│   ├── favicon.svg             # Trend Zone monogram favicon
│   └── images/
│       ├── trend-zone-logo.png  # Official uploaded logo asset
│       └── reference-layout.jpg# Layout reference mockup
├── src/
│   ├── admin/                  # Admin Dashboard & Management views
│   │   ├── AdminBanners.tsx
│   │   ├── AdminCategories.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminInventory.tsx
│   │   ├── AdminLayout.tsx
│   │   ├── AdminOrders.tsx
│   │   ├── AdminPaymentSettings.tsx
│   │   ├── AdminProductForm.tsx
│   │   ├── AdminProducts.tsx
│   │   └── AdminStoreSettings.tsx
│   ├── components/
│   │   ├── cart/               # Sliding Right-Side Cart Drawer
│   │   │   └── CartDrawer.tsx
│   │   ├── common/             # Monogram Logo & Reusables
│   │   │   └── BrandLogo.tsx
│   │   ├── home/               # Homepage Sections
│   │   │   ├── CategorySection.tsx
│   │   │   ├── HeroCarousel.tsx
│   │   │   ├── ProductSection.tsx
│   │   │   ├── PromoBanners.tsx
│   │   │   └── TrustFeatures.tsx
│   │   ├── layout/             # Header, Navigation & Footer
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   └── products/           # Product Cards
│   │       └── ProductCard.tsx
│   ├── contexts/               # React Contexts (Auth, Cart, Wishlist)
│   │   ├── AuthContext.tsx
│   │   ├── CartContext.tsx
│   │   └── WishlistContext.tsx
│   ├── lib/
│   │   └── supabase.ts         # Supabase client wrapper & credentials check
│   ├── pages/                  # Storefront Pages
│   │   ├── AuthPages.tsx       # Login & Register
│   │   ├── CartPage.tsx        # Dedicated Cart Page
│   │   ├── CheckoutPage.tsx    # Bangladesh Checkout
│   │   ├── CustomerAccountPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── OrderConfirmationPage.tsx
│   │   ├── OrderTrackingPage.tsx
│   │   ├── PolicyPages.tsx     # Privacy, Terms, Refund, About, Contact, 404
│   │   ├── ProductDetailPage.tsx
│   │   ├── ProductListingPage.tsx
│   │   └── WishlistPage.tsx
│   ├── services/
│   │   ├── dataService.ts      # Unified DB & Fallback Storage service
│   │   └── mockData.ts         # Seed data matching reference mockup
│   ├── types/
│   │   └── index.ts            # Complete TypeScript domain types
│   ├── App.tsx                 # Route definitions & layout wrappers
│   ├── main.tsx
│   ├── index.css
│   └── vite-env.d.ts
├── supabase/
│   ├── migrations/
│   │   └── 20261026_init_schema.sql # 20+ tables, RLS & atomic RPC functions
│   └── seed.sql                # Bangladesh fashion catalog seed
├── tests/
│   └── ecommerce.test.js       # Business logic automated tests
├── .env.example
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🛠️ Supabase Database Setup Guide

### 1. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Note your **Project URL** and **anon / public key** from `Project Settings` -> `API`.

### 2. Execute SQL Migrations
1. Open the Supabase **SQL Editor**.
2. Copy and paste the contents of `supabase/migrations/20261026_init_schema.sql` and run it.
   - This creates all 20+ tables (`profiles`, `addresses`, `categories`, `products`, `product_images`, `product_attributes`, `product_attribute_values`, `product_variants`, `variant_attribute_values`, `wishlists`, `carts`, `cart_items`, `orders`, `order_items`, `payment_settings`, `banners`, `store_settings`, `social_links`, `order_events`, `stock_movements`, `coupons`).
   - Enables Row Level Security (RLS) on every table.
   - Creates atomic RPC functions (`create_order_secure`, `cancel_order_and_restore_stock`, `track_order`).
3. Run `supabase/seed.sql` to populate the initial catalog with authentic Bangladesh sarees, kurtis, bags, banners, and payment methods.

### 3. Create Storage Buckets
In the Supabase Dashboard, navigate to **Storage** and create these public buckets:
- `products` (Public read, authenticated admin write)
- `categories` (Public read, authenticated admin write)
- `banners` (Public read, authenticated admin write)
- `branding` (Public read, authenticated admin write)

### 4. Secure Admin Bootstrap
To promote a user to administrator:
```sql
UPDATE profiles
SET role = 'admin'
WHERE email = 'your-admin-email@example.com';
```

---

## 💻 Local Development & Testing

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Add your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

### 3. Run Automated Tests
```bash
npm test
```
*Runs the 6 automated acceptance test suites (Bangladesh phone validation, dynamic delivery charges, variation pricing resolution, atomic stock deduction, order cancellation stock restore, and overselling protection).*

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build
```bash
npm run build
```

---

## 🌐 Deployment Instructions

### Deploy to Vercel
1. Push your repository to GitHub.
2. Import the repository in [Vercel](https://vercel.com).
3. Set the build settings:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
5. Click **Deploy**.

### Deploy to Netlify
1. Connect your repository to [Netlify](https://netlify.com).
2. Set:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Add a `public/_redirects` file with `/*  /index.html  200` to support client-side routing.
4. Add environment variables and deploy.

---

## 🛡️ Super Admin Credentials
For login & administrative access:
- **Login URL:** [`http://localhost:3000/login`](http://localhost:3000/login)
- **Admin Email:** `admin@trendzone.com`
- **Admin Password:** `Admin@12345`
- Or simply click the **"1-Click Super Admin Login"** or **"Auto Fill"** button on the login screen.
