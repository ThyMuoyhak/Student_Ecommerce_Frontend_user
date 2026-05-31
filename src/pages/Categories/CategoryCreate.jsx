import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoriesAPI } from '../../api/categories';
import { ArrowLeftIcon, FolderIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const CategoryCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Please enter category name');
      return;
    }

    setLoading(true);
    try {
      await categoriesAPI.create(formData);
      toast.success('Category created successfully');
      navigate('/categories');
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error(error.response?.data?.detail || 'Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/categories')}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Create Category
          </h1>
          <p className="text-gray-500 text-sm mt-1">Add a new product category to your store</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            {/* Icon Preview */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                <FolderIcon className="h-10 w-10 text-indigo-600" />
              </div>
            </div>

            <div className="space-y-5">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Electronics, Clothing, Books"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 transition-all"
                  autoFocus
                />
                <p className="text-xs text-gray-400 mt-1">This will be displayed on the product pages</p>
              </div>

              {/* Description Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Description <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Describe the category..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 resize-none transition-all"
                />
                <p className="text-xs text-gray-400 mt-1">A brief description of what products belong in this category</p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/categories')}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </span>
              ) : (
                'Create Category'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Help Section */}
      <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
        <h3 className="text-sm font-medium text-gray-700 mb-2">💡 Tips for good categories</h3>
        <ul className="text-xs text-gray-500 space-y-1">
          <li>• Use clear and descriptive names (e.g., "Men's Clothing" instead of "Clothes")</li>
          <li>• Keep category names short and concise (1-3 words)</li>
          <li>• Add a description to help customers understand what they'll find</li>
          <li>• Categories can be organized by product type, season, or collection</li>
        </ul>
      </div>
    </div>
  );
};

export default CategoryCreate;