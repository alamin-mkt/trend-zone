import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingBag, Eye } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isLiked = isInWishlist(product.id);
  const primaryImage = product.images?.[0]?.image_url || '/placeholder.jpg';
  const hasSale = product.sale_price !== null && product.sale_price !== undefined && product.sale_price < product.base_price;
  const currentPrice = product.sale_price ?? product.base_price;
  const discountPercent = hasSale ? Math.round(((product.base_price - product.sale_price!) / product.base_price) * 100) : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // If product has variants, add first available variant or pass product
    const defaultVariant = product.variants?.find((v) => v.stock_quantity > 0) || product.variants?.[0];
    addToCart(product, defaultVariant, 1);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div className="group bg-white rounded-2xl border border-brand-border/60 overflow-hidden shadow-sm hover:shadow-boutique transition-all duration-300 flex flex-col h-full relative">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 pointer-events-none">
        {product.is_hot && (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-pink text-white shadow-sm">
            Hot
          </span>
        )}
        {product.is_new && !product.is_hot && (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-600 text-white shadow-sm">
            New
          </span>
        )}
        {hasSale && (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-gold text-white shadow-sm">
            -{discountPercent}%
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleWishlistToggle}
        className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
          isLiked
            ? 'bg-brand-pink text-white shadow-md'
            : 'bg-white/90 text-brand-darkMuted hover:text-brand-pink hover:bg-white shadow-sm'
        }`}
        aria-label="Wishlist"
      >
        <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
      </button>

      {/* Product Image Link */}
      <Link to={`/product/${product.slug}`} className="block relative aspect-square overflow-hidden bg-brand-ivory">
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-brand-dark/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="px-3 py-1.5 bg-white/90 text-brand-dark font-medium text-xs rounded-full shadow-sm flex items-center gap-1.5 backdrop-blur-sm transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5 text-brand-pink" />
            Quick View
          </span>
        </div>
      </Link>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-1">
        {product.category && (
          <p className="text-[11px] font-medium text-brand-rose/80 uppercase tracking-wider mb-1 line-clamp-1">
            {product.category.name}
          </p>
        )}

        <Link
          to={`/product/${product.slug}`}
          className="font-semibold text-sm text-brand-dark hover:text-brand-pink transition-colors line-clamp-1 mb-1.5"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Ratings */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(product.rating || 5) ? 'fill-current text-amber-400' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] text-brand-darkMuted font-medium">
            ({product.review_count || 12})
          </span>
        </div>

        {/* Price Row */}
        <div className="flex items-baseline gap-2 mb-4 mt-auto">
          <span className="text-base font-bold text-brand-pink font-serif">
            ৳ {currentPrice.toLocaleString()}
          </span>
          {hasSale && (
            <span className="text-xs text-gray-400 line-through">
              ৳ {product.base_price.toLocaleString()}
            </span>
          )}
        </div>

        {/* Add to Cart Button (Matching Mockup) */}
        <button
          onClick={handleAddToCart}
          className="w-full py-2 px-3 bg-brand-pink hover:bg-brand-rose active:scale-[0.98] text-white text-xs font-semibold rounded-xl shadow-sm hover:shadow-boutique transition-all flex items-center justify-center gap-1.5"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};
