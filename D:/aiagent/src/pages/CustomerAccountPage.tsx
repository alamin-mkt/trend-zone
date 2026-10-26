import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Package, MapPin, LogOut, Clock, Truck, ShieldCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Order } from '../types';
import { DataService } from '../services/dataService';

export const CustomerAccountPage: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    DataService.getOrders().then((all) => {
      // In full system, filter by user email/id or show demo orders
      setOrders(all);
    });
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="bg-brand-ivory/30 py-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl font-bold text-brand-dark mb-8">My Account</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* User Profile Card (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-brand-border/60 shadow-sm space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-pink to-brand-rose text-white flex items-center justify-center font-serif text-2xl font-bold shadow-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="font-serif text-lg font-bold text-brand-dark">{user.name}</h2>
                  <p className="text-xs text-brand-darkMuted">{user.email}</p>
                  <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-brand-softPink text-brand-rose font-bold uppercase">
                    {user.role}
                  </span>
                </div>
              </div>

              {isAdmin && (
                <div className="p-3 bg-brand-softPink/50 rounded-xl border border-brand-pink/30 text-xs">
                  <p className="font-bold text-brand-rose">You have Administrator Access</p>
                  <Link
                    to="/admin"
                    className="inline-block mt-1.5 text-xs text-brand-pink font-semibold hover:underline"
                  >
                    Go to Admin Dashboard →
                  </Link>
                </div>
              )}

              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="w-full py-2.5 border border-red-200 text-red-600 rounded-xl text-xs font-semibold hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>

          {/* Orders History (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-border/60 shadow-sm">
              <h2 className="font-serif text-xl font-bold text-brand-dark mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-brand-pink" />
                <span>Order History</span>
              </h2>

              {orders.length === 0 ? (
                <p className="text-xs text-brand-darkMuted py-8 text-center">No previous orders found.</p>
              ) : (
                <div className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <div key={order.id} className="py-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-mono font-bold text-xs text-brand-rose block">
                            {order.order_number}
                          </span>
                          <span className="text-[11px] text-brand-darkMuted">
                            {new Date(order.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-serif font-bold text-sm text-brand-pink block">
                            ৳ {order.total_amount.toLocaleString()}
                          </span>
                          <span
                            className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-bold ${
                              order.order_status === 'Delivered'
                                ? 'bg-emerald-100 text-emerald-700'
                                : order.order_status === 'Cancelled'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {order.order_status}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-brand-dark flex justify-between items-center pt-1">
                        <span className="text-brand-darkMuted truncate max-w-xs">
                          {order.items?.map((i) => i.product_name).join(', ') || 'Fashion items'}
                        </span>
                        <Link
                          to={`/order-confirmation/${order.order_number}`}
                          className="text-brand-pink hover:underline font-semibold"
                        >
                          View Receipt →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
