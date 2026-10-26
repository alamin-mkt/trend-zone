import React, { useState } from 'react';
import { Search, Package, Truck, CheckCircle2, Clock, MapPin, AlertCircle } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { DataService } from '../services/dataService';

const STATUS_STEPS: OrderStatus[] = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];

export const OrderTrackingPage: React.FC = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim() || !phone.trim()) {
      setError('Please provide both Order Number and Phone Number.');
      return;
    }

    setLoading(true);
    setError(null);
    setOrder(null);

    const result = await DataService.trackOrder(orderNumber.trim(), phone.trim());
    if (result.found && result.order) {
      setOrder(result.order);
    } else {
      setError(result.message || 'No matching order found for this Order Number and Phone Number.');
    }
    setLoading(false);
  };

  const getStepIndex = (status: OrderStatus) => {
    return STATUS_STEPS.indexOf(status);
  };

  return (
    <div className="bg-brand-ivory/30 py-12 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-brand-dark">Track Your Order</h1>
          <p className="text-xs sm:text-sm text-brand-darkMuted mt-1">
            Enter your order number and billing phone number to check live shipping status.
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-border/60 shadow-sm mb-8">
          <form onSubmit={handleTrack} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-brand-dark mb-1.5">
                  Order Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                  placeholder="e.g. SH-1024"
                  className="w-full px-3.5 py-2.5 border border-brand-border rounded-xl text-xs uppercase font-mono font-bold focus:outline-none focus:ring-2 focus:ring-brand-pink"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-dark mb-1.5">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 01711223344"
                  className="w-full px-3.5 py-2.5 border border-brand-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-pink"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-pink hover:bg-brand-rose text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Looking up order...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Track Order Status</span>
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Tracking Result View */}
        {order && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-border/60 shadow-sm space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-brand-border/60 gap-2">
              <div>
                <span className="text-xs text-brand-darkMuted font-mono">Order Number</span>
                <h3 className="font-serif text-xl font-bold text-brand-dark">{order.order_number}</h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-brand-darkMuted block">Placed On</span>
                <span className="text-xs font-semibold text-brand-dark">
                  {new Date(order.created_at).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>

            {/* Stepper Timeline */}
            <div>
              <p className="text-xs font-bold text-brand-dark mb-4">Progress Tracker</p>
              {order.order_status === 'Cancelled' ? (
                <div className="p-4 rounded-xl bg-red-50 text-red-600 text-xs font-semibold">
                  This order has been Cancelled. If you have questions, please reach out to customer support.
                </div>
              ) : (
                <div className="flex items-center justify-between relative py-2">
                  <div className="absolute top-1/2 left-4 right-4 h-1 bg-gray-200 -translate-y-1/2 z-0" />
                  {STATUS_STEPS.map((status, idx) => {
                    const currentStep = getStepIndex(order.order_status);
                    const isDone = idx <= currentStep;
                    const isCurrent = idx === currentStep;

                    return (
                      <div key={status} className="flex flex-col items-center z-10">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            isDone
                              ? 'bg-brand-pink text-white shadow-sm'
                              : 'bg-white border-2 border-gray-300 text-gray-400'
                          } ${isCurrent ? 'ring-4 ring-brand-softPink' : ''}`}
                        >
                          {idx + 1}
                        </div>
                        <span
                          className={`text-[10px] mt-2 font-semibold ${
                            isDone ? 'text-brand-dark' : 'text-gray-400'
                          }`}
                        >
                          {status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Address & Payment Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-brand-border/60 text-xs">
              <div>
                <span className="text-brand-darkMuted block mb-0.5">Shipping Address:</span>
                <p className="font-semibold text-brand-dark">
                  {order.street_address}, {order.area}, {order.district}, {order.division}
                </p>
              </div>

              <div>
                <span className="text-brand-darkMuted block mb-0.5">Payment Details:</span>
                <p className="font-semibold text-brand-dark">
                  Method: {order.payment_method.toUpperCase()} • Status:{' '}
                  <span className="text-brand-pink font-bold">{order.payment_status}</span>
                </p>
                <p className="text-brand-darkMuted mt-1">
                  Total Bill: <strong className="text-brand-dark">৳ {order.total_amount.toLocaleString()}</strong>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
