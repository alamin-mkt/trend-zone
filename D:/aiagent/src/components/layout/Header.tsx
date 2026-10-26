import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  User,
  ShoppingBag,
  Heart,
  Menu,
  X,
  Phone,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  Package,
  Truck,
  ShieldCheck
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { useAuth } from '../../contexts/AuthContext';
import { Category, StoreGeneralSettings } from '../../types';
import { DataService } from '../../services/dataService';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { totalItems, openDrawer } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, logout, isAdmin } = useAuth();

  const [categories, setCategories] = useState<Category[]>([]);
  const [storeSettings, setStoreSettings] = useState<StoreGeneralSettings | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    DataService.getCategories().then(setCategories);
    DataService.getStoreSettings().then(setStoreSettings);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-brand-border/60">
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-gradient-to-r from-brand-rose via-brand-pink to-brand-rose text-white text-xs py-1.5 px-4 font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline">✨</span>
            <p className="truncate">
              {storeSettings?.announcement_text ||
                'Free shipping across Bangladesh on orders over ৳ 2000! Hotline: +880 1712 345678'}
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <Link to="/order-tracking" className="hover:underline flex items-center gap-1">
              <Truck className="w-3.5 h-3.5" />
              <span>Track Order</span>
            </Link>
            <span className="opacity-40">|</span>
            <a
              href={`https://wa.me/${(storeSettings?.whatsapp || '+8801712345678').replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="hover:underline flex items-center gap-1"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
            {isAdmin && (
              <>
                <span className="opacity-40">|</span>
                <Link
                  to="/admin"
                  className="bg-brand-gold text-brand-dark px-2 py-0.5 rounded font-semibold text-[10px] hover:bg-white transition-colors"
                >
                  Admin Panel
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER ROW (Matching Reference Screenshot) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-brand-dark hover:text-brand-pink rounded-lg"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo */}
          <div className="flex-shrink-0">
            <BrandLogo />
          </div>

          {/* Search bar (Center matching reference mockup) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-xl mx-4 items-center relative"
          >
            <div className="relative w-full flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, brands and more..."
                className="w-full pl-4 pr-12 py-2.5 bg-brand-ivory/80 border border-brand-border rounded-full text-sm text-brand-dark placeholder-brand-darkMuted/60 focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-transparent transition-all"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 px-4 bg-brand-pink hover:bg-brand-rose text-white rounded-full flex items-center justify-center transition-colors"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Right Action Icons (Matching Reference Mockup) */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Login / Register Dropdown */}
            <div className="relative">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-brand-dark hover:text-brand-pink py-1 px-2 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-brand-softPink text-brand-rose flex items-center justify-center font-bold text-xs border border-brand-border">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden xl:inline max-w-[100px] truncate">{user.name}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-brand-darkMuted" />
                  </button>

                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-boutique-lg border border-brand-border/60 py-2 z-50 animate-fadeIn"
                      onMouseLeave={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs font-semibold text-brand-dark truncate">{user.name}</p>
                        <p className="text-[11px] text-brand-darkMuted truncate">{user.email}</p>
                        <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded bg-brand-softPink text-brand-rose font-medium capitalize">
                          {user.role}
                        </span>
                      </div>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs text-brand-rose hover:bg-brand-softPink/50 font-semibold"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Admin Dashboard
                        </Link>
                      )}
                      <Link
                        to="/account"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-brand-dark hover:bg-brand-ivory"
                      >
                        <User className="w-4 h-4" />
                        My Profile & Orders
                      </Link>
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 text-xs font-medium text-brand-dark hover:text-brand-pink transition-colors group"
                >
                  <User className="w-5 h-5 text-brand-dark group-hover:text-brand-pink" />
                  <span className="hidden sm:inline font-semibold">Login / Register</span>
                </Link>
              )}
            </div>

            {/* Social Icons (Desktop only, matching reference mockup) */}
            <div className="hidden lg:flex items-center gap-2 text-brand-darkMuted pl-1 border-l border-brand-border">
              <a
                href="https://facebook.com/trendzone.bd"
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full bg-brand-ivory flex items-center justify-center hover:bg-brand-pink hover:text-white transition-colors text-xs font-bold"
                title="Facebook"
              >
                f
              </a>
              <a
                href="https://instagram.com/trendzone.bd"
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full bg-brand-ivory flex items-center justify-center hover:bg-brand-pink hover:text-white transition-colors text-xs font-bold"
                title="Instagram"
              >
                ig
              </a>
              <a
                href="https://youtube.com/@trendzone.bd"
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full bg-brand-ivory flex items-center justify-center hover:bg-brand-pink hover:text-white transition-colors text-xs font-bold"
                title="YouTube"
              >
                yt
              </a>
            </div>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2 text-brand-dark hover:text-brand-pink transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-brand-rose text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Icon with badge (Opens Cart Drawer!) */}
            <button
              onClick={openDrawer}
              className="relative p-2 text-brand-dark hover:text-brand-pink transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-brand-pink" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-brand-pink text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                {totalItems}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <form onSubmit={handleSearchSubmit} className="mt-3 md:hidden">
          <div className="relative w-full flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-4 pr-10 py-2 bg-brand-ivory border border-brand-border rounded-full text-xs text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-pink"
            />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-3 bg-brand-pink text-white rounded-full flex items-center justify-center"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>

      {/* 3. CATEGORY NAVIGATION BAR (Desktop) */}
      <nav className="hidden lg:block bg-brand-ivory border-t border-brand-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-brand-dark py-2.5">
            <li>
              <Link to="/" className="hover:text-brand-pink transition-colors py-1 block">
                Home
              </Link>
            </li>
            {categories.slice(0, 8).map((cat) => (
              <li key={cat.id}>
                <Link
                  to={`/category/${cat.slug}`}
                  className="hover:text-brand-pink transition-colors py-1 block"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/products" className="text-brand-pink hover:text-brand-rose transition-colors py-1 font-bold block">
                All Products
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* 4. MOBILE DRAWER NAVIGATION */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 animate-slideRight">
            <div className="p-4 border-b border-brand-border flex items-center justify-between bg-brand-ivory">
              <BrandLogo />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-brand-dark hover:text-brand-pink"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="space-y-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-brand-darkMuted px-2">
                  Categories
                </p>
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-brand-dark hover:bg-brand-softPink hover:text-brand-pink"
                >
                  Home
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-brand-dark hover:bg-brand-softPink hover:text-brand-pink"
                  >
                    {cat.name}
                  </Link>
                ))}
                <Link
                  to="/products"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-semibold text-brand-pink hover:bg-brand-softPink"
                >
                  Explore All Products
                </Link>
              </div>

              <div className="pt-4 border-t border-gray-100 space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-brand-darkMuted px-2">
                  Customer Support
                </p>
                <Link
                  to="/order-tracking"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-brand-dark hover:bg-brand-softPink"
                >
                  <Truck className="w-4 h-4 text-brand-pink" />
                  Track My Order
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-brand-rose font-bold bg-brand-softPink/60"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Admin Panel
                  </Link>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-brand-border bg-brand-ivory/50">
              {user ? (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-brand-dark truncate">{user.name}</span>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs text-red-600 font-medium"
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full py-2 bg-brand-pink text-white text-center rounded-xl text-xs font-semibold shadow-sm"
                >
                  Login / Register
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
