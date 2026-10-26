import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Truck,
  RotateCcw,
  AlertTriangle,
  X,
  FileText
} from 'lucide-react';
import { Order, OrderStatus, PaymentStatus } from '../types';
import { DataService } from '../services/dataService';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Selected Order for Details Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  const loadOrders = async () => {
    setLoading(true);
    const data = await DataService.getOrders();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    await DataService.updateOrderStatus(orderId, status);
    loadOrders();
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, order_status: status });
    }
  };

  const handleUpdatePayment = async (orderId: string, status: PaymentStatus) => {
    await DataService.updatePaymentStatus(orderId, status);
    loadOrders();
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, payment_status: status });
    }
  };

  const handleCancelAndRestoreStock = async (orderId: string) => {
    if (!window.confirm('Are you sure you want to cancel this order? This will automatically restore the product & variant inventory back to stock.')) {
      return;
    }
    await DataService.cancelOrderAndRestoreStock(orderId, cancellationReason || 'Cancelled by Admin');
    setIsCancelling(false);
    setCancellationReason('');
    loadOrders();
    setSelectedOrder(null);
  };

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    const matchesSearch =
      o.order_number.toLowerCase().includes(q) ||
      o.customer_name.toLowerCase().includes(q) ||
      o.customer_phone.includes(q) ||
      (o.manual_payment_trx_id && o.manual_payment_trx_id.toLowerCase().includes(q));

    const matchesStatus = statusFilter === 'all' || o.order_status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || o.payment_status === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="font-serif text-2xl font-bold text-gray-900">Order Management</h1>
        <p className="text-xs text-gray-500">
          Verify manual bKash/Nagad transactions, manage parcel shipping, and safely handle stock restoration
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order #, phone, customer, or TrxID..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-pink"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-pink bg-white"
          >
            <option value="all">All Order Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          {/* Payment Status Filter */}
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-pink bg-white"
          >
            <option value="all">All Payment Statuses</option>
            <option value="Unpaid">Unpaid</option>
            <option value="Awaiting Verification">Awaiting Verification</option>
            <option value="Paid">Paid</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="w-10 h-10 border-4 border-brand-pink border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-500">
            No orders match the specified criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-600 uppercase font-semibold text-[11px] border-b border-gray-100">
                <tr>
                  <th className="py-3 px-6">Order #</th>
                  <th className="py-3 px-6">Customer & Phone</th>
                  <th className="py-3 px-6">Method & TrxID</th>
                  <th className="py-3 px-6">Total (৳)</th>
                  <th className="py-3 px-6">Payment</th>
                  <th className="py-3 px-6">Order Status</th>
                  <th className="py-3 px-6 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3.5 px-6 font-mono font-bold text-brand-rose">
                      {order.order_number}
                    </td>
                    <td className="py-3.5 px-6">
                      <span className="font-bold text-gray-900 block">{order.customer_name}</span>
                      <span className="text-[11px] text-gray-500">{order.customer_phone}</span>
                    </td>
                    <td className="py-3.5 px-6">
                      <span className="uppercase font-semibold text-gray-800 block">
                        {order.payment_method}
                      </span>
                      {order.manual_payment_trx_id ? (
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 font-bold">
                          Trx: {order.manual_payment_trx_id}
                        </span>
                      ) : (
                        <span className="text-[10px] text-gray-400">Cash on Delivery</span>
                      )}
                    </td>
                    <td className="py-3.5 px-6 font-semibold text-gray-900">
                      ৳ {order.total_amount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-6">
                      <select
                        value={order.payment_status}
                        onChange={(e) => handleUpdatePayment(order.id, e.target.value as PaymentStatus)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                          order.payment_status === 'Paid'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : order.payment_status === 'Awaiting Verification'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-gray-50 text-gray-600 border-gray-200'
                        }`}
                      >
                        <option value="Unpaid">Unpaid</option>
                        <option value="Awaiting Verification">Awaiting Verification</option>
                        <option value="Paid">Paid</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-6">
                      <select
                        value={order.order_status}
                        disabled={order.order_status === 'Cancelled'}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                          order.order_status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                            : order.order_status === 'Processing'
                            ? 'bg-cyan-100 text-cyan-800 border-cyan-200'
                            : order.order_status === 'Cancelled'
                            ? 'bg-red-100 text-red-800 border-red-200'
                            : 'bg-amber-100 text-amber-800 border-amber-200'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-3 py-1 bg-brand-softPink hover:bg-brand-softPink/80 text-brand-rose font-semibold rounded-lg text-xs transition-colors"
                      >
                        View & Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-boutique-lg space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <span className="text-xs text-brand-darkMuted font-mono">Order Details</span>
                <h2 className="font-serif text-xl font-bold text-gray-900">
                  {selectedOrder.order_number}
                </h2>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Address Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-brand-ivory/60 rounded-2xl border border-brand-border/60 text-xs">
              <div>
                <span className="font-bold text-brand-dark block mb-1">Customer Information</span>
                <p>Name: <strong>{selectedOrder.customer_name}</strong></p>
                <p>Phone: <strong>{selectedOrder.customer_phone}</strong></p>
                {selectedOrder.customer_email && <p>Email: {selectedOrder.customer_email}</p>}
              </div>

              <div>
                <span className="font-bold text-brand-dark block mb-1">Shipping Destination</span>
                <p>{selectedOrder.street_address}</p>
                <p>{selectedOrder.area}, {selectedOrder.district}, {selectedOrder.division}</p>
                {selectedOrder.delivery_notes && (
                  <p className="text-brand-rose mt-1">Note: {selectedOrder.delivery_notes}</p>
                )}
              </div>
            </div>

            {/* Manual Payment Verification Box */}
            <div className="p-4 rounded-2xl bg-brand-softPink/30 border border-brand-pink/30 space-y-2 text-xs">
              <span className="font-bold text-brand-rose block">Payment Verification</span>
              <p>Method: <strong className="uppercase">{selectedOrder.payment_method}</strong></p>
              {selectedOrder.manual_payment_trx_id && (
                <p>
                  Transaction ID (TrxID):{' '}
                  <strong className="font-mono bg-white px-2 py-0.5 rounded border">
                    {selectedOrder.manual_payment_trx_id}
                  </strong>
                </p>
              )}
              {selectedOrder.manual_payment_sender_phone && (
                <p>Sender Phone: <strong>{selectedOrder.manual_payment_sender_phone}</strong></p>
              )}

              <div className="flex items-center gap-2 pt-2">
                <span className="font-semibold text-gray-700">Set Payment Status:</span>
                <button
                  type="button"
                  onClick={() => handleUpdatePayment(selectedOrder.id, 'Paid')}
                  className="px-3 py-1 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700"
                >
                  Mark Paid
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdatePayment(selectedOrder.id, 'Rejected')}
                  className="px-3 py-1 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700"
                >
                  Reject Payment
                </button>
              </div>
            </div>

            {/* Line items table */}
            <div>
              <span className="font-serif font-bold text-sm text-gray-900 block mb-3">
                Ordered Items
              </span>
              <div className="border border-gray-100 rounded-xl overflow-hidden divide-y text-xs">
                {selectedOrder.items?.map((item) => (
                  <div key={item.id} className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image_url || '/placeholder.jpg'}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover border"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">{item.product_name}</p>
                        {item.variant_title && (
                          <p className="text-[10px] text-brand-rose">{item.variant_title}</p>
                        )}
                        <p className="text-gray-400">SKU: {item.sku || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-brand-pink">
                        {item.quantity} × ৳ {item.unit_price.toLocaleString()}
                      </p>
                      <p className="font-semibold text-gray-900">৳ {item.subtotal.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Calculation */}
              <div className="pt-3 space-y-1 text-xs text-right">
                <p>Subtotal: <strong>৳ {selectedOrder.subtotal.toLocaleString()}</strong></p>
                <p>Delivery: <strong>৳ {selectedOrder.delivery_charge}</strong></p>
                {selectedOrder.discount_amount > 0 && (
                  <p className="text-emerald-600">Discount: - ৳ {selectedOrder.discount_amount}</p>
                )}
                <p className="text-base font-serif font-bold text-brand-pink pt-1 border-t">
                  Total: ৳ {selectedOrder.total_amount.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Cancellation & Stock Restoration */}
            {selectedOrder.order_status !== 'Cancelled' ? (
              <div className="pt-4 border-t space-y-3">
                {!isCancelling ? (
                  <button
                    type="button"
                    onClick={() => setIsCancelling(true)}
                    className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold rounded-xl flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Cancel Order & Restore Inventory</span>
                  </button>
                ) : (
                  <div className="p-4 bg-red-50 rounded-2xl border border-red-200 space-y-3 text-xs">
                    <p className="font-bold text-red-700">Confirm Order Cancellation</p>
                    <input
                      type="text"
                      value={cancellationReason}
                      onChange={(e) => setCancellationReason(e.target.value)}
                      placeholder="Reason for cancellation (e.g. Customer requested, payment failed)..."
                      className="w-full px-3 py-2 border border-red-200 rounded-xl bg-white"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleCancelAndRestoreStock(selectedOrder.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700"
                      >
                        Confirm Cancellation & Restore Stock
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsCancelling(false)}
                        className="px-3 py-2 bg-gray-200 text-gray-700 rounded-xl font-semibold"
                      >
                        Back
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-3 bg-red-100 text-red-800 rounded-xl text-xs font-bold">
                This order has already been cancelled and its inventory was safely restored.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
