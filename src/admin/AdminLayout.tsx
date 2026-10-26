import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Sliders,
  Warehouse,
  CreditCard,
  Image as ImageIcon,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  User,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { BrandLogo } from '../components/common/BrandLogo';

export const AdminLayout: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If user is not logged in or not admin, we can still allow them to click demo admin login
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-brand-ivory flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-brand-border shadow-boutique text-center space-y-4">
          <ShieldCheck className="w-14 h-14 text-brand-pink mx-auto" />
          <h2 className="font-serif text-2xl font-bold text-brand-dark">Admin Authorization Required</h2>
          <p className="text-xs text-brand-darkMuted">
            You must be signed in with administrator privileges to access the Trend Zone management panel.
          </p>
          <div className="pt-4 space-y-2">
            <Link
              to="/login"
              className="block w-full py-3 bg-brand-pink text-white rounded-xl text-xs font-semibold hover:bg-brand-rose transition-colors"
            >
              Sign In to Admin
            </Link>
            <Link
              to="/"
              className="block w-full py-2.5 text-xs text-brand-darkMuted hover:text-brand-dark"
            >
              ← Back to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Categories', path: '/admin/categories', icon: Layers },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Inventory & Stock', path: '/admin/inventory', icon: Warehouse },
    { name: 'Banners', path: '/admin/banners', icon: ImageIcon },
    { name: 'Payment Settings', path: '/admin/payment-settings', icon: CreditCard },
    { name: 'Store Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar (Matching Mockup Dashboard preview) */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#1E242B] text-gray-300 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="p-5 border-b border-gray-800 flex items-center justify-between">
          <BrandLogo variant="light" showTagline={false} size="sm" />
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              item.path === '/admin'
                ? location.pathname === '/admin'
                : location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-brand-pink text-white shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                }`}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-800 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Storefront</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-red-400 hover:bg-red-500/10 transition-colors text-left"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:text-brand-pink"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="font-serif text-lg font-bold text-brand-dark hidden sm:block">
              Trend Zone Administration
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-brand-pink hover:text-brand-rose px-3 py-1.5 rounded-lg bg-brand-softPink/50"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Website</span>
            </Link>

            {/* Admin Avatar */}
            <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-brand-pink text-white flex items-center justify-center font-bold text-xs">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block text-left text-xs">
                <span className="font-bold text-brand-dark block">{user.name}</span>
                <span className="text-[10px] text-gray-400 capitalize">{user.role}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
