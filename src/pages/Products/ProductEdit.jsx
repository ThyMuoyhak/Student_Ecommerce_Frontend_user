import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI } from '../../api/products';
import { categoriesAPI } from '../../api/categories';
import { 
  XMarkIcon, 
  PlusIcon, 
  PhotoIcon,
  ArrowLeftIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  Squares2X2Icon,
  SwatchIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    title: '',
    original_price: '',
    discount_price: '',
    description: '',
    category_id: '',
    stock_quantity: 0,
    sizes: [],
    colors: [],
  });
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [existingMainImage, setExistingMainImage] = useState('');
  const [subImages, setSubImages] = useState([]);
  const [subImagesPreviews, setSubImagesPreviews] = useState([]);
  const [existingSubImages, setExistingSubImages] = useState([]);
  const [newSize, setNewSize] = useState({ size: 'M', stock: 0 });
  const [newColor, setNewColor] = useState({ color: '', color_code: '#000000' });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [productData, categoriesData] = await Promise.all([
        productsAPI.getById(id),
        categoriesAPI.getAll()
      ]);
      
      setFormData({
        title: productData.title || '',
        original_price: productData.original_price || '',
        discount_price: productData.discount_price || '',
        description: productData.description || '',
        category_id: productData.category_id || '',
        stock_quantity: productData.stock_quantity || 0,
        sizes: productData.sizes || [],
        colors: productData.colors || [],
      });
      
      setExistingMainImage(productData.main_image || '');
      setExistingSubImages(productData.images || []);
      setCategories(categoriesData);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load product data');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getTotalStock = () => {
    if (formData.sizes && formData.sizes.length > 0) {
      return formData.sizes.reduce((total, size) => total + (size.stock || 0), 0);
    }
    return formData.stock_quantity || 0;
  };

  const handleAddSize = () => {
    if (newSize.size && newSize.stock >= 0) {
      if (formData.sizes.some(s => s.size === newSize.size)) {
        toast.error(`Size ${newSize.size} already exists`);
        return;
      }
      setFormData({ ...formData, sizes: [...formData.sizes, newSize] });
      setNewSize({ size: 'M', stock: 0 });
      toast.success(`Added size ${newSize.size}`);
    }
  };

  const handleUpdateSizeStock = (index, newStock) => {
    const updatedSizes = [...formData.sizes];
    updatedSizes[index].stock = parseInt(newStock) || 0;
    setFormData({ ...formData, sizes: updatedSizes });
  };

  const handleRemoveSize = (index) => {
    const removedSize = formData.sizes[index];
    setFormData({ ...formData, sizes: formData.sizes.filter((_, i) => i !== index) });
    toast.success(`Removed size ${removedSize.size}`);
  };

  const handleAddColor = () => {
    if (newColor.color) {
      if (formData.colors.some(c => c.color === newColor.color)) {
        toast.error(`Color ${newColor.color} already exists`);
        return;
      }
      setFormData({ ...formData, colors: [...formData.colors, newColor] });
      setNewColor({ color: '', color_code: '#000000' });
      toast.success(`Added color ${newColor.color}`);
    }
  };

  const handleRemoveColor = (index) => {
    const removedColor = formData.colors[index];
    setFormData({ ...formData, colors: formData.colors.filter((_, i) => i !== index) });
    toast.success(`Removed color ${removedColor.color}`);
  };

  const handleMainImageChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setMainImage(file);
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setSubImages([...subImages, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setSubImagesPreviews([...subImagesPreviews, ...newPreviews]);
  };

  const removeExistingSubImage = (index) => {
    setExistingSubImages(existingSubImages.filter((_, i) => i !== index));
    toast.success('Removed existing image');
  };

  const removeNewSubImage = (index) => {
    URL.revokeObjectURL(subImagesPreviews[index]);
    setSubImages(subImages.filter((_, i) => i !== index));
    setSubImagesPreviews(subImagesPreviews.filter((_, i) => i !== index));
    toast.success('Removed new image');
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    const baseUrl = process.env.REACT_APP_BASE_URL || 'http://localhost:8000';
    const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${baseUrl}${normalizedPath}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const totalStock = getTotalStock();
    if (totalStock === 0 && formData.sizes.length > 0) {
      if (!window.confirm('Total stock is 0. Are you sure you want to save?')) {
        return;
      }
    }
    
    setSubmitting(true);

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('original_price', formData.original_price);
    if (formData.discount_price) formDataToSend.append('discount_price', formData.discount_price);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('category_id', formData.category_id);
    formDataToSend.append('stock_quantity', totalStock);
    formDataToSend.append('sizes', JSON.stringify(formData.sizes));
    formDataToSend.append('colors', JSON.stringify(formData.colors));
    formDataToSend.append('existing_main_image', existingMainImage);
    formDataToSend.append(
      'existing_sub_images',
      JSON.stringify(existingSubImages.map(img => img.image_url))
    );

    if (mainImage) formDataToSend.append('main_image', mainImage);
    subImages.forEach(image => formDataToSend.append('sub_images', image));

    try {
      await productsAPI.update(id, formDataToSend);
      toast.success('Product updated successfully');
      navigate('/products');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error(error.response?.data?.detail || 'Failed to update product');
    } finally {
      setSubmitting(false);
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: DocumentTextIcon },
    { id: 'pricing', label: 'Pricing', icon: CurrencyDollarIcon },
    { id: 'images', label: 'Images', icon: PhotoIcon },
    { id: 'sizes', label: 'Sizes & Stock', icon: Squares2X2Icon },
    { id: 'colors', label: 'Colors', icon: SwatchIcon },
  ];

  const totalStock = getTotalStock();
  const isLowStock = totalStock > 0 && totalStock <= 5;
  const isOutOfStock = totalStock === 0;

  if (loading) return <Loader />;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/products')}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Edit Product
          </h1>
          <p className="text-gray-500 text-sm mt-1">Update product information</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 border-b-2 whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6">
            {/* Basic Information Tab */}
            {activeTab === 'basic' && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Product Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="6"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 resize-none"
                  />
                </div>
              </div>
            )}

            {/* Pricing Tab */}
            {activeTab === 'pricing' && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Original Price ($) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="original_price"
                      value={formData.original_price}
                      onChange={handleChange}
                      required
                      step="0.01"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Discount Price ($)
                    </label>
                    <input
                      type="number"
                      name="discount_price"
                      value={formData.discount_price}
                      onChange={handleChange}
                      step="0.01"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
                    />
                  </div>
                </div>

                {/* Stock Status Card */}
                <div className={`p-4 rounded-xl border ${
                  isOutOfStock ? 'bg-red-50 border-red-200' : 
                  isLowStock ? 'bg-orange-50 border-orange-200' : 
                  'bg-emerald-50 border-emerald-200'
                }`}>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Total Stock:</span>
                    <span className={`text-2xl font-bold ${
                      isOutOfStock ? 'text-red-600' : 
                      isLowStock ? 'text-orange-600' : 
                      'text-emerald-600'
                    }`}>
                      {totalStock}
                    </span>
                  </div>
                  {isLowStock && !isOutOfStock && (
                    <p className="text-xs text-orange-600 mt-2">⚠️ Low stock alert! Consider restocking soon.</p>
                  )}
                  {isOutOfStock && (
                    <p className="text-xs text-red-600 mt-2">❌ Out of stock! Add sizes with stock to sell this product.</p>
                  )}
                </div>
              </div>
            )}

            {/* Images Tab */}
            {activeTab === 'images' && (
              <div className="space-y-6">
                {/* Current Main Image */}
                {existingMainImage && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Main Image</label>
                    <div className="relative inline-block">
                      <img
                        src={getImageUrl(existingMainImage)}
                        alt="Current main"
                        className="w-32 h-32 object-cover rounded-xl border border-gray-200"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/128x128?text=No+Image';
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* New Main Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Change Main Image</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-200 border-dashed rounded-xl hover:border-indigo-400 transition-colors">
                    {mainImagePreview ? (
                      <div className="relative">
                        <img src={mainImagePreview} alt="Main preview" className="h-32 w-auto object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => {
                            setMainImage(null);
                            setMainImagePreview(null);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-2">
                          <label className="cursor-pointer text-indigo-600 hover:text-indigo-500">
                            <span>Upload new image</span>
                            <input type="file" className="sr-only" accept="image/*" onChange={handleMainImageChange} />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Current Sub Images */}
                {existingSubImages.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Additional Images</label>
                    <div className="flex flex-wrap gap-3">
                      {existingSubImages.map((img, idx) => (
                        <div key={idx} className="relative">
                          <img
                            src={getImageUrl(img.image_url)}
                            alt={`sub-${idx}`}
                            className="w-20 h-20 object-cover rounded-xl border border-gray-200"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => removeExistingSubImage(idx)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
                          >
                            <XMarkIcon className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Sub Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Add Additional Images</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-200 border-dashed rounded-xl hover:border-indigo-400 transition-colors">
                    <div className="text-center">
                      <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-2">
                        <label className="cursor-pointer text-indigo-600 hover:text-indigo-500">
                          <span>Upload multiple files</span>
                          <input type="file" className="sr-only" accept="image/*" multiple onChange={handleSubImagesChange} />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                    </div>
                  </div>
                  {subImagesPreviews.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-3">
                      {subImagesPreviews.map((preview, idx) => (
                        <div key={idx} className="relative">
                          <img src={preview} alt={`Preview ${idx + 1}`} className="w-20 h-20 object-cover rounded-xl border border-gray-200" />
                          <button
                            type="button"
                            onClick={() => removeNewSubImage(idx)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
                          >
                            <XMarkIcon className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Sizes Tab */}
            {activeTab === 'sizes' && (
              <div className="space-y-5">
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Size</label>
                    <select
                      value={newSize.size}
                      onChange={(e) => setNewSize({ ...newSize, size: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                    >
                      {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Stock</label>
                    <input
                      type="number"
                      placeholder="Stock"
                      value={newSize.stock}
                      onChange={(e) => setNewSize({ ...newSize, stock: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSize}
                    className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all"
                  >
                    <PlusIcon className="h-5 w-5" />
                  </button>
                </div>

                {formData.sizes.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {formData.sizes.map((size, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-900 w-10">{size.size}</span>
                          <input
                            type="number"
                            value={size.stock}
                            onChange={(e) => handleUpdateSizeStock(idx, e.target.value)}
                            className="w-20 px-2 py-1.5 border border-gray-200 rounded-lg text-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            min="0"
                          />
                          <span className="text-xs text-gray-400">units</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveSize(idx)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-xl">
                    <p className="text-gray-400 text-sm">No sizes added yet</p>
                  </div>
                )}
              </div>
            )}

            {/* Colors Tab */}
            {activeTab === 'colors' && (
              <div className="space-y-5">
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Color Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Navy Blue"
                      value={newColor.color}
                      onChange={(e) => setNewColor({ ...newColor, color: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Color Code</label>
                    <input
                      type="color"
                      value={newColor.color_code}
                      onChange={(e) => setNewColor({ ...newColor, color_code: e.target.value })}
                      className="w-16 h-11 rounded-xl border border-gray-200 cursor-pointer"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddColor}
                    className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all"
                  >
                    <PlusIcon className="h-5 w-5" />
                  </button>
                </div>

                {formData.colors.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {formData.colors.map((color, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-6 h-6 rounded-lg border border-gray-200"
                            style={{ backgroundColor: color.color_code || '#000' }}
                          ></div>
                          <span className="text-sm text-gray-700">{color.color}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveColor(idx)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-xl">
                    <p className="text-gray-400 text-sm">No colors added yet</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50"
            >
              {submitting ? 'Updating...' : 'Update Product'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductEdit;