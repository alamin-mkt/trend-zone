import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Heart,
  Star,
  ShoppingBag,
  Truck,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  Minus,
  Plus,
  Share2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Product, ProductVariant } from '../types';
import { DataService } from '../services/dataService';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { ProductCard } from '../components/products/ProductCard';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Gallery state
  const [selectedImage, setSelectedImage] = useState<string>('');

  // Variant & Quantity state
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'delivery'>('desc');
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    DataService.getProductBySlug(slug).then(async (data) => {
      setProduct(data);
      if (data) {
        setSelectedImage(data.images?.[0]?.image_url || '/placeholder.jpg');
        if (data.is_variable && data.variants && data.variants.length > 0) {
          const firstAvailable = data.variants.find((v) => v.stock_quantity > 0) || data.variants[0];
          setSelectedVariant(firstAvailable);
          if (firstAvailable.image_url) {
            setSelectedImage(firstAvailable.image_url);
          }
        }
        // Fetch related products
        const all = await DataService.getProducts();
        setRelatedProducts(all.filter((p) => p.id !== data.id).slice(0, 4));
      }
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-brand-pink border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-2xl font-bold text-brand-dark mb-4">Product Not Found</h2>
        <p className="text-sm text-brand-darkMuted mb-6">The item you are looking for is unavailable.</p>
        <Link
          to="/products"
          className="px-6 py-2.5 bg-brand-pink text-white rounded-full font-medium text-xs hover:bg-brand-rose transition-colors"
        >
          Browse All Products
        </Link>
      </div>
    );
  }

  const isLiked = isInWishlist(product.id);

  // Dynamic pricing based on selected variant
  const currentPrice = selectedVariant
    ? (selectedVariant.sale_price ?? selectedVariant.price)
    : (product.sale_price ?? product.base_price);

  const regularPrice = selectedVariant ? selectedVariant.price : product.base_price;
  const hasSale = currentPrice < regularPrice;
  const discountPercent = hasSale ? Math.round(((regularPrice - currentPrice) / regularPrice) * 100) : 0;

  const currentStock = selectedVariant ? selectedVariant.stock_quantity : product.stock_quantity;
  const currentSku = selectedVariant ? selectedVariant.sku : product.sku;

  const handleVariantSelect = (v: ProductVariant) => {
    setSelectedVariant(v);
    if (v.image_url) {
      setSelectedImage(v.image_url);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedVariant, quantity);
    navigate('/checkout');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <div className="bg-brand-ivory/30 py-8 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-brand-darkMuted mb-8">
          <Link to="/" className="hover:text-brand-pink transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/products" className="hover:text-brand-pink transition-colors">Products</Link>
          {product.category && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link to={`/category/${product.category.slug}`} className="hover:text-brand-pink transition-colors">
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-brand-pink font-semibold truncate max-w-xs">{product.name}</span>
        </div>

        {/* Main Details Section */}
        <div className="bg-white rounded-3xl border border-brand-border/60 p-6 sm:p-10 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Image Gallery (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-brand-ivory border border-brand-border/60">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.is_hot && (
                  <span className="absolute top-4 left-4 px-3 py-1 bg-brand-pink text-white text-xs font-bold uppercase rounded-full shadow-sm">
                    Hot
                  </span>
                )}
                {hasSale && (
                  <span className="absolute top-4 right-4 px-3 py-1 bg-brand-gold text-white text-xs font-bold uppercase rounded-full shadow-sm">
                    -{discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {product.images.map((img) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImage(img.image_url)}
                      className={`w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                        selectedImage === img.image_url
                          ? 'border-brand-pink shadow-boutique'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Product Information (7 cols) */}
            <div className="lg:col-span-7 flex flex-col">
              <div className="flex items-center justify-between">
                {product.category && (
                  <span className="text-xs uppercase font-bold tracking-wider text-brand-rose">
                    {product.category.name}
                  </span>
                )}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShare}
                    className="p-2 text-brand-darkMuted hover:text-brand-pink rounded-full hover:bg-brand-softPink/50 transition-colors"
                    title="Share product link"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`p-2 rounded-full transition-colors ${
                      isLiked
                        ? 'text-brand-pink bg-brand-softPink'
                        : 'text-brand-darkMuted hover:text-brand-pink hover:bg-brand-softPink/50'
                    }`}
                    title="Add to wishlist"
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              {copiedLink && (
                <div className="text-[11px] text-emerald-600 bg-emerald-50 px-3 py-1 rounded-md self-end mb-2">
                  Link copied to clipboard!
                </div>
              )}

              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-dark mt-2 mb-2">
                {product.name}
              </h1>

              {/* Ratings & SKU */}
              <div className="flex items-center gap-4 text-xs text-brand-darkMuted pb-4 border-b border-brand-border/60">
                <div className="flex items-center gap-1">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.floor(product.rating || 5) ? 'fill-current text-amber-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-brand-dark">
                    {product.rating} ({product.review_count || 12} reviews)
                  </span>
                </div>
                <span>•</span>
                <span>SKU: <strong className="text-brand-dark">{currentSku}</strong></span>
                <span>•</span>
                <span className={`font-semibold ${currentStock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {currentStock > 0 ? `In Stock (${currentStock} available)` : 'Out of Stock'}
                </span>
              </div>

              {/* Price Banner */}
              <div className="py-5 flex items-baseline gap-3">
                <span className="text-3xl font-bold font-serif text-brand-pink">
                  ৳ {currentPrice.toLocaleString()}
                </span>
                {hasSale && (
                  <span className="text-base text-gray-400 line-through">
                    ৳ {regularPrice.toLocaleString()}
                  </span>
                )}
                {hasSale && (
                  <span className="text-xs px-2.5 py-1 bg-brand-softPink text-brand-rose font-bold rounded-full">
                    Save ৳ {(regularPrice - currentPrice).toLocaleString()}
                  </span>
                )}
              </div>

              {product.short_description && (
                <p className="text-xs sm:text-sm text-brand-darkMuted leading-relaxed mb-6">
                  {product.short_description}
                </p>
              )}

              {/* Variable Product: Variations Selector (Visual UI) */}
              {product.is_variable && product.variants && product.variants.length > 0 && (
                <div className="mb-6 space-y-3 p-4 bg-brand-ivory/50 rounded-2xl border border-brand-border/60">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-brand-dark">Select Variation:</span>
                    {selectedVariant && (
                      <span className="text-brand-rose font-medium">Selected: {selectedVariant.title}</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {product.variants.map((v) => {
                      const isSelected = selectedVariant?.id === v.id;
                      const isOutOfStock = v.stock_quantity <= 0;
                      return (
                        <button
                          key={v.id}
                          onClick={() => handleVariantSelect(v)}
                          disabled={isOutOfStock}
                          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
                            isSelected
                              ? 'bg-brand-pink text-white border-brand-pink shadow-sm'
                              : isOutOfStock
                              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through'
                              : 'bg-white text-brand-dark border-brand-border hover:border-brand-pink hover:bg-brand-softPink/30'
                          }`}
                        >
                          {v.title} — ৳ {(v.sale_price ?? v.price).toLocaleString()}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Stepper & Action Buttons */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-brand-dark">Quantity:</span>
                  <div className="flex items-center border border-brand-border rounded-xl bg-white shadow-sm">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="w-10 h-10 flex items-center justify-center text-brand-dark hover:bg-brand-softPink/60 rounded-l-xl transition-colors disabled:opacity-40"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center text-sm font-bold text-brand-dark">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))}
                      disabled={quantity >= currentStock}
                      className="w-10 h-10 flex items-center justify-center text-brand-dark hover:bg-brand-softPink/60 rounded-r-xl transition-colors disabled:opacity-40"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-xs text-brand-darkMuted">
                    Max: {currentStock}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={handleAddToCart}
                    disabled={currentStock <= 0}
                    className="w-full py-3.5 bg-brand-pink hover:bg-brand-rose disabled:bg-gray-300 text-white font-semibold text-sm rounded-xl shadow-boutique hover:shadow-boutique-lg transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={currentStock <= 0}
                    className="w-full py-3.5 bg-brand-gold hover:bg-brand-goldHover disabled:bg-gray-300 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>Buy Now</span>
                  </button>
                </div>
              </div>

              {/* Delivery & Assurance Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-8 mt-8 border-t border-brand-border/60 text-xs">
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-brand-ivory border border-brand-border/40">
                  <Truck className="w-4 h-4 text-brand-pink flex-shrink-0" />
                  <div>
                    <p className="font-bold text-brand-dark">Fast Delivery</p>
                    <p className="text-[11px] text-brand-darkMuted">Dhaka 60৳ • Outside 120৳</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-brand-ivory border border-brand-border/40">
                  <RotateCcw className="w-4 h-4 text-brand-pink flex-shrink-0" />
                  <div>
                    <p className="font-bold text-brand-dark">7-Day Return</p>
                    <p className="text-[11px] text-brand-darkMuted">Easy size exchange</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-brand-ivory border border-brand-border/40">
                  <ShieldCheck className="w-4 h-4 text-brand-pink flex-shrink-0" />
                  <div>
                    <p className="font-bold text-brand-dark">Safe Payment</p>
                    <p className="text-[11px] text-brand-darkMuted">bKash, Nagad, COD</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description & Specification Tabs */}
          <div className="mt-12 pt-8 border-t border-brand-border/60">
            <div className="flex border-b border-brand-border">
              <button
                onClick={() => setActiveTab('desc')}
                className={`py-3 px-6 text-sm font-serif font-bold transition-all border-b-2 ${
                  activeTab === 'desc'
                    ? 'border-brand-pink text-brand-pink'
                    : 'border-transparent text-brand-darkMuted hover:text-brand-dark'
                }`}
              >
                Full Description
              </button>
              <button
                onClick={() => setActiveTab('delivery')}
                className={`py-3 px-6 text-sm font-serif font-bold transition-all border-b-2 ${
                  activeTab === 'delivery'
                    ? 'border-brand-pink text-brand-pink'
                    : 'border-transparent text-brand-darkMuted hover:text-brand-dark'
                }`}
              >
                Delivery & Returns
              </button>
            </div>

            <div className="py-6 text-sm text-brand-dark leading-relaxed">
              {activeTab === 'desc' && (
                <div className="space-y-4 max-w-3xl">
                  <p>{product.description}</p>
                  <ul className="list-disc pl-5 space-y-1 text-xs text-brand-darkMuted">
                    <li>100% genuine product inspected before dispatch.</li>
                    <li>Premium boutique packaging suitable for gifting.</li>
                    <li>Colors may slightly vary due to lighting and photographic conditions.</li>
                  </ul>
                </div>
              )}

              {activeTab === 'delivery' && (
                <div className="space-y-4 max-w-3xl text-xs text-brand-darkMuted">
                  <p className="font-semibold text-brand-dark text-sm">Bangladesh Delivery Information</p>
                  <p>
                    • <strong>Inside Dhaka:</strong> Delivery within 24 to 48 hours. Standard charge is ৳ 60.
                  </p>
                  <p>
                    • <strong>Outside Dhaka:</strong> Delivery within 3 to 5 business days via Steadfast or RedX Courier. Standard charge is ৳ 120.
                  </p>
                  <p>
                    • <strong>Free Shipping:</strong> Automatically applied to all orders exceeding ৳ 2,000.
                  </p>
                  <p>
                    • <strong>Return Policy:</strong> You may exchange or return within 7 days of receiving your package. Items must be unwashed, unworn, and with original price tags attached.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="text-center mb-8">
              <h3 className="font-serif text-2xl font-bold text-brand-dark">You May Also Like</h3>
              <p className="text-xs text-brand-darkMuted mt-1">Carefully paired with this collection</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
