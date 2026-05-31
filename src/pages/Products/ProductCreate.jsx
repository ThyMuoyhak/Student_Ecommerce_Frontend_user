import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsAPI } from '../../api/products';
import { categoriesAPI } from '../../api/categories';
import { 
  XMarkIcon, 
  PlusIcon, 
  PhotoIcon,
  ArrowLeftIcon,
  TagIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  Squares2X2Icon,
  SwatchIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const ProductCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
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
  const [subImages, setSubImages] = useState([]);
  const [subImagesPreviews, setSubImagesPreviews] = useState([]);
  const [newSize, setNewSize] = useState({ size: 'M', stock: 0 });
  const [newColor, setNewColor] = useState({ color: '', color_code: '#000000' });
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoriesAPI.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddSize = () => {
    if (newSize.size && newSize.stock >= 0) {
      setFormData({
        ...formData,
        sizes: [...formData.sizes, newSize],
      });
      setNewSize({ size: 'M', stock: 0 });
      toast.success(`Size ${newSize.size} added`);
    }
  };

  const handleRemoveSize = (index) => {
    const removed = formData.sizes[index];
    setFormData({
      ...formData,
      sizes: formData.sizes.filter((_, i) => i !== index),
    });
    toast.success(`Size ${removed.size} removed`);
  };

  const handleAddColor = () => {
    if (newColor.color) {
      setFormData({
        ...formData,
        colors: [...formData.colors, newColor],
      });
      setNewColor({ color: '', color_code: '#000000' });
      toast.success(`Color ${newColor.color} added`);
    }
  };

  const handleRemoveColor = (index) => {
    const removed = formData.colors[index];
    setFormData({
      ...formData,
      colors: formData.colors.filter((_, i) => i !== index),
    });
    toast.success(`Color ${removed.color} removed`);
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

  const removeSubImage = (index) => {
    URL.revokeObjectURL(subImagesPreviews[index]);
    setSubImages(subImages.filter((_, i) => i !== index));
    setSubImagesPreviews(subImagesPreviews.filter((_, i) => i !== index));
  };

  const removeMainImage = () => {
    if (mainImagePreview) {
      URL.revokeObjectURL(mainImagePreview);
    }
    setMainImage(null);
    setMainImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!mainImage) {
      toast.error('Please select a main image');
      return;
    }

    if (!formData.title.trim()) {
      toast.error('Please enter product title');
      return;
    }

    if (!formData.original_price) {
      toast.error('Please enter original price');
      return;
    }

    if (!formData.category_id) {
      toast.error('Please select a category');
      return;
    }

    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('original_price', formData.original_price);
    if (formData.discount_price) formDataToSend.append('discount_price', formData.discount_price);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('category_id', formData.category_id);
    formDataToSend.append('stock_quantity', formData.stock_quantity);
    formDataToSend.append('main_image', mainImage);
    formDataToSend.append('sizes', JSON.stringify(formData.sizes));
    formDataToSend.append('colors', JSON.stringify(formData.colors));
    
    subImages.forEach(image => {
      formDataToSend.append('sub_images', image);
    });

    try {
      await productsAPI.create(formDataToSend);
      toast.success('Product created successfully');
      navigate('/products');
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error(error.response?.data?.detail || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: DocumentTextIcon },
    { id: 'pricing', label: 'Pricing', icon: CurrencyDollarIcon },
    { id: 'images', label: 'Images', icon: PhotoIcon },
    { id: 'sizes', label: 'Sizes', icon: Squares2X2Icon },
    { id: 'colors', label: 'Colors', icon: SwatchIcon },
  ];

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
            Create Product
          </h1>
          <p className="text-gray-500 text-sm mt-1">Add a new product to your store</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 border-b-2 ${
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
                    placeholder="e.g., Classic Cotton T-Shirt"
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
                    placeholder="Describe your product..."
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
                      placeholder="0.00"
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
                      placeholder="0.00"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Base Stock Quantity
                  </label>
                  <input
                    type="number"
                    name="stock_quantity"
                    value={formData.stock_quantity}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
                  />
                  <p className="text-xs text-gray-400 mt-1">Used if sizes are not specified</p>
                </div>
              </div>
            )}

            {/* Images Tab */}
            {activeTab === 'images' && (
              <div className="space-y-6">
                {/* Main Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Main Image <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-200 border-dashed rounded-xl hover:border-indigo-400 transition-colors">
                    {mainImagePreview ? (
                      <div className="relative">
                        <img src={mainImagePreview} alt="Main preview" className="h-40 w-auto object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={removeMainImage}
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
                            <span>Upload a file</span>
                            <input type="file" className="sr-only" accept="image/*" onChange={handleMainImageChange} />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Additional Images
                  </label>
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
                          <img src={preview} alt={`Preview ${idx + 1}`} className="w-20 h-20 object-cover rounded-lg border border-gray-200" />
                          <button
                            type="button"
                            onClick={() => removeSubImage(idx)}
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
                      <option value="XS">XS</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                      <option value="XXL">XXL</option>
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
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                    {formData.sizes.map((size, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <div>
                          <span className="text-sm font-medium text-gray-900">Size {size.size}</span>
                          <p className="text-xs text-gray-500">Stock: {size.stock}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveSize(idx)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <XMarkIcon className="h-5 w-5" />
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
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                    {formData.colors.map((color, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded-lg border border-gray-200"
                            style={{ backgroundColor: color.color_code || '#000' }}
                          ></div>
                          <span className="text-sm font-medium text-gray-900">{color.color}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveColor(idx)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <XMarkIcon className="h-5 w-5" />
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
              disabled={loading}
              className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Product'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductCreate;