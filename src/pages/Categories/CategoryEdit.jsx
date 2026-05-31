import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { categoriesAPI } from '../../api/categories';
import { ArrowLeftIcon, FolderIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

const CategoryEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    fetchCategory();
  }, [id]);

  const fetchCategory = async () => {
    try {
      const data = await categoriesAPI.getById(id);
      setCategory(data);
      setFormData({
        name: data.name || '',
        description: data.description || '',
      });
    } catch (error) {
      console.error('Error fetching category:', error);
      toast.error('Failed to load category');
      navigate('/categories');
    } finally {
      setLoading(false);
    }
  };

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

    setSubmitting(true);
    try {
      await categoriesAPI.update(id, formData);
      toast.success('Category updated successfully');
      navigate('/categories');
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error(error.response?.data?.detail || 'Failed to update category');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;
  if (!category) return null;

  const productCount = category.product_count || 0;
  const hasProducts = productCount > 0;

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
            Edit Category
          </h1>
          <p className="text-gray-500 text-sm mt-1">Update category information</p>
        </div>
      </div>

      {/* Warning Banner for Categories with Products */}
      {hasProducts && (
        <div className="mb-6 p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3">
          <ExclamationTriangleIcon className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800">Category has products</p>
            <p className="text-xs text-amber-700 mt-0.5">
              This category contains {productCount} {productCount === 1 ? 'product' : 'products'}. 
              Editing the name will affect all products in this category.
            </p>
          </div>
        </div>
      )}

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

              {/* Category Stats */}
              <div className="pt-2">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                    Category Statistics
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-400">Category ID</p>
                      <p className="text-sm font-medium text-gray-900">{category.id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Products</p>
                      <p className={`text-sm font-medium ${productCount > 0 ? 'text-emerald-600' : 'text-gray-500'}`}>
                        {productCount} {productCount === 1 ? 'product' : 'products'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Created</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(category.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {category.updated_at && (
                      <div>
                        <p className="text-xs text-gray-400">Last Updated</p>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(category.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
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
              disabled={submitting}
              className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Danger Zone - Delete Section */}
      {!hasProducts && (
        <div className="mt-6 p-5 bg-red-50 rounded-xl border border-red-200">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-sm font-semibold text-red-800">Danger Zone</h3>
              <p className="text-xs text-red-600 mt-1">
                Once you delete this category, there's no going back.
              </p>
            </div>
            <button
              type="button"
              onClick={async () => {
                if (window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
                  try {
                    await categoriesAPI.delete(id);
                    toast.success('Category deleted successfully');
                    navigate('/categories');
                  } catch (error) {
                    toast.error(error.response?.data?.detail || 'Failed to delete category');
                  }
                }
              }}
              className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-xl hover:bg-red-200 transition-colors"
            >
              Delete Category
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryEdit;