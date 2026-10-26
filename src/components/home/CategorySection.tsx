import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../../types';
import { DataService } from '../../services/dataService';

export const CategorySection: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    DataService.getCategories().then((data) => {
      setCategories(data.filter((c) => c.is_active));
    });
  }, []);

  if (categories.length === 0) return null;

  return (
    <section className="py-14 sm:py-18 bg-white border-b border-brand-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-10">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-dark tracking-tight">
            Shop by Category
          </h2>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="h-0.5 w-10 bg-brand-gold/60" />
            <p className="text-xs sm:text-sm text-brand-darkMuted font-medium italic">
              Find what you love
            </p>
            <span className="h-0.5 w-10 bg-brand-gold/60" />
          </div>
        </div>

        {/* Circular Category Grid matching mockup */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 sm:gap-6 justify-center">
          {categories.slice(0, 8).map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="flex flex-col items-center group text-center"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 bg-gradient-to-tr from-brand-pink/20 via-brand-softPink to-brand-gold/30 group-hover:from-brand-pink group-hover:to-brand-gold transition-all duration-300 shadow-sm group-hover:shadow-boutique">
                <div className="w-full h-full rounded-full overflow-hidden bg-brand-ivory border-2 border-white">
                  <img
                    src={cat.image_url || '/placeholder.jpg'}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
              <span className="mt-3 text-xs sm:text-sm font-semibold text-brand-dark group-hover:text-brand-pink transition-colors line-clamp-1">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
