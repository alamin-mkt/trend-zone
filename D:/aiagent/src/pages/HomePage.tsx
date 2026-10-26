import React from 'react';
import { HeroCarousel } from '../components/home/HeroCarousel';
import { CategorySection } from '../components/home/CategorySection';
import { ProductSection } from '../components/home/ProductSection';
import { PromoBanners } from '../components/home/PromoBanners';
import { TrustFeatures } from '../components/home/TrustFeatures';

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-0">
      {/* 1. Hero Carousel */}
      <HeroCarousel />

      {/* 2. Shop by Category */}
      <CategorySection />

      {/* 3. Latest Products Grid */}
      <ProductSection />

      {/* 4. 3-Column Promo Banners */}
      <PromoBanners />

      {/* 5. Trust Features Bar */}
      <TrustFeatures />
    </div>
  );
};
