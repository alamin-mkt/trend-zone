import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Filter, SlidersHorizontal, ArrowUpDown, ChevronRight, Check } from 'lucide-react';
import { Product, Category } from '../types';
import { ProductCard } from '../components/products/ProductCard';
import { DataService } from '../services/dataService';

export const ProductListingPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>(categorySlug || 'all');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'popular'>('newest');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    DataService.getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    if (categorySlug) {
      setSelectedCategory(categorySlug);
    } else {
      setSelectedCategory('all');
    }
  }, [categorySlug]);

  useEffect(() => {
    setLoading(true);
    DataService.getProducts({
      categorySlug: selectedCategory !== 'all' ? selectedCategory : undefined,
      searchQuery: searchQuery || undefined,
      sortBy,
      inStockOnly,
      minPrice,
      maxPrice,
    }).then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, [selectedCategory, searchQuery, sortBy, inStockOnly, minPrice, maxPrice]);

  const activeCategoryObj = categories.find((c) => c.slug === selectedCategory);

  return (
    <div className="bg-brand-ivory/30 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-brand-darkMuted mb-6">
          <Link to="/" className="hover:text-brand-pink transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/products" className="hover:text-brand-pink transition-colors">Products</Link>
          {activeCategoryObj && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-brand-pink font-semibold">{activeCategoryObj.name}</span>
            </>
          )}
          {searchQuery && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-brand-pink font-semibold">Search: "{searchQuery}"</span>
            </>
          )}
        </div>

        {/* Page Title & Sort Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-brand-border/60 gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-dark">
              {activeCategoryObj ? activeCategoryObj.name : searchQuery ? `Search results for "${searchQuery}"` : 'All Products'}
            </h1>
            <p className="text-xs text-brand-darkMuted mt-1">
              Showing {products.length} {products.length === 1 ? 'item' : 'items'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden px-4 py-2 bg-white border border-brand-border rounded-xl text-xs font-semibold text-brand-dark flex items-center gap-2 shadow-sm"
            >
              <Filter className="w-4 h-4 text-brand-pink" />
              Filters
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-white border border-brand-border rounded-xl px-3 py-2 text-xs shadow-sm">
              <ArrowUpDown className="w-3.5 h-3.5 text-brand-darkMuted" />
              <span className="text-brand-darkMuted hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-brand-dark font-medium focus:outline-none cursor-pointer"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-brand-border/60 shadow-sm space-y-6">
              {/* Category Filter */}
              <div>
                <h3 className="font-serif text-sm font-bold text-brand-dark mb-3">Categories</h3>
                <ul className="space-y-1.5 text-xs">
                  <li>
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className={`w-full text-left py-1.5 px-2.5 rounded-lg font-medium transition-colors ${
                        selectedCategory === 'all'
                          ? 'bg-brand-softPink text-brand-rose font-bold'
                          : 'text-brand-dark hover:bg-brand-ivory'
                      }`}
                    >
                      All Categories
                    </button>
                  </li>
                  {categories.map((c) => (
                    <li key={c.id}>
                      <button
                        onClick={() => setSelectedCategory(c.slug)}
                        className={`w-full text-left py-1.5 px-2.5 rounded-lg font-medium transition-colors ${
                          selectedCategory === c.slug
                            ? 'bg-brand-softPink text-brand-rose font-bold'
                            : 'text-brand-dark hover:bg-brand-ivory'
                        }`}
                      >
                        {c.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Filter */}
              <div className="border-t border-brand-border/60 pt-5">
                <h3 className="font-serif text-sm font-bold text-brand-dark mb-3">Price Range (৳)</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={minPrice}
                      onChange={(e) => setMinPrice(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-brand-border rounded-lg text-xs"
                      placeholder="Min"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-brand-border rounded-lg text-xs"
                      placeholder="Max"
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-brand-pink"
                  />
                  <div className="flex justify-between text-[11px] text-brand-darkMuted">
                    <span>৳ 0</span>
                    <span>৳ {maxPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* In Stock Only */}
              <div className="border-t border-brand-border/60 pt-5">
                <label className="flex items-center gap-2.5 text-xs font-semibold text-brand-dark cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-pink accent-brand-pink focus:ring-brand-pink"
                  />
                  <span>In Stock Only</span>
                </label>
              </div>

              {/* Reset Filters */}
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setInStockOnly(false);
                  setMinPrice(0);
                  setMaxPrice(10000);
                  setSearchParams({});
                }}
                className="w-full py-2 border border-brand-pink text-brand-pink text-xs font-semibold rounded-xl hover:bg-brand-pink hover:text-white transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-brand-border/40" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-brand-border/60">
                <p className="font-serif text-lg font-bold text-brand-dark">No products found</p>
                <p className="text-xs text-brand-darkMuted mt-1 mb-6">
                  Try adjusting your filters or search keywords.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setInStockOnly(false);
                    setMinPrice(0);
                    setMaxPrice(10000);
                    setSearchParams({});
                  }}
                  className="px-6 py-2.5 bg-brand-pink text-white rounded-full text-xs font-semibold shadow-sm hover:bg-brand-rose transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
