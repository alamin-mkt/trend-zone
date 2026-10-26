import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, User, Phone, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { BrandLogo } from '../components/common/BrandLogo';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, setDemoAdmin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      if (email.toLowerCase().includes('admin')) {
        navigate('/admin');
      } else {
        navigate('/account');
      }
    } else {
      setError(result.error || 'Failed to sign in. Please verify your credentials.');
    }
  };

  const handleQuickAdmin = () => {
    setDemoAdmin();
    navigate('/admin');
  };

  return (
    <div className="bg-brand-ivory/40 min-h-screen py-16 flex items-center justify-center px-4 sm:px-6">
      <div className="max-w-md w-full bg-white rounded-3xl border border-brand-border/60 p-8 shadow-boutique space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <BrandLogo />
          </div>
          <h1 className="font-serif text-2xl font-bold text-brand-dark pt-2">Welcome Back</h1>
          <p className="text-xs text-brand-darkMuted">
            Sign in to track orders, manage wishlist, or access admin features.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Super Admin Credentials Quick Info */}
          <div className="p-3.5 bg-brand-orangeSoft/80 border border-brand-orange/30 rounded-2xl flex items-center justify-between text-xs animate-fadeIn">
            <div>
              <span className="font-bold text-brand-dark flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-orange" />
                <span>Super Admin Credentials</span>
              </span>
              <div className="text-[11px] text-brand-darkMuted mt-1 space-y-0.5">
                <p>Email: <strong className="text-brand-dark font-mono">admin@trendzone.com</strong></p>
                <p>Password: <strong className="text-brand-dark font-mono">Admin@12345</strong></p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setEmail('admin@trendzone.com');
                setPassword('Admin@12345');
              }}
              className="px-2.5 py-1.5 bg-brand-orange hover:bg-brand-orangeHover text-white text-[11px] font-bold rounded-lg transition-colors shadow-sm"
            >
              Auto Fill
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-dark mb-1.5">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-brand-darkMuted absolute left-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@trendzone.com or your email"
                className="w-full pl-9 pr-3.5 py-2.5 border border-brand-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-pink"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-dark mb-1.5">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-brand-darkMuted absolute left-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 border border-brand-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-pink"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-pink hover:bg-brand-rose text-white font-semibold rounded-xl text-xs shadow-sm transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* 1-Click Demo Admin Shortcut */}
        <div className="pt-2 border-t border-brand-border/60">
          <button
            type="button"
            onClick={handleQuickAdmin}
            className="w-full py-2.5 bg-brand-orangeSoft hover:bg-brand-orangeLight border border-brand-orange/30 text-brand-orange font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>1-Click Super Admin Login</span>
          </button>
        </div>

        <div className="text-center text-xs text-brand-darkMuted pt-2">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-brand-pink font-semibold hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await register(email, password, name, phone);
    setLoading(false);

    if (result.success) {
      navigate('/account');
    } else {
      setError(result.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="bg-brand-ivory/40 min-h-screen py-16 flex items-center justify-center px-4 sm:px-6">
      <div className="max-w-md w-full bg-white rounded-3xl border border-brand-border/60 p-8 shadow-boutique space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <BrandLogo />
          </div>
          <h1 className="font-serif text-2xl font-bold text-brand-dark pt-2">Create Customer Account</h1>
          <p className="text-xs text-brand-darkMuted">
            Join Trend Zone to receive exclusive boutique discounts and track all orders.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-brand-dark mb-1.5">Full Name</label>
            <div className="relative flex items-center">
              <User className="w-4 h-4 text-brand-darkMuted absolute left-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Fatema Jannat"
                className="w-full pl-9 pr-3.5 py-2.5 border border-brand-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-pink"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-dark mb-1.5">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-brand-darkMuted absolute left-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3.5 py-2.5 border border-brand-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-pink"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-dark mb-1.5">Phone Number</label>
            <div className="relative flex items-center">
              <Phone className="w-4 h-4 text-brand-darkMuted absolute left-3" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="017XXXXXXXX"
                className="w-full pl-9 pr-3.5 py-2.5 border border-brand-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-pink"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-dark mb-1.5">Password</label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-brand-darkMuted absolute left-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 border border-brand-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-pink"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-pink hover:bg-brand-rose text-white font-semibold rounded-xl text-xs shadow-sm transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-brand-darkMuted pt-2">
          Already registered?{' '}
          <Link to="/login" className="text-brand-pink font-semibold hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};
