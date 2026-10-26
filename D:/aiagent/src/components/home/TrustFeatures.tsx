import React from 'react';
import { Truck, ShieldCheck, RotateCcw, Headphones } from 'lucide-react';

export const TrustFeatures: React.FC = () => {
  const features = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'On orders over ৳ 2000',
    },
    {
      icon: ShieldCheck,
      title: 'Secure Payment',
      description: '100% secure payments',
    },
    {
      icon: RotateCcw,
      title: 'Easy Return',
      description: 'Within 7 days',
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: "We're here to help",
    },
  ];

  return (
    <section className="py-8 bg-brand-ivory/60 border-y border-brand-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3.5 p-4 rounded-xl bg-white border border-brand-border/40 shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-softPink flex items-center justify-center text-brand-pink flex-shrink-0">
                <item.icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-brand-dark">{item.title}</h4>
                <p className="text-[11px] sm:text-xs text-brand-darkMuted mt-0.5">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
