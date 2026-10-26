import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { ProductCard } from '../products/ProductCard';
import { DataService } from '../../services/dataService';

export const ProductSection: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'hot' | 'new' | 'featured'>('all');

  useEffect(() => {
    DataService.getProducts().then(setProducts);
  }, []);

  const filtered = products.filter((p) => {
    if (activeTab === 'hot') return p.is_hot;
    if (activeTab === 'new') return p.is_new;
    if (activeTab === 'featured') return p.is_featured;
    return true;
  });

  return (
    <section className="py-14 sm:py-20 bg-brand-ivory/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-dark tracking-tight">
            Latest Products
          </h2>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="h-0.5 w-10 bg-brand-gold/60" />
            <p className="text-xs sm:text-sm text-brand-darkMuted font-medium italic">
              Be the first to grab the trend
            </p>
            <span className="h-0.5 w-10 bg-brand-gold/60" />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'all'
                  ? 'bg-brand-pink text-white shadow-sm'
                  : 'bg-white text-brand-dark hover:bg-brand-softPink/50 border border-brand-border'
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setActiveTab('hot')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'hot'
                  ? 'bg-brand-pink text-white shadow-sm'
                  : 'bg-white text-brand-dark hover:bg-brand-softPink/50 border border-brand-border'
              }`}
            >
              🔥 Hot Trends
            </button>
            <button
              onClick={() => setActiveTab('new')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'new'
                  ? 'bg-brand-pink text-white shadow-sm'
                  : 'bg-white text-brand-dark hover:bg-brand-softPink/50 border border-brand-border'
              }`}
            >
              ✨ New Arrivals
            </button>
            <button
              onClick={() => setActiveTab('featured')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'featured'
                  ? 'bg-brand-pink text-white shadow-sm'
                  : 'bg-white text-brand-dark hover:bg-brand-softPink/50 border border-brand-border'
              }`}
            >
              ⭐ Featured
            </button>
          </div>
        </div>

        {/* 5-Column Responsive Product Grid (Matching layout reference!) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {filtered.slice(0, 10).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-brand-pink text-brand-pink hover:bg-brand-pink hover:text-white font-semibold rounded-full shadow-sm transition-all"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
