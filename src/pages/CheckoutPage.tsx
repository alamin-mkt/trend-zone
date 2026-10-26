import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  ShoppingBag,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Lock,
  ChevronRight
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { PaymentSetting, StoreGeneralSettings } from '../types';
import { DataService } from '../services/dataService';

const BD_DIVISIONS = [
  'Dhaka',
  'Chattogram',
  'Rajshahi',
  'Khulna',
  'Barishal',
  'Sylhet',
  'Rangpur',
  'Mymensingh',
];

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, subtotal, clearCart } = useCart();
  const { user } = useAuth();

  const [paymentSettings, setPaymentSettings] = useState<PaymentSetting[]>([]);
  const [storeSettings, setStoreSettings] = useState<StoreGeneralSettings | null>(null);

  // Form Fields
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [division, setDivision] = useState('Dhaka');
  const [district, setDistrict] = useState('Dhaka');
  const [area, setArea] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  // Payment Selection
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'cod' | 'bkash' | 'nagad' | 'rocket'>('cod');
  const [manualTrxId, setManualTrxId] = useState('');
  const [manualSenderPhone, setManualSenderPhone] = useState('');

  // Coupon
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  // States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    DataService.getPaymentSettings().then(setPaymentSettings);
    DataService.getStoreSettings().then(setStoreSettings);
  }, []);

  // Compute dynamic delivery charge
  const isInsideDhaka = division.toLowerCase() === 'dhaka';
  const freeThreshold = storeSettings?.free_delivery_threshold ?? 2000;
  const isFreeDelivery = subtotal >= freeThreshold;

  const baseDeliveryCharge = isInsideDhaka
    ? (storeSettings?.delivery_inside_dhaka ?? 60)
    : (storeSettings?.delivery_outside_dhaka ?? 120);

  const deliveryCharge = isFreeDelivery ? 0 : baseDeliveryCharge;
  const grandTotal = Math.max(0, subtotal - discount + deliveryCharge);

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-16 h-16 text-brand-pink mx-auto mb-4" />
        <h2 className="font-serif text-2xl font-bold text-brand-dark mb-2">No items to checkout</h2>
        <p className="text-xs text-brand-darkMuted mb-6">Your shopping cart is currently empty.</p>
        <Link
          to="/products"
          className="px-6 py-2.5 bg-brand-pink text-white font-semibold rounded-full text-xs hover:bg-brand-rose transition-colors"
        >
          Explore Catalog
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!customerName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    const cleanPhone = customerPhone.trim().replace(/[^0-9]/g, '');
    if (cleanPhone.length < 11 || (!cleanPhone.startsWith('01') && !cleanPhone.startsWith('8801'))) {
      setErrorMessage('Please provide a valid 11-digit Bangladeshi mobile number (e.g. 01712345678).');
      return;
    }

    if (!division || !district.trim() || !area.trim() || !streetAddress.trim()) {
      setErrorMessage('Please fill in complete delivery address details.');
      return;
    }

    if (selectedPaymentMethod !== 'cod' && !manualTrxId.trim()) {
      setErrorMessage(`Please enter the ${selectedPaymentMethod.toUpperCase()} Transaction ID (TrxID).`);
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate unique idempotency key
      const idempotencyKey = `idemp-${Date.now()}-${Math.random().toString(36).substring(7)}`;

      const result = await DataService.createOrderSecure({
        customerName: customerName.trim(),
        customerPhone: cleanPhone,
        customerEmail: customerEmail.trim() || undefined,
        division,
        district: district.trim(),
        area: area.trim(),
        streetAddress: streetAddress.trim(),
        deliveryNotes: deliveryNotes.trim() || undefined,
        paymentMethod: selectedPaymentMethod,
        manualTrxId: manualTrxId.trim() || undefined,
        manualSenderPhone: manualSenderPhone.trim() || undefined,
        deliveryCharge,
        couponCode: couponCode || undefined,
        items: cart.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          quantity: i.quantity,
        })),
        idempotencyKey,
      });

      if (result.success) {
        clearCart();
        navigate(`/order-confirmation/${result.orderNumber}`);
      } else {
        setErrorMessage(result.message || 'Failed to place order. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred while processing your order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedSetting = paymentSettings.find((p) => p.method_code === selectedPaymentMethod);

  return (
    <div className="bg-brand-ivory/30 py-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-brand-darkMuted mb-6">
          <Link to="/" className="hover:text-brand-pink transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/cart" className="hover:text-brand-pink transition-colors">Cart</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-brand-pink font-semibold">Checkout</span>
        </div>

        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-dark mb-8">
          Complete Your Order
        </h1>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Customer & Shipping Information (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Customer Details */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-border/60 shadow-sm space-y-4">
              <h2 className="font-serif text-lg font-bold text-brand-dark flex items-center gap-2 border-b border-brand-border/60 pb-3">
                <span className="w-6 h-6 rounded-full bg-brand-pink text-white text-xs flex items-center justify-center font-sans">1</span>
                <span>Customer & Contact Information</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-dark mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Rahima Sultana"
                    className="w-full px-3.5 py-2.5 border border-brand-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-pink"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-dark mb-1.5">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. 01712345678"
                    className="w-full px-3.5 py-2.5 border border-brand-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-pink"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-dark mb-1.5">
                  Email Address <span className="text-gray-400 font-normal">(Optional, for invoice)</span>
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 border border-brand-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-pink"
                />
              </div>
            </div>

            {/* Step 2: Shipping Address */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-border/60 shadow-sm space-y-4">
              <h2 className="font-serif text-lg font-bold text-brand-dark flex items-center gap-2 border-b border-brand-border/60 pb-3">
                <span className="w-6 h-6 rounded-full bg-brand-pink text-white text-xs flex items-center justify-center font-sans">2</span>
                <span>Delivery Address (Bangladesh)</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-dark mb-1.5">
                    Division <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={division}
                    onChange={(e) => setDivision(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-brand-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-pink bg-white"
                  >
                    {BD_DIVISIONS.map((div) => (
                      <option key={div} value={div}>
                        {div}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-dark mb-1.5">
                    District / City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="e.g. Dhaka / Chattogram"
                    className="w-full px-3.5 py-2.5 border border-brand-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-pink"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-dark mb-1.5">
                  Thana / Area <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. Dhanmondi / Gulshan-2 / GEC Circle"
                  className="w-full px-3.5 py-2.5 border border-brand-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-pink"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-dark mb-1.5">
                  Full Street Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="House number, road number, flat/floor details..."
                  className="w-full px-3.5 py-2.5 border border-brand-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-pink"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-dark mb-1.5">
                  Delivery Notes <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  placeholder="e.g. Call before delivery, ring the bell"
                  className="w-full px-3.5 py-2.5 border border-brand-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-pink"
                />
              </div>
            </div>

            {/* Step 3: Payment Method Selection */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-border/60 shadow-sm space-y-4">
              <h2 className="font-serif text-lg font-bold text-brand-dark flex items-center gap-2 border-b border-brand-border/60 pb-3">
                <span className="w-6 h-6 rounded-full bg-brand-pink text-white text-xs flex items-center justify-center font-sans">3</span>
                <span>Payment Method</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Cash on Delivery */}
                <label
                  className={`p-4 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                    selectedPaymentMethod === 'cod'
                      ? 'border-brand-pink bg-brand-softPink/30'
                      : 'border-brand-border hover:bg-brand-ivory'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={selectedPaymentMethod === 'cod'}
                    onChange={() => setSelectedPaymentMethod('cod')}
                    className="mt-1 accent-brand-pink"
                  />
                  <div>
                    <span className="font-bold text-xs text-brand-dark block">Cash on Delivery</span>
                    <span className="text-[11px] text-brand-darkMuted">Pay cash at your doorstep</span>
                  </div>
                </label>

                {/* bKash Manual */}
                <label
                  className={`p-4 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                    selectedPaymentMethod === 'bkash'
                      ? 'border-brand-pink bg-brand-softPink/30'
                      : 'border-brand-border hover:bg-brand-ivory'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bkash"
                    checked={selectedPaymentMethod === 'bkash'}
                    onChange={() => setSelectedPaymentMethod('bkash')}
                    className="mt-1 accent-brand-pink"
                  />
                  <div>
                    <span className="font-bold text-xs text-pink-600 block">bKash Manual</span>
                    <span className="text-[11px] text-brand-darkMuted">Send Money & verify TrxID</span>
                  </div>
                </label>

                {/* Nagad Manual */}
                <label
                  className={`p-4 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                    selectedPaymentMethod === 'nagad'
                      ? 'border-brand-pink bg-brand-softPink/30'
                      : 'border-brand-border hover:bg-brand-ivory'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="nagad"
                    checked={selectedPaymentMethod === 'nagad'}
                    onChange={() => setSelectedPaymentMethod('nagad')}
                    className="mt-1 accent-brand-pink"
                  />
                  <div>
                    <span className="font-bold text-xs text-orange-600 block">Nagad Manual</span>
                    <span className="text-[11px] text-brand-darkMuted">Send Money & verify TrxID</span>
                  </div>
                </label>

                {/* Rocket Manual */}
                <label
                  className={`p-4 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                    selectedPaymentMethod === 'rocket'
                      ? 'border-brand-pink bg-brand-softPink/30'
                      : 'border-brand-border hover:bg-brand-ivory'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="rocket"
                    checked={selectedPaymentMethod === 'rocket'}
                    onChange={() => setSelectedPaymentMethod('rocket')}
                    className="mt-1 accent-brand-pink"
                  />
                  <div>
                    <span className="font-bold text-xs text-purple-600 block">Rocket Manual</span>
                    <span className="text-[11px] text-brand-darkMuted">DBBL Rocket Mobile</span>
                  </div>
                </label>
              </div>

              {/* Dynamic Instructions Box for Manual Mobile Payment */}
              {selectedPaymentMethod !== 'cod' && selectedSetting && (
                <div className="mt-4 p-5 rounded-2xl bg-brand-softPink/40 border border-brand-pink/30 space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-brand-rose">
                      Our {selectedSetting.display_name} Number:
                    </span>
                    <span className="px-3 py-1 bg-white border border-brand-pink rounded-lg font-mono font-bold text-brand-dark">
                      {selectedSetting.account_number || '01712345678'} ({selectedSetting.account_type || 'Personal'})
                    </span>
                  </div>

                  {selectedSetting.instructions && (
                    <div className="bg-white/80 p-3.5 rounded-xl text-xs text-brand-dark leading-relaxed whitespace-pre-line border border-brand-border/60">
                      {selectedSetting.instructions}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-brand-dark mb-1">
                        Transaction ID (TrxID) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={manualTrxId}
                        onChange={(e) => setManualTrxId(e.target.value.trim().toUpperCase())}
                        placeholder="e.g. 9H38KJ2L9"
                        className="w-full px-3 py-2 border border-brand-border rounded-xl text-xs uppercase font-mono font-bold focus:outline-none focus:ring-2 focus:ring-brand-pink bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-brand-dark mb-1">
                        Sender Phone Number <span className="text-gray-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="tel"
                        value={manualSenderPhone}
                        onChange={(e) => setManualSenderPhone(e.target.value)}
                        placeholder="e.g. 01712345678"
                        className="w-full px-3 py-2 border border-brand-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-pink bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary & Confirm (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-brand-border/60 p-6 shadow-sm space-y-5 sticky top-28">
              <h2 className="font-serif text-lg font-bold text-brand-dark border-b border-brand-border/60 pb-3">
                Order Review ({cart.length} {cart.length === 1 ? 'item' : 'items'})
              </h2>

              {/* Items List */}
              <div className="max-h-60 overflow-y-auto divide-y divide-gray-100 pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.variant?.image_url || item.product.images?.[0]?.image_url || '/placeholder.jpg'}
                        alt={item.product.name}
                        className="w-12 h-12 rounded-lg object-cover border border-brand-border flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-brand-dark truncate">{item.product.name}</p>
                        {item.variant && (
                          <p className="text-[11px] text-brand-rose">{item.variant.title}</p>
                        )}
                        <p className="text-gray-400">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-brand-pink flex-shrink-0">
                      ৳ {item.totalPrice.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2.5 pt-3 border-t border-brand-border/60 text-xs">
                <div className="flex justify-between text-brand-dark">
                  <span>Subtotal</span>
                  <span className="font-semibold">৳ {subtotal.toLocaleString()}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount</span>
                    <span>- ৳ {discount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-brand-dark">
                  <span>Delivery ({isInsideDhaka ? 'Inside Dhaka' : 'Outside Dhaka'})</span>
                  <span>
                    {isFreeDelivery ? (
                      <span className="text-emerald-600 font-bold uppercase">Free</span>
                    ) : (
                      `৳ ${deliveryCharge}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-baseline pt-3 border-t border-brand-border/60 text-base font-bold text-brand-dark">
                  <span>Total Payable</span>
                  <span className="font-serif text-2xl text-brand-pink">
                    ৳ {grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-brand-gold hover:bg-brand-goldHover disabled:bg-gray-400 text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Confirm Order (৳ {grandTotal.toLocaleString()})</span>
                  </>
                )}
              </button>

              <div className="text-[11px] text-center text-brand-darkMuted space-y-1">
                <p>By clicking "Confirm Order", you agree to Trend Zone's Terms & Return Policy.</p>
                <div className="flex items-center justify-center gap-1.5 text-emerald-600 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Safe & Authentic Bangladesh Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
