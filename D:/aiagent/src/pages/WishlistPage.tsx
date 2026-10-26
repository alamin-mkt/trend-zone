import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { Product } from '../types';
import { DataService } from '../services/dataService';
import { ProductCard } from '../components/products/ProductCard';

export const WishlistPage: React.FC = () => {
  const { wishlist, toggleWishlist } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    DataService.getProducts().then((all) => {
      setProducts(all.filter((p) => wishlist.includes(p.id)));
      setLoading(false);
    });
  }, [wishlist]);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <div className="w-12 h-12 border-4 border-brand-pink border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-brand-softPink text-brand-pink rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-10 h-10" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-brand-dark mb-2">Your Wishlist is Empty</h1>
        <p className="text-xs text-brand-darkMuted mb-6 max-w-sm mx-auto">
          Save your favorite sarees, kurtis, and designer accessories by tapping the heart icon.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-pink text-white rounded-full text-xs font-semibold hover:bg-brand-rose transition-colors"
        >
          <span>Discover Products</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-brand-ivory/30 py-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-dark">My Wishlist</h1>
            <p className="text-xs text-brand-darkMuted mt-1">
              You have {products.length} {products.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
};
