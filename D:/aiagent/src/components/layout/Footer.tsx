import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Send, CheckCircle2 } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-brand-orange text-white pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/30">
          {/* Col 1: Trend Zone Brand Info matching reference */}
          <div className="space-y-4">
            <BrandLogo variant="light" showTagline={true} />
            <p className="text-white/85 text-xs leading-relaxed max-w-sm pt-1">
              Your trusted online shopping destination for the latest trends, best quality products and amazing deals across Bangladesh.
            </p>
            <div className="pt-2 text-xs text-white font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>Cash on Delivery & Fast Nationwide Delivery</span>
            </div>
          </div>

          {/* Col 2: Contact Us */}
          <div className="space-y-3">
            <h3 className="font-serif text-base font-bold text-white tracking-wide border-b border-white/40 pb-2 inline-block">
              Contact Us
            </h3>
            <ul className="space-y-2.5 text-xs text-white/90">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
                <span>123, Trend Zone Street, Chattogram / Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-white flex-shrink-0" />
                <span>+880 1712 345678</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-white flex-shrink-0" />
                <span>support@trendzone.com</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Payment Methods */}
          <div className="space-y-3">
            <h3 className="font-serif text-base font-bold text-white tracking-wide border-b border-white/40 pb-2 inline-block">
              Payment Methods
            </h3>
            <p className="text-xs text-white/85">
              We accept safe and reliable payments across Bangladesh:
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="bg-white/15 hover:bg-white/25 transition-colors border border-white/30 rounded-lg p-2 text-center">
                <span className="text-[11px] font-bold tracking-wider text-white">COD</span>
                <p className="text-[9px] text-white/80">Cash on Delivery</p>
              </div>
              {/* bKash Badge */}
              <div className="bg-white/15 hover:bg-white/25 transition-colors border border-white/30 rounded-lg p-2 text-center">
                <span className="text-[11px] font-bold text-white">bKash</span>
                <p className="text-[9px] text-white/80">Send Money</p>
              </div>
              {/* Nagad Badge */}
              <div className="bg-white/15 hover:bg-white/25 transition-colors border border-white/30 rounded-lg p-2 text-center">
                <span className="text-[11px] font-bold text-white">Nagad</span>
                <p className="text-[9px] text-white/80">Instant Pay</p>
              </div>
              {/* Rocket Badge */}
              <div className="bg-white/15 hover:bg-white/25 transition-colors border border-white/30 rounded-lg p-2 text-center">
                <span className="text-[11px] font-bold text-white">Rocket</span>
                <p className="text-[9px] text-white/80">DBBL Mobile</p>
              </div>
            </div>
          </div>

          {/* Col 4: Follow Us & Newsletter */}
          <div className="space-y-3">
            <h3 className="font-serif text-base font-bold text-white tracking-wide border-b border-white/40 pb-2 inline-block">
              Follow Us
            </h3>
            <div className="flex items-center gap-2 pt-1">
              <a
                href="https://facebook.com/trendzone.bd"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white text-white hover:text-brand-orange transition-colors flex items-center justify-center text-xs font-bold"
                title="Facebook"
              >
                f
              </a>
              <a
                href="https://instagram.com/trendzone.bd"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white text-white hover:text-brand-orange transition-colors flex items-center justify-center text-xs font-bold"
                title="Instagram"
              >
                ig
              </a>
              <a
                href="https://youtube.com/@trendzonebd"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white text-white hover:text-brand-orange transition-colors flex items-center justify-center text-xs font-bold"
                title="YouTube"
              >
                yt
              </a>
              <a
                href="https://pinterest.com/trendzonebd"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white text-white hover:text-brand-orange transition-colors flex items-center justify-center text-xs font-bold"
                title="Pinterest"
              >
                p
              </a>
            </div>

            <div className="pt-2">
              <p className="text-xs text-white/85 mb-2">Subscribe to our newsletter:</p>
              {subscribed ? (
                <div className="flex items-center gap-1.5 text-xs text-brand-orangeSoft bg-white/10 p-2 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span>Thank you for subscribing!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="relative flex items-center">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                    className="w-full px-3 py-2 bg-white text-brand-dark rounded-full text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-orange pr-10"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 w-7 h-7 bg-brand-navy hover:bg-gray-800 text-white rounded-full flex items-center justify-center transition-colors"
                    aria-label="Subscribe"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-white/70 gap-3">
          <p>© {new Date().getFullYear()} Trend Zone. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="/terms-conditions" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
            <span>•</span>
            <Link to="/refund-policy" className="hover:text-white transition-colors">
              Return & Refund
            </Link>
            <span>•</span>
            <Link to="/about" className="hover:text-white transition-colors">
              About Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
