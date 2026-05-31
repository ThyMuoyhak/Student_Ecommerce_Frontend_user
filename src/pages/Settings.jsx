import React, { useState } from 'react';
import { 
  BuildingStorefrontIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  CurrencyDollarIcon,
  PercentBadgeIcon,
  TruckIcon,
  GlobeAltIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Settings = () => {
  const [settings, setSettings] = useState({
    storeName: 'Fashion Store',
    storeEmail: 'info@fashionstore.com',
    storePhone: '+855 12 345 678',
    storeAddress: '123 Fashion Street, Phnom Penh',
    currency: 'USD',
    taxRate: 10,
    freeShippingThreshold: 50,
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value,
    });
    setSaved(false);
  };

  const handleSave = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Save settings logic here
    setLoading(false);
    setSaved(true);
    toast.success('Settings saved successfully');
    setTimeout(() => setSaved(false), 3000);
  };

  const currencyOptions = [
    { value: 'USD', label: 'USD - US Dollar', symbol: '$' },
    { value: 'EUR', label: 'EUR - Euro', symbol: '€' },
    { value: 'GBP', label: 'GBP - British Pound', symbol: '£' },
    { value: 'KHR', label: 'KHR - Cambodian Riel', symbol: '៛' },
  ];

  // InfoCard as a separate component inside the file
  const InfoCard = ({ icon: Icon, title, children }) => {
    // Ensure Icon is valid
    if (!Icon) {
      return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          </div>
          <div className="p-6">{children}</div>
        </div>
      );
    }
    
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-indigo-500" />
            <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          </div>
        </div>
        <div className="p-6">{children}</div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="text-gray-500 text-sm mt-1">Configure your store settings</p>
          </div>
          <button
            onClick={handleSave}
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 shadow-sm hover:shadow-md"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : saved ? (
              <>
                <CheckCircleIcon className="h-4 w-4" />
                Saved!
              </>
            ) : (
              'Save Settings'
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Store Information */}
        <InfoCard icon={BuildingStorefrontIcon} title="Store Information">
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
                Store Name
              </label>
              <div className="relative">
                <BuildingStorefrontIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="storeName"
                  value={settings.storeName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
                  placeholder="Your store name"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
                Store Email
              </label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="storeEmail"
                  value={settings.storeEmail}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
                  placeholder="contact@yourstore.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
                Store Phone
              </label>
              <div className="relative">
                <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="storePhone"
                  value={settings.storePhone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
                  placeholder="+1 234 567 8900"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
                Store Address
              </label>
              <div className="relative">
                <MapPinIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <textarea
                  name="storeAddress"
                  value={settings.storeAddress}
                  onChange={handleChange}
                  rows="3"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 resize-none"
                  placeholder="Your store address"
                />
              </div>
            </div>
          </div>
        </InfoCard>

        {/* Store Settings */}
        <InfoCard icon={CurrencyDollarIcon} title="Store Settings">
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
                Currency
              </label>
              <div className="relative">
                <GlobeAltIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  name="currency"
                  value={settings.currency}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 appearance-none"
                >
                  {currencyOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
                Tax Rate (%)
              </label>
              <div className="relative">
                <PercentBadgeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  name="taxRate"
                  value={settings.taxRate}
                  onChange={handleChange}
                  step="0.5"
                  min="0"
                  max="100"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
                  placeholder="0"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Applied to all orders</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
                Free Shipping Threshold ($)
              </label>
              <div className="relative">
                <TruckIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  name="freeShippingThreshold"
                  value={settings.freeShippingThreshold}
                  onChange={handleChange}
                  step="10"
                  min="0"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
                  placeholder="0"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Orders above this amount get free shipping</p>
            </div>
          </div>
        </InfoCard>
      </div>

      {/* Preview Card */}
      <div className="mt-6">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
          <h3 className="text-sm font-semibold text-indigo-900 mb-3">Preview</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-xs text-indigo-600">Store Name</p>
              <p className="font-medium text-gray-900">{settings.storeName}</p>
            </div>
            <div>
              <p className="text-xs text-indigo-600">Currency</p>
              <p className="font-medium text-gray-900">
                {currencyOptions.find(c => c.value === settings.currency)?.symbol} {settings.currency}
              </p>
            </div>
            <div>
              <p className="text-xs text-indigo-600">Tax Rate</p>
              <p className="font-medium text-gray-900">{settings.taxRate}%</p>
            </div>
            <div>
              <p className="text-xs text-indigo-600">Free Shipping</p>
              <p className="font-medium text-gray-900">
                ${settings.freeShippingThreshold}+
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;