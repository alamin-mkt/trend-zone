import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Tag, ArrowLeft } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

export const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState<{ text: string; error?: boolean } | null>(null);

  const deliveryCharge = subtotal >= 2000 ? 0 : 60;
  const grandTotal = Math.max(0, subtotal - discount + deliveryCharge);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    if (code === 'STYLE10') {
      if (subtotal < 1000) {
        setCouponMessage({ text: 'Minimum order amount for STYLE10 is ৳ 1,000', error: true });
        return;
      }
      const disc = Math.round(subtotal * 0.10);
      setDiscount(disc);
      setCouponMessage({ text: `Coupon STYLE10 applied! You saved ৳ ${disc}` });
    } else if (code === 'STYLE200') {
      if (subtotal < 2500) {
        setCouponMessage({ text: 'Minimum order amount for STYLE200 is ৳ 2,500', error: true });
        return;
      }
      setDiscount(200);
      setCouponMessage({ text: 'Coupon STYLE200 applied! You saved ৳ 200' });
    } else if (code === 'EID2026') {
      if (subtotal < 3000) {
        setCouponMessage({ text: 'Minimum order amount for EID2026 is ৳ 3,000', error: true });
        return;
      }
      const disc = Math.round(subtotal * 0.15);
      setDiscount(disc);
      setCouponMessage({ text: `Eid Special EID2026 applied! You saved ৳ ${disc}` });
    } else {
      setCouponMessage({ text: 'Invalid promo code. Try STYLE10 or STYLE200', error: true });
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 rounded-full bg-brand-softPink flex items-center justify-center text-brand-pink mx-auto mb-6">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-brand-dark mb-3">Your Cart is Empty</h1>
        <p className="text-sm text-brand-darkMuted mb-8 max-w-md mx-auto">
          Explore our handpicked Bangladeshi designer sarees, kurtis, bags, and luxury beauty essentials.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-pink hover:bg-brand-rose text-white font-semibold rounded-full shadow-boutique transition-all"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-brand-ivory/30 py-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl font-bold text-brand-dark mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Table (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-3xl border border-brand-border/60 shadow-sm overflow-hidden">
              <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-4 bg-brand-ivory border-b border-brand-border/60 text-xs font-bold text-brand-dark uppercase tracking-wider">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Subtotal</div>
              </div>

              <div className="divide-y divide-gray-100 px-6">
                {cart.map((item) => (
                  <div key={item.id} className="py-5 flex flex-col sm:grid sm:grid-cols-12 gap-4 items-center">
                    {/* Product & Variant */}
                    <div className="col-span-6 flex items-center gap-4 w-full">
                      <img
                        src={item.variant?.image_url || item.product.images?.[0]?.image_url || '/placeholder.jpg'}
                        alt={item.product.name}
                        className="w-20 h-20 rounded-xl object-cover border border-brand-border/60 flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <Link
                          to={`/product/${item.product.slug}`}
                          className="font-semibold text-sm text-brand-dark hover:text-brand-pink transition-colors line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        {item.variant && (
                          <p className="text-xs text-brand-rose font-medium mt-0.5">
                            {item.variant.title}
                          </p>
                        )}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 mt-2 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>

                    {/* Unit Price */}
                    <div className="col-span-2 text-center text-xs font-semibold text-brand-dark">
                      ৳ {item.unitPrice.toLocaleString()}
                    </div>

                    {/* Quantity Stepper */}
                    <div className="col-span-2 flex justify-center">
                      <div className="flex items-center border border-brand-border rounded-lg bg-brand-ivory">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-brand-dark hover:bg-brand-softPink"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-brand-dark">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-brand-dark hover:bg-brand-softPink"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div className="col-span-2 text-right font-serif font-bold text-sm text-brand-pink">
                      ৳ {item.totalPrice.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-6 py-4 bg-brand-ivory/40 border-t border-brand-border/60 flex justify-between items-center">
                <Link
                  to="/products"
                  className="text-xs font-semibold text-brand-dark hover:text-brand-pink flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Continue Shopping</span>
                </Link>
                <button
                  onClick={clearCart}
                  className="text-xs text-red-500 hover:underline font-medium"
                >
                  Clear Shopping Cart
                </button>
              </div>
            </div>
          </div>

          {/* Cart Summary (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl border border-brand-border/60 p-6 shadow-sm space-y-5">
              <h2 className="font-serif text-lg font-bold text-brand-dark border-b border-brand-border/60 pb-3">
                Order Summary
              </h2>

              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <label className="text-xs font-semibold text-brand-dark flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-brand-pink" />
                  <span>Have a coupon code?</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="e.g. STYLE10, STYLE200"
                    className="flex-1 px-3 py-2 border border-brand-border rounded-xl text-xs uppercase focus:outline-none focus:ring-2 focus:ring-brand-pink"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-brand-dark text-white rounded-xl text-xs font-semibold hover:bg-brand-pink transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {couponMessage && (
                  <p className={`text-xs ${couponMessage.error ? 'text-red-500' : 'text-emerald-600 font-semibold'}`}>
                    {couponMessage.text}
                  </p>
                )}
              </form>

              {/* Costs Breakdown */}
              <div className="space-y-3 pt-2 text-xs border-t border-brand-border/60">
                <div className="flex justify-between text-brand-dark">
                  <span>Subtotal</span>
                  <span className="font-semibold">৳ {subtotal.toLocaleString()}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount</span>
                    <span>- ৳ {discount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-brand-dark">
                  <span>Estimated Delivery</span>
                  <span>
                    {deliveryCharge === 0 ? (
                      <span className="text-emerald-600 font-bold uppercase">Free</span>
                    ) : (
                      `৳ ${deliveryCharge}`
                    )}
                  </span>
                </div>

                {subtotal < 2000 && (
                  <p className="text-[11px] text-brand-rose bg-brand-softPink/50 p-2 rounded-lg">
                    Add ৳ {(2000 - subtotal).toLocaleString()} more to qualify for <strong>Free Delivery!</strong>
                  </p>
                )}

                <div className="flex justify-between items-baseline pt-3 border-t border-brand-border/60 text-base font-bold text-brand-dark">
                  <span>Total</span>
                  <span className="font-serif text-2xl text-brand-pink">
                    ৳ {grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-4 bg-brand-gold hover:bg-brand-goldHover text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-brand-darkMuted pt-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Safe & Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
