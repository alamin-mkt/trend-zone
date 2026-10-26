import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Eye, AlertTriangle, Layers } from 'lucide-react';
import { Product, Category } from '../types';
import { DataService } from '../services/dataService';

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const [prods, cats] = await Promise.all([
      DataService.getProducts(),
      DataService.getCategories(),
    ]);
    setProducts(prods);
    setCategories(cats);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      await DataService.deleteProduct(id);
      loadData();
    }
  };

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || p.category_id === selectedCategory || p.category?.slug === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">Product Catalog</h1>
          <p className="text-xs text-gray-500">
            Manage both Simple and Variable clothing & lifestyle items
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-pink hover:bg-brand-rose text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or SKU..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-pink"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-pink bg-white"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="w-10 h-10 border-4 border-brand-pink border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-500">
            No products found matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-600 uppercase font-semibold text-[11px] border-b border-gray-100">
                <tr>
                  <th className="py-3 px-6">Product</th>
                  <th className="py-3 px-6">SKU</th>
                  <th className="py-3 px-6">Category</th>
                  <th className="py-3 px-6">Type</th>
                  <th className="py-3 px-6">Price (৳)</th>
                  <th className="py-3 px-6">Stock</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((product) => {
                  const isLow = product.stock_quantity < 5;
                  const thumb = product.images?.[0]?.image_url || '/placeholder.jpg';
                  return (
                    <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={thumb}
                            alt=""
                            className="w-12 h-12 rounded-xl object-cover border border-gray-100 flex-shrink-0"
                          />
                          <div>
                            <span className="font-semibold text-gray-900 block line-clamp-1">
                              {product.name}
                            </span>
                            {product.is_featured && (
                              <span className="text-[10px] text-brand-gold font-bold">Featured</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-6 font-mono font-medium text-gray-600">{product.sku}</td>
                      <td className="py-3 px-6 font-medium text-gray-700">
                        {product.category?.name || 'Unassigned'}
                      </td>
                      <td className="py-3 px-6">
                        {product.is_variable ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 inline-flex items-center gap-1">
                            <Layers className="w-3 h-3" />
                            Variable ({product.variants?.length || 0})
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-600">
                            Simple
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-6 font-semibold text-gray-900">
                        ৳ {(product.sale_price ?? product.base_price).toLocaleString()}
                        {product.sale_price && (
                          <span className="block text-[10px] text-gray-400 line-through">
                            ৳ {product.base_price.toLocaleString()}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-6">
                        <span
                          className={`font-semibold ${
                            product.stock_quantity <= 0
                              ? 'text-red-600'
                              : isLow
                              ? 'text-amber-600'
                              : 'text-emerald-600'
                          }`}
                        >
                          {product.stock_quantity}
                        </span>
                      </td>
                      <td className="py-3 px-6">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            product.is_active
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {product.is_active ? 'Active' : 'Draft'}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-right space-x-2">
                        <Link
                          to={`/product/${product.slug}`}
                          target="_blank"
                          className="p-1.5 text-gray-400 hover:text-brand-pink inline-block transition-colors"
                          title="View on site"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/admin/products/edit/${product.id}`}
                          className="p-1.5 text-gray-400 hover:text-brand-rose inline-block transition-colors"
                          title="Edit product"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          className="p-1.5 text-gray-400 hover:text-red-600 inline-block transition-colors"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
