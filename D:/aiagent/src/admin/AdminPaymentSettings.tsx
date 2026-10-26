import React, { useState, useEffect } from 'react';
import { CreditCard, Save, CheckCircle2, ShieldCheck } from 'lucide-react';
import { PaymentSetting } from '../types';
import { DataService } from '../services/dataService';

export const AdminPaymentSettings: React.FC = () => {
  const [settings, setSettings] = useState<PaymentSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    DataService.getPaymentSettings().then((data) => {
      setSettings(data);
      setLoading(false);
    });
  }, []);

  const handleChange = (
    index: number,
    field: keyof PaymentSetting,
    value: any
  ) => {
    setSettings((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(false);

    for (const s of settings) {
      await DataService.updatePaymentSetting(s);
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  if (loading) {
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
          <h1 className="font-serif text-2xl font-bold text-gray-900">
            Payment Method Settings
          </h1>
          <p className="text-xs text-gray-500">
            Configure Bangladesh mobile financial services (bKash, Nagad, Rocket) and Cash on Delivery
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="px-6 py-2.5 bg-brand-pink hover:bg-brand-rose text-white text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save All Settings</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
          <span>Payment settings updated successfully! All changes are now live on checkout.</span>
        </div>
      )}

      <form onSubmit={handleSaveAll} className="space-y-6">
        {settings.map((item, index) => {
          const isManual = item.method_code !== 'cod';
          return (
            <div
              key={item.id}
              className={`bg-white rounded-2xl border p-6 shadow-sm space-y-4 ${
                item.is_enabled ? 'border-gray-200' : 'border-gray-100 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-softPink flex items-center justify-center text-brand-rose font-bold text-xs uppercase">
                    {item.method_code}
                  </div>
                  <div>
                    <h2 className="font-serif text-base font-bold text-gray-900">
                      {item.display_name}
                    </h2>
                    <span className="text-[11px] text-gray-400">
                      Method Code: {item.method_code}
                    </span>
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={item.is_enabled}
                    onChange={(e) => handleChange(index, 'is_enabled', e.target.checked)}
                    className="w-4 h-4 rounded text-brand-pink accent-brand-pink"
                  />
                  <span>{item.is_enabled ? 'Enabled' : 'Disabled'}</span>
                </label>
              </div>

              {isManual && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      {item.display_name} Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={item.account_number || ''}
                      onChange={(e) => handleChange(index, 'account_number', e.target.value)}
                      placeholder="e.g. 01712345678"
                      className="w-full px-3.5 py-2 border rounded-xl font-mono font-bold focus:ring-2 focus:ring-brand-pink"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Account Type</label>
                    <select
                      value={item.account_type || 'Personal'}
                      onChange={(e) => handleChange(index, 'account_type', e.target.value)}
                      className="w-full px-3.5 py-2 border rounded-xl focus:ring-2 focus:ring-brand-pink bg-white"
                    >
                      <option value="Personal">Personal (Send Money)</option>
                      <option value="Merchant">Merchant (Payment)</option>
                      <option value="Agent">Agent (Cash Out)</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="text-xs">
                <label className="block font-semibold text-gray-700 mb-1">
                  Customer Payment Instructions shown at Checkout
                </label>
                <textarea
                  rows={3}
                  value={item.instructions || ''}
                  onChange={(e) => handleChange(index, 'instructions', e.target.value)}
                  className="w-full px-3.5 py-2 border rounded-xl focus:ring-2 focus:ring-brand-pink leading-relaxed"
                />
              </div>
            </div>
          );
        })}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-8 py-3 bg-brand-pink hover:bg-brand-rose text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
          >
            Save All Payment Settings
          </button>
        </div>
      </form>
    </div>
  );
};
