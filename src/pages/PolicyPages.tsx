import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ShieldCheck, RotateCcw, ArrowRight } from 'lucide-react';
import { DataService } from '../services/dataService';
import { StorePolicies, StoreGeneralSettings } from '../types';

export const PolicyPage: React.FC<{ type: 'privacy' | 'terms' | 'refund' }> = ({ type }) => {
  const [policies, setPolicies] = useState<StorePolicies | null>(null);

  useEffect(() => {
    DataService.getPolicies().then(setPolicies);
  }, []);

  const titles = {
    privacy: 'Privacy Policy',
    terms: 'Terms & Conditions',
    refund: 'Return & Refund Policy',
  };

  const content = policies
    ? type === 'privacy'
      ? policies.privacy_policy
      : type === 'terms'
      ? policies.terms_and_conditions
      : policies.return_policy
    : '';

  return (
    <div className="bg-brand-ivory/30 py-12 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl border border-brand-border/60 p-8 sm:p-12 shadow-sm space-y-6">
          <h1 className="font-serif text-3xl font-bold text-brand-dark pb-4 border-b border-brand-border/60">
            {titles[type]}
          </h1>
          <div className="prose text-xs sm:text-sm text-brand-dark leading-relaxed space-y-4 whitespace-pre-line">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
};

export const AboutUsPage: React.FC = () => {
  return (
    <div className="bg-brand-ivory/30 py-12 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="bg-white rounded-3xl border border-brand-border/60 p-8 sm:p-12 shadow-sm space-y-6">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
            About Trend Zone
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-dark">
            Trendy Products • Better Life
          </h1>
          <p className="text-xs sm:text-sm text-brand-darkMuted leading-relaxed">
            Trend Zone is Bangladesh's premier online shopping destination for contemporary fashion, gadgets, handbags, and lifestyle accessories. We curate high quality products at competitive prices, backed by responsive customer support and fast home delivery across all 64 districts.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-brand-border/60">
            <div className="p-4 rounded-2xl bg-brand-ivory border border-brand-border/60 text-center">
              <span className="font-serif text-2xl font-bold text-brand-pink block mb-1">100%</span>
              <span className="text-xs font-semibold text-brand-dark">Authentic Materials</span>
            </div>
            <div className="p-4 rounded-2xl bg-brand-ivory border border-brand-border/60 text-center">
              <span className="font-serif text-2xl font-bold text-brand-pink block mb-1">64 Districts</span>
              <span className="text-xs font-semibold text-brand-dark">Nationwide Delivery</span>
            </div>
            <div className="p-4 rounded-2xl bg-brand-ivory border border-brand-border/60 text-center">
              <span className="font-serif text-2xl font-bold text-brand-pink block mb-1">7 Days</span>
              <span className="text-xs font-semibold text-brand-dark">Hassle-Free Return</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ContactUsPage: React.FC = () => {
  const [storeSettings, setStoreSettings] = useState<StoreGeneralSettings | null>(null);

  useEffect(() => {
    DataService.getStoreSettings().then(setStoreSettings);
  }, []);

  return (
    <div className="bg-brand-ivory/30 py-12 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="bg-white rounded-3xl border border-brand-border/60 p-8 sm:p-12 shadow-sm space-y-6">
          <h1 className="font-serif text-3xl font-bold text-brand-dark">Contact Customer Support</h1>
          <p className="text-xs sm:text-sm text-brand-darkMuted">
            Have questions about an order or need assistance selecting the right size? Our dedicated Bangladesh customer desk is ready to help you.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-pink flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-brand-dark block">Head Office & Boutique</span>
                  <span className="text-brand-darkMuted">
                    {storeSettings?.address || '123, Fashion Avenue, Gulshan-2, Dhaka, Bangladesh'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-brand-pink flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-brand-dark block">Direct Hotline & WhatsApp</span>
                  <span className="text-brand-darkMuted">
                    {storeSettings?.phone || '+880 1712 345678'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-brand-pink flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-brand-dark block">Email Support</span>
                  <span className="text-brand-darkMuted">
                    {storeSettings?.email || 'support@trendzone.com'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-brand-softPink/40 rounded-2xl border border-brand-pink/30 space-y-3 text-xs">
              <span className="font-bold text-brand-rose block text-sm">Customer Care Hours</span>
              <p className="text-brand-dark">Saturday – Thursday: 10:00 AM – 10:00 PM</p>
              <p className="text-brand-dark">Friday: 2:00 PM – 10:00 PM</p>
              <p className="text-brand-darkMuted text-[11px] pt-2">
                All Cash on Delivery orders are verified via phone prior to courier dispatch.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const NotFoundPage: React.FC = () => {
  return (
    <div className="bg-brand-ivory/40 min-h-screen py-24 flex items-center justify-center px-4">
      <div className="text-center space-y-4 max-w-md">
        <span className="font-serif text-7xl font-bold text-brand-pink">404</span>
        <h1 className="font-serif text-2xl font-bold text-brand-dark">Page Not Found</h1>
        <p className="text-xs text-brand-darkMuted">
          The fashion piece or page you are looking for might have been moved or is no longer available.
        </p>
        <div className="pt-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-pink hover:bg-brand-rose text-white text-xs font-semibold rounded-full shadow-sm transition-all"
          >
            <span>Return to Homepage</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
