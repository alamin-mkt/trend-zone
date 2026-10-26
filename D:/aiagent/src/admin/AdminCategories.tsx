import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Layers, CheckCircle2, X } from 'lucide-react';
import { Category } from '../types';
import { DataService } from '../services/dataService';

export const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit / Add Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [sortOrder, setSortOrder] = useState<number>(1);
  const [isActive, setIsActive] = useState(true);

  const loadCategories = async () => {
    setLoading(true);
    const data = await DataService.getCategories();
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setName('');
    setSlug('');
    setDescription('');
    setImageUrl('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=400&auto=format&fit=crop');
    setSortOrder(categories.length + 1);
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setImageUrl(cat.image_url || '');
    setSortOrder(cat.sort_order);
    setIsActive(cat.is_active);
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingId) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await DataService.saveCategory({
      id: editingId || undefined,
      name: name.trim(),
      slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: description.trim(),
      image_url: imageUrl.trim(),
      sort_order: Number(sortOrder),
      is_active: isActive,
    });

    setIsModalOpen(false);
    loadCategories();
  };

  const handleDelete = async (id: string, catName: string) => {
    if (window.confirm(`Are you sure you want to delete category "${catName}"?`)) {
      await DataService.deleteCategory(id);
      loadCategories();
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">Category Management</h1>
          <p className="text-xs text-gray-500">
            Create, reorder, and customize store categories shown on the homepage and navigation.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-pink hover:bg-brand-rose text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="w-10 h-10 border-4 border-brand-pink border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-600 uppercase font-semibold text-[11px] border-b border-gray-100">
                <tr>
                  <th className="py-3 px-6">Category</th>
                  <th className="py-3 px-6">Slug</th>
                  <th className="py-3 px-6">Sort Order</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={cat.image_url || '/placeholder.jpg'}
                          alt=""
                          className="w-10 h-10 rounded-full object-cover border border-gray-200 flex-shrink-0"
                        />
                        <div>
                          <span className="font-bold text-gray-900 block">{cat.name}</span>
                          <span className="text-[11px] text-gray-400 line-clamp-1">
                            {cat.description || 'No description'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-6 font-mono text-gray-600">{cat.slug}</td>
                    <td className="py-3 px-6 font-semibold">{cat.sort_order}</td>
                    <td className="py-3 px-6">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          cat.is_active
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {cat.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(cat)}
                        className="p-1.5 text-gray-400 hover:text-brand-pink"
                        title="Edit category"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="p-1.5 text-gray-400 hover:text-red-500"
                        title="Delete category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-boutique-lg space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="font-serif text-lg font-bold text-gray-900">
                {editingId ? 'Edit Category' : 'Create Category'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Salwar Kameez"
                  className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-brand-pink"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">URL Slug</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl font-mono focus:ring-2 focus:ring-brand-pink"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-brand-pink"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-brand-pink"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-brand-pink"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-gray-800">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 rounded text-brand-pink accent-brand-pink"
                    />
                    <span>Active & Visible</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-pink hover:bg-brand-rose text-white font-semibold rounded-xl shadow-sm"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
