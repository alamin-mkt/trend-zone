import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Banner } from '../../types';
import { DataService } from '../../services/dataService';

export const PromoBanners: React.FC = () => {
  const [promoBanners, setPromoBanners] = useState<Banner[]>([]);

  useEffect(() => {
    DataService.getBanners('promo').then(setPromoBanners);
  }, []);

  if (promoBanners.length === 0) return null;

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {promoBanners.slice(0, 3).map((banner) => (
            <div
              key={banner.id}
              className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-brand-softPink/60 to-brand-ivory border border-brand-border/60 p-6 flex items-center justify-between group shadow-sm hover:shadow-boutique transition-all"
            >
              <div className="space-y-2 z-10 max-w-[60%]">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-rose">
                  {banner.title}
                </span>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-dark leading-snug">
                  {banner.subtitle}
                </h3>
                <Link
                  to={banner.destination_url || '/products'}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-pink group-hover:text-brand-rose transition-colors pt-1"
                >
                  <span>{banner.button_text || 'Shop Now'}</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0 rounded-2xl overflow-hidden border-2 border-white shadow-sm">
                <img
                  src={banner.image_url}
                  alt={banner.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
