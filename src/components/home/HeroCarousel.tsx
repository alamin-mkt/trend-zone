import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Banner } from '../../types';
import { DataService } from '../../services/dataService';

export const HeroCarousel: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    DataService.getBanners('hero').then((data) => {
      if (data && data.length > 0) setBanners(data);
    });
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (banners.length === 0) return null;

  const current = banners[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  return (
    <div className="relative bg-gradient-to-r from-[#FFF0F5] via-[#FFF9F2] to-[#FCE7EF] overflow-hidden border-b border-brand-border/40">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-softPink rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-72 h-72 bg-brand-gold/10 rounded-full blur-2xl opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 md:py-20 relative">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center min-h-[420px]">
          {/* Left Text Content */}
          <div className="md:col-span-7 space-y-4 sm:space-y-6 z-10 animate-fadeIn">
            {current.badge && (
              <span className="inline-block text-brand-gold font-serif italic text-base sm:text-lg font-semibold tracking-wide">
                {current.badge}
              </span>
            )}

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-brand-dark leading-[1.15] tracking-tight">
              {current.title}
            </h1>

            {current.subtitle && (
              <p className="text-sm sm:text-base md:text-lg text-brand-darkMuted font-medium tracking-wide">
                {current.subtitle}
              </p>
            )}

            <div className="pt-2">
              <Link
                to={current.destination_url || '/products'}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-pink hover:bg-brand-rose text-white font-semibold rounded-full shadow-boutique hover:shadow-boutique-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>{current.button_text || 'Shop Now'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Image Container */}
          <div className="md:col-span-5 relative flex justify-center z-10">
            <div className="relative w-full max-w-sm sm:max-w-md aspect-[4/5] rounded-3xl overflow-hidden shadow-boutique-lg border-4 border-white">
              <img
                src={current.image_url}
                alt={current.title}
                className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Carousel Prev/Next Buttons */}
        {banners.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-brand-dark hover:text-brand-pink shadow-md flex items-center justify-center transition-all z-20"
              aria-label="Previous banner"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-brand-dark hover:text-brand-pink shadow-md flex items-center justify-center transition-all z-20"
              aria-label="Next banner"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Slide Indicators */}
        {banners.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all ${
                  idx === currentIndex
                    ? 'w-6 h-2 bg-brand-pink rounded-full'
                    : 'w-2 h-2 bg-brand-dark/20 hover:bg-brand-dark/40 rounded-full'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
