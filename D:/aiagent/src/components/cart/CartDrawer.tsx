import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { Link, useNavigate } from 'react-router-dom';

export const CartDrawer: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, subtotal, totalItems, isDrawerOpen, closeDrawer } = useCart();
  const navigate = useNavigate();

  if (!isDrawerOpen) return null;

  const handleCheckout = () => {
    closeDrawer();
    navigate('/checkout');
  };

  const handleViewCart = () => {
    closeDrawer();
    navigate('/cart');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-brand-dark/40 backdrop-blur-sm transition-opacity"
        onClick={closeDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-drawer flex flex-col">
          {/* Drawer Header */}
          <div className="px-6 py-5 border-b border-brand-border flex items-center justify-between bg-brand-ivory">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-pink" />
              <h2 className="text-lg font-serif font-bold text-brand-dark">
                Your Cart <span className="text-brand-pink">({totalItems})</span>
              </h2>
            </div>
            <button
              onClick={closeDrawer}
              className="p-2 text-brand-darkMuted hover:text-brand-pink hover:bg-brand-softPink/50 rounded-full transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-gray-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 rounded-full bg-brand-softPink flex items-center justify-center text-brand-pink mb-4">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="font-serif text-lg font-bold text-brand-dark mb-1">Your cart is empty</h3>
                <p className="text-sm text-brand-darkMuted mb-6 max-w-xs">
                  Looks like you haven't added anything to your cart yet. Discover our latest boutique arrivals!
                </p>
                <button
                  onClick={() => {
                    closeDrawer();
                    navigate('/products');
                  }}
                  className="px-6 py-2.5 bg-brand-pink text-white font-medium rounded-full shadow-sm hover:bg-brand-rose transition-all flex items-center gap-2"
                >
                  Start Shopping
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="py-4 flex gap-4 items-center group">
                  <img
                    src={item.variant?.image_url || item.product.images?.[0]?.image_url || '/placeholder.jpg'}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-xl border border-brand-border/60 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <Link
                        to={`/product/${item.product.slug}`}
                        onClick={closeDrawer}
                        className="font-medium text-brand-dark text-sm hover:text-brand-pink transition-colors line-clamp-1"
                      >
                        {item.product.name}
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 p-1 transition-colors ml-2"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {item.variant && (
                      <p className="text-xs text-brand-rose/80 font-medium mt-0.5">
                        {item.variant.title}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-3">
                      <span className="font-bold text-brand-pink text-sm">
                        ৳ {item.unitPrice.toLocaleString()}
                      </span>

                      {/* Stepper */}
                      <div className="flex items-center border border-brand-border rounded-lg bg-brand-ivory/50">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-brand-dark hover:bg-brand-softPink/60 rounded-l-lg transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-semibold text-brand-dark">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-brand-dark hover:bg-brand-softPink/60 rounded-r-lg transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          {cart.length > 0 && (
            <div className="border-t border-brand-border p-6 bg-brand-ivory/60 space-y-4">
              <div className="flex justify-between items-center text-base font-semibold text-brand-dark">
                <span>Subtotal</span>
                <span className="text-xl font-bold font-serif text-brand-pink">
                  ৳ {subtotal.toLocaleString()}
                </span>
              </div>

              <div className="space-y-2.5">
                {/* View Cart Button (Pink) */}
                <button
                  onClick={handleViewCart}
                  className="w-full py-3 px-4 bg-brand-pink hover:bg-brand-rose text-white font-medium rounded-xl text-center shadow-boutique transition-all transform active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  View Cart
                </button>

                {/* Checkout Button (Gold) */}
                <button
                  onClick={handleCheckout}
                  className="w-full py-3 px-4 bg-brand-gold hover:bg-brand-goldHover text-white font-semibold rounded-xl text-center shadow-md transition-all transform active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  Checkout
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[11px] text-center text-brand-darkMuted">
                Taxes & shipping calculated at checkout. Free shipping over ৳ 2000!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
