import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  PlusCircle,
  FolderPlus,
  CreditCard,
  ArrowUpRight,
  ArrowRight,
  PackageCheck
} from 'lucide-react';
import { Order, Product } from '../types';
import { DataService } from '../services/dataService';

export const AdminDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([DataService.getOrders(), DataService.getProducts()]).then(([ords, prods]) => {
      setOrders(ords);
      setProducts(prods);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <div className="w-10 h-10 border-4 border-brand-pink border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Calculations
  const totalRevenue = orders.reduce((sum, o) => (o.order_status !== 'Cancelled' ? sum + o.total_amount : sum), 0);
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter((o) => o.order_status === 'Pending').length;

  // Low stock products count (stock < 10)
  const lowStockCount = products.filter((p) => {
    if (p.is_variable && p.variants) {
      return p.variants.some((v) => v.stock_quantity < 10);
    }
    return p.stock_quantity < 10;
  }).length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* 1. KEY METRICS STATS CARDS (Matching Reference Mockup) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Users */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 block mb-1">Total Users</span>
            <span className="text-2xl font-bold text-gray-900 font-serif">1,248</span>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+12% this month</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 block mb-1">Total Orders</span>
            <span className="text-2xl font-bold text-gray-900 font-serif">{totalOrdersCount}</span>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+8% from last week</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-pink-50 text-brand-pink flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 block mb-1">Total Revenue</span>
            <span className="text-2xl font-bold text-gray-900 font-serif">
              ৳ {totalRevenue.toLocaleString()}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+15% net sales</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Low Stock Items */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 block mb-1">Low Stock Items</span>
            <span className="text-2xl font-bold text-amber-600 font-serif">{lowStockCount}</span>
            <div className="text-[11px] text-gray-500 mt-1">
              <Link to="/admin/inventory" className="text-brand-pink font-semibold hover:underline">
                View restock list
              </Link>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 2. CHARTS & QUICK ACTIONS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales Overview Visual (8 cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h3 className="font-serif text-base font-bold text-gray-900">Sales Overview</h3>
              <p className="text-xs text-gray-500">Monthly revenue trend across Bangladesh</p>
            </div>
            <span className="text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg font-medium">
              Last 7 Months
            </span>
          </div>

          {/* Styled Graphical Wave Representation matching mockup */}
          <div className="h-64 w-full flex items-end justify-between gap-2 pt-8 pb-2 px-4">
            {[
              { month: 'Jan', val: 40, rev: '৳ 38,000' },
              { month: 'Feb', val: 55, rev: '৳ 52,000' },
              { month: 'Mar', val: 45, rev: '৳ 42,000' },
              { month: 'Apr', val: 70, rev: '৳ 68,000' },
              { month: 'May', val: 85, rev: '৳ 81,000' },
              { month: 'Jun', val: 92, rev: '৳ 94,000' },
              { month: 'Jul', val: 100, rev: '৳ 108,000' },
            ].map((bar) => (
              <div key={bar.month} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-brand-pink bg-brand-softPink px-1.5 py-0.5 rounded shadow-sm">
                  {bar.rev}
                </span>
                <div
                  className="w-full max-w-[42px] bg-gradient-to-t from-brand-pink/30 to-brand-pink rounded-t-xl transition-all duration-500 group-hover:to-brand-rose"
                  style={{ height: `${bar.val * 1.8}px` }}
                />
                <span className="text-xs text-gray-500 font-medium">{bar.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions (4 cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <h3 className="font-serif text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
            Quick Actions
          </h3>

          <div className="space-y-2.5">
            <Link
              to="/admin/products/new"
              className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-brand-pink hover:bg-brand-softPink/20 transition-all text-xs font-semibold text-gray-800"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-pink-50 text-brand-pink flex items-center justify-center">
                  <PlusCircle className="w-4 h-4" />
                </div>
                <span>Add New Product</span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </Link>

            <Link
              to="/admin/categories"
              className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-brand-pink hover:bg-brand-softPink/20 transition-all text-xs font-semibold text-gray-800"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                  <FolderPlus className="w-4 h-4" />
                </div>
                <span>Manage Categories</span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </Link>

            <Link
              to="/admin/orders"
              className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-brand-pink hover:bg-brand-softPink/20 transition-all text-xs font-semibold text-gray-800"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <PackageCheck className="w-4 h-4" />
                </div>
                <span>Process Customer Orders</span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </Link>

            <Link
              to="/admin/payment-settings"
              className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-brand-pink hover:bg-brand-softPink/20 transition-all text-xs font-semibold text-gray-800"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
                <span>Configure bKash / Nagad</span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </Link>
          </div>
        </div>
      </div>

      {/* 3. RECENT ORDERS TABLE (Matching Mockup Preview) */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-base font-bold text-gray-900">Recent Customer Orders</h3>
            <p className="text-xs text-gray-500">Live order status and transaction references</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-semibold text-brand-pink hover:underline flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 text-gray-600 uppercase font-semibold text-[11px] border-b border-gray-100">
              <tr>
                <th className="py-3 px-6">Order ID</th>
                <th className="py-3 px-6">Customer</th>
                <th className="py-3 px-6">Amount</th>
                <th className="py-3 px-6">Payment</th>
                <th className="py-3 px-6">Order Status</th>
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.slice(0, 6).map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3.5 px-6 font-mono font-bold text-brand-rose">
                    {order.order_number}
                  </td>
                  <td className="py-3.5 px-6">
                    <span className="font-semibold text-gray-900 block">{order.customer_name}</span>
                    <span className="text-[11px] text-gray-400">{order.customer_phone}</span>
                  </td>
                  <td className="py-3.5 px-6 font-semibold text-gray-900">
                    ৳ {order.total_amount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-6">
                    <span className="capitalize font-medium text-gray-700 block">
                      {order.payment_method}
                    </span>
                    <span
                      className={`text-[10px] font-bold ${
                        order.payment_status === 'Paid'
                          ? 'text-emerald-600'
                          : order.payment_status === 'Awaiting Verification'
                          ? 'text-amber-600'
                          : 'text-gray-400'
                      }`}
                    >
                      {order.payment_status}
                    </span>
                  </td>
                  <td className="py-3.5 px-6">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        order.order_status === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.order_status === 'Processing'
                          ? 'bg-cyan-100 text-cyan-800'
                          : order.order_status === 'Cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {order.order_status}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-gray-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <Link
                      to={`/admin/orders`}
                      className="text-xs font-semibold text-brand-pink hover:text-brand-rose"
                    >
                      Manage →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
