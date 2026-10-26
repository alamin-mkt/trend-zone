import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Image as ImageIcon,
  Layers,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { Product, ProductVariant, Category } from '../types';
import { DataService } from '../services/dataService';

export const AdminProductForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [sku, setSku] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState<number>(0);
  const [salePrice, setSalePrice] = useState<number | ''>('');
  const [stockQuantity, setStockQuantity] = useState<number>(10);
  const [isVariable, setIsVariable] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isHot, setIsHot] = useState(false);
  const [isNew, setIsNew] = useState(true);

  // Images state
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop'
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Visual Variation Builder State
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [newVarTitle, setNewVarTitle] = useState('');
  const [newVarSku, setNewVarSku] = useState('');
  const [newVarPrice, setNewVarPrice] = useState<number>(0);
  const [newVarSalePrice, setNewVarSalePrice] = useState<number | ''>('');
  const [newVarStock, setNewVarStock] = useState<number>(10);
  const [newVarImage, setNewVarImage] = useState('');

  useEffect(() => {
    DataService.getCategories().then((cats) => {
      setCategories(cats);
      if (cats.length > 0 && !categoryId) {
        setCategoryId(cats[0].id);
      }
    });

    if (id) {
      DataService.getProductBySlug(id).then((p) => {
        if (p) {
          setName(p.name);
          setSlug(p.slug);
          setSku(p.sku);
          setCategoryId(p.category_id || '');
          setShortDescription(p.short_description || '');
          setDescription(p.description);
          setBasePrice(p.base_price);
          setSalePrice(p.sale_price ?? '');
          setStockQuantity(p.stock_quantity);
          setIsVariable(p.is_variable);
          setIsActive(p.is_active);
          setIsFeatured(p.is_featured);
          setIsHot(p.is_hot);
          setIsNew(p.is_new);
          if (p.images && p.images.length > 0) {
            setImages(p.images.map((img) => img.image_url));
          }
          if (p.variants) {
            setVariants(p.variants);
          }
        }
      });
    }
  }, [id]);

  // Auto generate slug from title
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
      if (!sku) {
        setSku(`SH-${Math.floor(1000 + Math.random() * 9000)}`);
      }
    }
  };

  // Add Image URL
  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Visual Variation Addition
  const handleAddVariant = () => {
    if (!newVarTitle.trim()) {
      alert('Please enter a variation title (e.g. "S / Pink" or "M / Black")');
      return;
    }

    const varSku = newVarSku.trim() || `${sku}-${variants.length + 1}`;
    const price = newVarPrice > 0 ? newVarPrice : basePrice;

    const newVariant: ProductVariant = {
      id: `var-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      product_id: id || 'temp',
      title: newVarTitle.trim(),
      sku: varSku,
      price: price,
      sale_price: newVarSalePrice !== '' ? Number(newVarSalePrice) : null,
      stock_quantity: newVarStock >= 0 ? newVarStock : 0,
      image_url: newVarImage.trim() || images[0] || '',
      is_active: true,
    };

    setVariants([...variants, newVariant]);
    setNewVarTitle('');
    setNewVarSku('');
    setNewVarPrice(basePrice);
    setNewVarSalePrice('');
    setNewVarStock(10);
    setNewVarImage('');
  };

  const handleRemoveVariant = (variantId: string) => {
    setVariants(variants.filter((v) => v.id !== variantId));
  };

  // Quick preset variant generator for sizes
  const handleGenerateSizePresets = () => {
    const sizes = ['S', 'M', 'L', 'XL'];
    const generated: ProductVariant[] = sizes.map((size, index) => ({
      id: `var-${Date.now()}-${index}`,
      product_id: id || 'temp',
      title: `Size: ${size}`,
      sku: `${sku || 'SH'}-${size}`,
      price: basePrice > 0 ? basePrice : 1500,
      sale_price: salePrice !== '' ? Number(salePrice) : null,
      stock_quantity: 10,
      image_url: images[0] || '',
      is_active: true,
    }));
    setVariants([...variants, ...generated]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Product name is required.');
      return;
    }

    if (basePrice <= 0) {
      setError('Regular price must be greater than 0.');
      return;
    }

    if (isVariable && variants.length === 0) {
      setError('Variable products must have at least one variation.');
      return;
    }

    setLoading(true);

    try {
      const formattedImages = images.map((url, i) => ({
        id: `img-${Date.now()}-${i}`,
        product_id: id || '',
        image_url: url,
        sort_order: i + 1,
        is_primary: i === 0,
      }));

      // If variable, total stock is sum of variants
      const totalStock = isVariable
        ? variants.reduce((sum, v) => sum + v.stock_quantity, 0)
        : stockQuantity;

      await DataService.saveProduct({
        id: id || undefined,
        name: name.trim(),
        slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        sku: sku.trim() || `SH-${Math.floor(1000 + Math.random() * 9000)}`,
        category_id: categoryId,
        short_description: shortDescription.trim(),
        description: description.trim(),
        base_price: Number(basePrice),
        sale_price: salePrice !== '' ? Number(salePrice) : null,
        stock_quantity: totalStock,
        is_variable: isVariable,
        is_active: isActive,
        is_featured: isFeatured,
        is_hot: isHot,
        is_new: isNew,
        images: formattedImages,
        variants: isVariable ? variants : undefined,
      });

      navigate('/admin/products');
    } catch (err: any) {
      setError(err.message || 'Failed to save product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back button & Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-brand-pink transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-serif text-2xl font-bold text-gray-900">
              {isEditing ? 'Edit Product' : 'Create New Product'}
            </h1>
            <p className="text-xs text-gray-500">
              Simple or Variable Women's Fashion & Lifestyle Item
            </p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-6 py-2.5 bg-brand-pink hover:bg-brand-rose text-white text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'Saving...' : 'Save Product'}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <h2 className="font-serif text-base font-bold text-gray-900 border-b pb-3">
            General Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Royal Dhakai Jamdani Saree"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-pink"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                URL Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-pink font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                SKU (Stock Keeping Unit)
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-pink font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-pink bg-white"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Short Description (Highlights)
            </label>
            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Brief 1-line boutique summary..."
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-pink"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Full Description & Craft Details
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed fabric, embroidery, occasion and care instructions..."
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-pink"
            />
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="font-serif text-base font-bold text-gray-900">
              Pricing & Product Type
            </h2>
            {/* Toggle Variable Product */}
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-brand-dark">
              <input
                type="checkbox"
                checked={isVariable}
                onChange={(e) => setIsVariable(e.target.checked)}
                className="w-4 h-4 rounded text-brand-pink accent-brand-pink"
              />
              <span className="flex items-center gap-1.5 text-brand-rose">
                <Layers className="w-4 h-4" />
                This is a Variable Product (Multiple Sizes/Colors)
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Regular Price (৳) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                value={basePrice}
                onChange={(e) => setBasePrice(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-pink"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Sale Price (৳) <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                type="number"
                min="0"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Leave blank if no discount"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-pink"
              />
            </div>

            {!isVariable && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Stock Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-pink"
                />
              </div>
            )}
          </div>
        </div>

        {/* VISUAL VARIATION BUILDER (Required by Prompt) */}
        {isVariable && (
          <div className="bg-white p-6 rounded-2xl border-2 border-brand-pink/30 shadow-sm space-y-5 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 gap-2">
              <div>
                <h2 className="font-serif text-base font-bold text-gray-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-brand-pink" />
                  <span>Visual Variation Manager</span>
                </h2>
                <p className="text-xs text-gray-500">
                  Each variation maintains its own separate price, sale price, stock inventory, and SKU.
                </p>
              </div>

              <button
                type="button"
                onClick={handleGenerateSizePresets}
                className="px-3.5 py-1.5 bg-brand-softPink hover:bg-brand-softPink/80 text-brand-rose text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors self-start"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>+ Auto Add S, M, L, XL</span>
              </button>
            </div>

            {/* Existing Variations Table */}
            {variants.length > 0 && (
              <div className="overflow-x-auto border border-gray-100 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-600 font-semibold text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3">Variation</th>
                      <th className="py-2.5 px-3">SKU</th>
                      <th className="py-2.5 px-3">Price (৳)</th>
                      <th className="py-2.5 px-3">Sale (৳)</th>
                      <th className="py-2.5 px-3">Stock</th>
                      <th className="py-2.5 px-3 text-right">Remove</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {variants.map((v) => (
                      <tr key={v.id} className="hover:bg-gray-50/50">
                        <td className="py-2.5 px-3 font-bold text-brand-dark">{v.title}</td>
                        <td className="py-2.5 px-3 font-mono text-gray-600">{v.sku}</td>
                        <td className="py-2.5 px-3">৳ {v.price}</td>
                        <td className="py-2.5 px-3 text-brand-pink font-semibold">
                          {v.sale_price ? `৳ ${v.sale_price}` : '—'}
                        </td>
                        <td className="py-2.5 px-3 font-semibold">{v.stock_quantity}</td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveVariant(v.id)}
                            className="p-1 text-gray-400 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Add New Variant Sub-form */}
            <div className="p-4 bg-brand-ivory/60 rounded-xl border border-brand-border/60 space-y-3">
              <span className="text-xs font-bold text-brand-dark block">
                Add Custom Variation:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 mb-1">
                    Variation Title (e.g. "Pink / M")
                  </label>
                  <input
                    type="text"
                    value={newVarTitle}
                    onChange={(e) => setNewVarTitle(e.target.value)}
                    placeholder="Size / Color"
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 mb-1">
                    Variant SKU
                  </label>
                  <input
                    type="text"
                    value={newVarSku}
                    onChange={(e) => setNewVarSku(e.target.value)}
                    placeholder="Auto if empty"
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 mb-1">
                    Price (৳)
                  </label>
                  <input
                    type="number"
                    value={newVarPrice || basePrice}
                    onChange={(e) => setNewVarPrice(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    value={newVarStock}
                    onChange={(e) => setNewVarStock(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="w-full py-2 bg-brand-pink text-white rounded-lg text-xs font-bold hover:bg-brand-rose transition-colors"
                  >
                    + Add Variation
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Images Manager */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <h2 className="font-serif text-base font-bold text-gray-900 border-b pb-3">
            Product Images
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {images.map((imgUrl, i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group">
                <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(i)}
                  className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                {i === 0 && (
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-brand-pink text-white text-[10px] font-bold rounded">
                    Primary
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-2">
            <input
              type="url"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="Paste image URL (e.g. from Unsplash or CDN)..."
              className="flex-1 px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-pink"
            />
            <button
              type="button"
              onClick={handleAddImage}
              className="px-4 py-2 bg-brand-dark text-white rounded-xl text-xs font-semibold hover:bg-brand-pink transition-colors"
            >
              Add Image
            </button>
          </div>
        </div>

        {/* Flags & Status */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <h2 className="font-serif text-base font-bold text-gray-900 border-b pb-3">
            Visibility & Badges
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-gray-800">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded text-brand-pink accent-brand-pink"
              />
              <span>Published & Active</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-semibold text-gray-800">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-brand-pink accent-brand-pink"
              />
              <span>Featured on Homepage</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-semibold text-gray-800">
              <input
                type="checkbox"
                checked={isHot}
                onChange={(e) => setIsHot(e.target.checked)}
                className="w-4 h-4 rounded text-brand-pink accent-brand-pink"
              />
              <span>"Hot" Trending Badge</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-semibold text-gray-800">
              <input
                type="checkbox"
                checked={isNew}
                onChange={(e) => setIsNew(e.target.checked)}
                className="w-4 h-4 rounded text-brand-pink accent-brand-pink"
              />
              <span>"New" Arrival Badge</span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-4">
          <Link
            to="/admin/products"
            className="px-6 py-2.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl hover:bg-gray-200 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-2.5 bg-brand-pink hover:bg-brand-rose text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
          >
            {loading ? 'Saving Product...' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
};
