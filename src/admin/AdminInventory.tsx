import React, { useState, useEffect } from 'react';
import { Warehouse, AlertTriangle, ArrowUpDown, Clock, CheckCircle2, X } from 'lucide-react';
import { Product, StockMovement } from '../types';
import { DataService } from '../services/dataService';

export const AdminInventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);

  // Stock Adjustment Modal
  const [adjustingProduct, setAdjustingProduct] = useState<{
    productId: string;
    productName: string;
    variantId?: string;
    variantTitle?: string;
    currentStock: number;
  } | null>(null);

  const [newStock, setNewStock] = useState<number>(0);
  const [reason, setReason] = useState('');

  const loadData = async () => {
    setLoading(true);
    const [prods, mvs] = await Promise.all([
      DataService.getProducts(),
      DataService.getStockMovements(),
    ]);
    setProducts(prods);
    setMovements(mvs);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAdjustModal = (
    productId: string,
    productName: string,
    currentStock: number,
    variantId?: string,
    variantTitle?: string
  ) => {
    setAdjustingProduct({ productId, productName, currentStock, variantId, variantTitle });
    setNewStock(currentStock);
    setReason('Manual Inventory Count');
  };

  const handleSaveStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingProduct) return;

    await DataService.adjustStock(
      adjustingProduct.productId,
      adjustingProduct.variantId,
      Number(newStock),
      reason.trim()
    );

    setAdjustingProduct(null);
    loadData();
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="font-serif text-2xl font-bold text-gray-900">Inventory & Stock Control</h1>
        <p className="text-xs text-gray-500">
          Monitor stock levels, set low inventory alerts, and view immutable stock movement logs.
        </p>
      </div>

      {/* Stock Table by Product and Variation */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-serif text-base font-bold text-gray-900">Live Product Inventory</h2>
          <span className="text-xs text-gray-500">
            {products.length} products tracked
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-600 uppercase font-semibold text-[11px] border-b border-gray-100">
              <tr>
                <th className="py-3 px-6">Product Item</th>
                <th className="py-3 px-6">Type / Variant</th>
                <th className="py-3 px-6">SKU</th>
                <th className="py-3 px-6">Available Stock</th>
                <th className="py-3 px-6">Stock Status</th>
                <th className="py-3 px-6 text-right">Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((p) => {
                if (p.is_variable && p.variants && p.variants.length > 0) {
                  return p.variants.map((v) => (
                    <tr key={v.id} className="hover:bg-gray-50/50">
                      <td className="py-3 px-6 font-semibold text-gray-900">{p.name}</td>
                      <td className="py-3 px-6 font-medium text-brand-rose">{v.title}</td>
                      <td className="py-3 px-6 font-mono text-gray-600">{v.sku}</td>
                      <td className="py-3 px-6 font-bold">{v.stock_quantity}</td>
                      <td className="py-3 px-6">
                        {v.stock_quantity <= 0 ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700">
                            Out of Stock
                          </span>
                        ) : v.stock_quantity < 5 ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">
                            Low Stock
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                            In Stock
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-6 text-right">
                        <button
                          type="button"
                          onClick={() => openAdjustModal(p.id, p.name, v.stock_quantity, v.id, v.title)}
                          className="px-3 py-1 bg-gray-100 hover:bg-brand-pink hover:text-white rounded-lg text-xs font-semibold transition-colors"
                        >
                          Adjust
                        </button>
                      </td>
                    </tr>
                  ));
                }

                return (
                  <tr key={p.id} className="hover:bg-gray-50/50">
                    <td className="py-3 px-6 font-semibold text-gray-900">{p.name}</td>
                    <td className="py-3 px-6 text-gray-400">Simple Product</td>
                    <td className="py-3 px-6 font-mono text-gray-600">{p.sku}</td>
                    <td className="py-3 px-6 font-bold">{p.stock_quantity}</td>
                    <td className="py-3 px-6">
                      {p.stock_quantity <= 0 ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700">
                          Out of Stock
                        </span>
                      ) : p.stock_quantity < 5 ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">
                          Low Stock
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                          In Stock
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-6 text-right">
                      <button
                        type="button"
                        onClick={() => openAdjustModal(p.id, p.name, p.stock_quantity)}
                        className="px-3 py-1 bg-gray-100 hover:bg-brand-pink hover:text-white rounded-lg text-xs font-semibold transition-colors"
                      >
                        Adjust
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Movements Audit Trail */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-serif text-base font-bold text-gray-900">Stock Movements History</h2>
          <p className="text-xs text-gray-500">Audit trail of order deductions, cancellations and adjustments</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-600 uppercase font-semibold text-[11px] border-b border-gray-100">
              <tr>
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6">Product / Item</th>
                <th className="py-3 px-6">Event Type</th>
                <th className="py-3 px-6">Change</th>
                <th className="py-3 px-6">Reason / Ref</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {movements.slice(0, 10).map((mv) => (
                <tr key={mv.id} className="hover:bg-gray-50/50">
                  <td className="py-3 px-6 text-gray-500">
                    {new Date(mv.created_at).toLocaleString()}
                  </td>
                  <td className="py-3 px-6">
                    <span className="font-semibold text-gray-900 block">{mv.product_name}</span>
                    {mv.variant_title && (
                      <span className="text-[10px] text-brand-rose">{mv.variant_title}</span>
                    )}
                  </td>
                  <td className="py-3 px-6">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        mv.movement_type === 'ORDER_PLACED'
                          ? 'bg-blue-100 text-blue-700'
                          : mv.movement_type === 'ORDER_CANCELLED'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {mv.movement_type}
                    </span>
                  </td>
                  <td className="py-3 px-6 font-mono font-bold">
                    <span className={mv.quantity_change > 0 ? 'text-emerald-600' : 'text-red-600'}>
                      {mv.quantity_change > 0 ? `+${mv.quantity_change}` : mv.quantity_change}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-gray-600">{mv.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Modal */}
      {adjustingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-boutique-lg space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif text-base font-bold text-gray-900">
                Adjust Inventory Stock
              </h3>
              <button onClick={() => setAdjustingProduct(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStock} className="space-y-4 text-xs">
              <div className="p-3 bg-brand-ivory rounded-xl">
                <p className="font-bold text-brand-dark">{adjustingProduct.productName}</p>
                {adjustingProduct.variantTitle && (
                  <p className="text-brand-rose text-[11px]">{adjustingProduct.variantTitle}</p>
                )}
                <p className="text-gray-500 mt-1">Current Stock: {adjustingProduct.currentStock}</p>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">New Stock Quantity</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={newStock}
                  onChange={(e) => setNewStock(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-brand-pink font-bold text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Reason for Adjustment</label>
                <input
                  type="text"
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Physical inventory recount / Restocked from supplier"
                  className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-brand-pink"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setAdjustingProduct(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-pink text-white rounded-xl font-semibold hover:bg-brand-rose"
                >
                  Save Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
