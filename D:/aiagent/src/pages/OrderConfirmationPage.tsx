import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, Truck, ArrowRight, Phone, MapPin, Calendar, Clock } from 'lucide-react';
import { Order } from '../types';
import { DataService } from '../services/dataService';

export const OrderConfirmationPage: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderNumber) {
      DataService.getOrderById(orderNumber).then((data) => {
        setOrder(data);
        setLoading(false);
      });
    }
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <div className="w-12 h-12 border-4 border-brand-pink border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-brand-ivory/40 py-12 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl border border-brand-border/60 p-6 sm:p-10 shadow-boutique text-center">
          {/* Success Animated Badge */}
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-brand-rose">
            Thank you for shopping with us!
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-dark mt-2 mb-3">
            Your Order has been Placed!
          </h1>
          <p className="text-xs sm:text-sm text-brand-darkMuted max-w-md mx-auto mb-6">
            We have received your order and our team is preparing it. We will call you shortly to confirm before dispatch.
          </p>

          {/* Order Details Pill */}
          <div className="inline-block px-5 py-2.5 bg-brand-softPink/60 border border-brand-pink/30 rounded-2xl mb-8">
            <span className="text-xs text-brand-darkMuted block">Your Order Number</span>
            <span className="font-mono text-xl sm:text-2xl font-bold text-brand-rose">
              {orderNumber}
            </span>
          </div>

          {order && (
            <div className="text-left border-t border-b border-brand-border/60 py-6 my-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-brand-darkMuted font-medium block">Customer Name</span>
                  <span className="font-bold text-brand-dark text-sm">{order.customer_name}</span>
                </div>
                <div>
                  <span className="text-brand-darkMuted font-medium block">Contact Mobile</span>
                  <span className="font-bold text-brand-dark text-sm">{order.customer_phone}</span>
                </div>
                <div>
                  <span className="text-brand-darkMuted font-medium block">Delivery Destination</span>
                  <span className="font-semibold text-brand-dark">
                    {order.street_address}, {order.area}, {order.district}, {order.division}
                  </span>
                </div>
                <div>
                  <span className="text-brand-darkMuted font-medium block">Payment Method & Status</span>
                  <span className="font-semibold text-brand-dark capitalize">
                    {order.payment_method.toUpperCase()} —{' '}
                    <span className="text-brand-rose font-bold">{order.payment_status}</span>
                  </span>
                </div>
              </div>

              {/* Order Items Table */}
              {order.items && order.items.length > 0 && (
                <div className="pt-4 border-t border-gray-100">
                  <span className="font-bold text-brand-dark block mb-2">Ordered Items:</span>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-1.5 border-b border-gray-50">
                        <div className="flex items-center gap-2">
                          <img
                            src={item.image_url || '/placeholder.jpg'}
                            alt=""
                            className="w-8 h-8 rounded object-cover border"
                          />
                          <div>
                            <p className="font-medium text-brand-dark">{item.product_name}</p>
                            {item.variant_title && (
                              <p className="text-[10px] text-brand-rose">{item.variant_title}</p>
                            )}
                          </div>
                        </div>
                        <span className="font-semibold text-brand-pink">
                          {item.quantity} × ৳ {item.unit_price.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Total Amount */}
              <div className="pt-3 flex justify-between items-baseline text-sm font-bold text-brand-dark border-t border-brand-border/60">
                <span>Total Amount:</span>
                <span className="font-serif text-xl text-brand-pink">
                  ৳ {order.total_amount.toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/order-tracking"
              className="w-full sm:w-auto px-6 py-3 bg-brand-pink hover:bg-brand-rose text-white text-xs font-semibold rounded-full shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <Truck className="w-4 h-4" />
              <span>Track This Order</span>
            </Link>

            <Link
              to="/products"
              className="w-full sm:w-auto px-6 py-3 bg-white border border-brand-border text-brand-dark hover:border-brand-pink text-xs font-semibold rounded-full transition-all flex items-center justify-center gap-2"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
