import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Save, Image as ImageIcon, X } from 'lucide-react';
import { Banner } from '../types';
import { DataService } from '../services/dataService';

export const AdminBanners: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [buttonText, setButtonText] = useState('Shop Now');
  const [destinationUrl, setDestinationUrl] = useState('/products');
  const [badge, setBadge] = useState('');
  const [sortOrder, setSortOrder] = useState<number>(1);
  const [isActive, setIsActive] = useState(true);
  const [bannerType, setBannerType] = useState<'hero' | 'promo'>('hero');

  const loadBanners = async () => {
    setLoading(true);
    const data = await DataService.getAllBanners();
    setBanners(data);
    setLoading(false);
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const openAddModal = (type: 'hero' | 'promo') => {
    setEditingId(null);
    setTitle('');
    setSubtitle('');
    setImageUrl('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop');
    setButtonText('Shop Now');
    setDestinationUrl('/products');
    setBadge(type === 'hero' ? 'Trending Products' : 'Special Offer');
    setSortOrder(banners.length + 1);
    setIsActive(true);
    setBannerType(type);
    setIsModalOpen(true);
  };

  const openEditModal = (b: Banner) => {
    setEditingId(b.id);
    setTitle(b.title);
    setSubtitle(b.subtitle || '');
    setImageUrl(b.image_url);
    setButtonText(b.button_text);
    setDestinationUrl(b.destination_url);
    setBadge(b.badge || '');
    setSortOrder(b.sort_order);
    setIsActive(b.is_active);
    setBannerType(b.banner_type || 'hero');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) return;

    await DataService.saveBanner({
      id: editingId || undefined,
      title: title.trim(),
      subtitle: subtitle.trim(),
      image_url: imageUrl.trim(),
      button_text: buttonText.trim(),
      destination_url: destinationUrl.trim(),
      badge: badge.trim(),
      sort_order: Number(sortOrder),
      is_active: isActive,
      banner_type: bannerType,
    });

    setIsModalOpen(false);
    loadBanners();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this banner?')) {
      await DataService.deleteBanner(id);
      loadBanners();
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">Banner Management</h1>
          <p className="text-xs text-gray-500">
            Customize hero carousel slides and 3-column promo banners
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openAddModal('hero')}
            className="px-4 py-2 bg-brand-pink hover:bg-brand-rose text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
          >
            + Add Hero Slide
          </button>
          <button
            onClick={() => openAddModal('promo')}
            className="px-4 py-2 bg-brand-gold hover:bg-brand-goldHover text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
          >
            + Add Promo Card
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className={`bg-white rounded-2xl border overflow-hidden shadow-sm flex flex-col ${
              banner.is_active ? 'border-gray-200' : 'border-gray-100 opacity-60'
            }`}
          >
            <div className="relative aspect-[16/9] overflow-hidden bg-brand-ivory">
              <img src={banner.image_url} alt="" className="w-full h-full object-cover" />
              <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-sm">
                {banner.banner_type}
              </span>
              <span
                className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  banner.is_active ? 'bg-emerald-500 text-white' : 'bg-gray-400 text-white'
                }`}
              >
                {banner.is_active ? 'Active' : 'Disabled'}
              </span>
            </div>

            <div className="p-4 flex flex-col flex-1 text-xs">
              {banner.badge && (
                <span className="text-[10px] font-bold text-brand-gold uppercase">
                  {banner.badge}
                </span>
              )}
              <h3 className="font-serif text-sm font-bold text-gray-900 line-clamp-1 mt-0.5">
                {banner.title}
              </h3>
              <p className="text-gray-500 text-[11px] line-clamp-1 mb-2">
                {banner.subtitle || 'No subtitle'}
              </p>

              <div className="mt-auto pt-3 border-t flex items-center justify-between">
                <span className="text-gray-400 text-[11px]">Order: {banner.sort_order}</span>
                <div className="space-x-1">
                  <button
                    onClick={() => openEditModal(banner)}
                    className="p-1 text-gray-500 hover:text-brand-pink"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="p-1 text-gray-500 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Banner Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-boutique-lg space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif text-base font-bold text-gray-900">
                {editingId ? 'Edit Banner' : `Add ${bannerType.toUpperCase()} Banner`}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Headline Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Your One Stop Shopping Destination"
                  className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-brand-pink"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Subtitle / Caption</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. Trending Products • Fashion • Lifestyle"
                  className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-brand-pink"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Banner Type</label>
                <select
                  value={bannerType}
                  onChange={(e) => setBannerType(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded-xl bg-white"
                >
                  <option value="hero">Hero Carousel Slide</option>
                  <option value="promo">3-Column Promo Card</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Image URL *</label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-brand-pink"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Button Text</label>
                  <input
                    type="text"
                    value={buttonText}
                    onChange={(e) => setButtonText(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Destination URL</label>
                  <input
                    type="text"
                    value={destinationUrl}
                    onChange={(e) => setDestinationUrl(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="e.g. Up to 50% OFF"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="bActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-pink accent-brand-pink"
                />
                <label htmlFor="bActive" className="font-semibold text-gray-700 cursor-pointer">
                  Banner is Active
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-pink text-white rounded-xl font-semibold hover:bg-brand-rose"
                >
                  Save Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
