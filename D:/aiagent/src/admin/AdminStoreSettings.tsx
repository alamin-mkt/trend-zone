import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, Store, FileText, Truck, Shield } from 'lucide-react';
import { StoreGeneralSettings, StorePolicies } from '../types';
import { DataService } from '../services/dataService';

export const AdminStoreSettings: React.FC = () => {
  const [general, setGeneral] = useState<StoreGeneralSettings | null>(null);
  const [policies, setPolicies] = useState<StorePolicies | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    Promise.all([DataService.getStoreSettings(), DataService.getPolicies()]).then(
      ([gen, pol]) => {
        setGeneral(gen);
        setPolicies(pol);
        setLoading(false);
      }
    );
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!general || !policies) return;

    await DataService.updateStoreSettings(general);
    await DataService.updatePolicies(policies);

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  if (loading || !general || !policies) {
    return (
      <div className="py-20 flex justify-center">
        <div className="w-10 h-10 border-4 border-brand-pink border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">Store & Website Settings</h1>
          <p className="text-xs text-gray-500">
            Control brand identity, customer contacts, delivery fee rules, and legal policies.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-2.5 bg-brand-pink hover:bg-brand-rose text-white text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
          <span>All store settings have been saved and applied across the website!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Brand Information */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <h2 className="font-serif text-base font-bold text-gray-900 border-b pb-3 flex items-center gap-2">
            <Store className="w-4 h-4 text-brand-pink" />
            <span>Store Identity & Contact Details</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Store Name</label>
              <input
                type="text"
                value={general.store_name}
                onChange={(e) => setGeneral({ ...general, store_name: e.target.value })}
                className="w-full px-3.5 py-2.5 border rounded-xl focus:ring-2 focus:ring-brand-pink font-semibold"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Tagline</label>
              <input
                type="text"
                value={general.store_tagline}
                onChange={(e) => setGeneral({ ...general, store_tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 border rounded-xl focus:ring-2 focus:ring-brand-pink"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Customer Hotline Phone</label>
              <input
                type="text"
                value={general.phone}
                onChange={(e) => setGeneral({ ...general, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 border rounded-xl focus:ring-2 focus:ring-brand-pink"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">WhatsApp Order Number</label>
              <input
                type="text"
                value={general.whatsapp}
                onChange={(e) => setGeneral({ ...general, whatsapp: e.target.value })}
                className="w-full px-3.5 py-2.5 border rounded-xl focus:ring-2 focus:ring-brand-pink"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Customer Support Email</label>
              <input
                type="email"
                value={general.email}
                onChange={(e) => setGeneral({ ...general, email: e.target.value })}
                className="w-full px-3.5 py-2.5 border rounded-xl focus:ring-2 focus:ring-brand-pink"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Physical Store Address</label>
            <input
              type="text"
              value={general.address}
              onChange={(e) => setGeneral({ ...general, address: e.target.value })}
              className="w-full px-3.5 py-2.5 border rounded-xl focus:ring-2 focus:ring-brand-pink"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Top Announcement Bar Text</label>
            <input
              type="text"
              value={general.announcement_text || ''}
              onChange={(e) => setGeneral({ ...general, announcement_text: e.target.value })}
              className="w-full px-3.5 py-2.5 border rounded-xl focus:ring-2 focus:ring-brand-pink"
            />
          </div>
        </div>

        {/* Delivery Rules */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <h2 className="font-serif text-base font-bold text-gray-900 border-b pb-3 flex items-center gap-2">
            <Truck className="w-4 h-4 text-brand-pink" />
            <span>Nationwide Delivery Charges (BDT ৳)</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Inside Dhaka Charge (৳)
              </label>
              <input
                type="number"
                value={general.delivery_inside_dhaka}
                onChange={(e) =>
                  setGeneral({ ...general, delivery_inside_dhaka: Number(e.target.value) })
                }
                className="w-full px-3.5 py-2.5 border rounded-xl focus:ring-2 focus:ring-brand-pink font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Outside Dhaka Charge (৳)
              </label>
              <input
                type="number"
                value={general.delivery_outside_dhaka}
                onChange={(e) =>
                  setGeneral({ ...general, delivery_outside_dhaka: Number(e.target.value) })
                }
                className="w-full px-3.5 py-2.5 border rounded-xl focus:ring-2 focus:ring-brand-pink font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Free Delivery Threshold (৳)
              </label>
              <input
                type="number"
                value={general.free_delivery_threshold}
                onChange={(e) =>
                  setGeneral({ ...general, free_delivery_threshold: Number(e.target.value) })
                }
                className="w-full px-3.5 py-2.5 border rounded-xl focus:ring-2 focus:ring-brand-pink font-bold text-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* Policy Texts */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <h2 className="font-serif text-base font-bold text-gray-900 border-b pb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand-pink" />
            <span>Website Legal & Customer Policies</span>
          </h2>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Return & Refund Policy</label>
            <textarea
              rows={3}
              value={policies.return_policy}
              onChange={(e) => setPolicies({ ...policies, return_policy: e.target.value })}
              className="w-full px-3.5 py-2 border rounded-xl focus:ring-2 focus:ring-brand-pink"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Privacy Policy</label>
            <textarea
              rows={3}
              value={policies.privacy_policy}
              onChange={(e) => setPolicies({ ...policies, privacy_policy: e.target.value })}
              className="w-full px-3.5 py-2 border rounded-xl focus:ring-2 focus:ring-brand-pink"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Terms and Conditions</label>
            <textarea
              rows={3}
              value={policies.terms_and_conditions}
              onChange={(e) => setPolicies({ ...policies, terms_and_conditions: e.target.value })}
              className="w-full px-3.5 py-2 border rounded-xl focus:ring-2 focus:ring-brand-pink"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-8 py-3 bg-brand-pink hover:bg-brand-rose text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
          >
            Save All Changes
          </button>
        </div>
      </form>
    </div>
  );
};
