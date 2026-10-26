import React from 'react';
import { HashRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import { WishlistProvider } from './contexts/WishlistContext';

// Components
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/cart/CartDrawer';

// Storefront Pages
import { HomePage } from './pages/HomePage';
import { ProductListingPage } from './pages/ProductListingPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { WishlistPage } from './pages/WishlistPage';
import { CustomerAccountPage } from './pages/CustomerAccountPage';
import { LoginPage, RegisterPage } from './pages/AuthPages';
import { PolicyPage, AboutUsPage, ContactUsPage, NotFoundPage } from './pages/PolicyPages';

// Admin Pages
import { AdminLayout } from './admin/AdminLayout';
import { AdminDashboard } from './admin/AdminDashboard';
import { AdminProducts } from './admin/AdminProducts';
import { AdminProductForm } from './admin/AdminProductForm';
import { AdminCategories } from './admin/AdminCategories';
import { AdminOrders } from './admin/AdminOrders';
import { AdminInventory } from './admin/AdminInventory';
import { AdminPaymentSettings } from './admin/AdminPaymentSettings';
import { AdminBanners } from './admin/AdminBanners';
import { AdminStoreSettings } from './admin/AdminStoreSettings';

// Scroll to top on navigation helper
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Storefront Layout Wrapper
const StorefrontLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <HashRouter>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <ScrollToTop />
            <Routes>
              {/* Storefront Routes */}
              <Route path="/" element={<StorefrontLayout />}>
                <Route index element={<HomePage />} />
                <Route path="products" element={<ProductListingPage />} />
                <Route path="category/:categorySlug" element={<ProductListingPage />} />
                <Route path="product/:slug" element={<ProductDetailPage />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="checkout" element={<CheckoutPage />} />
                <Route path="order-confirmation/:orderNumber" element={<OrderConfirmationPage />} />
                <Route path="order-tracking" element={<OrderTrackingPage />} />
                <Route path="wishlist" element={<WishlistPage />} />
                <Route path="account" element={<CustomerAccountPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="privacy-policy" element={<PolicyPage type="privacy" />} />
                <Route path="terms-conditions" element={<PolicyPage type="terms" />} />
                <Route path="refund-policy" element={<PolicyPage type="refund" />} />
                <Route path="about" element={<AboutUsPage />} />
                <Route path="contact" element={<ContactUsPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>

              {/* Admin Panel Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="products/new" element={<AdminProductForm />} />
                <Route path="products/edit/:id" element={<AdminProductForm />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="inventory" element={<AdminInventory />} />
                <Route path="banners" element={<AdminBanners />} />
                <Route path="payment-settings" element={<AdminPaymentSettings />} />
                <Route path="settings" element={<AdminStoreSettings />} />
              </Route>
            </Routes>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </HashRouter>
  );
};

export default App;
