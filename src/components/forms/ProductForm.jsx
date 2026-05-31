import React, { useState, useEffect } from 'react';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';

const ProductForm = ({ initialData, categories, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    title: '',
    original_price: '',
    discount_price: '',
    description: '',
    category_id: '',
    stock_quantity: 0,
    sizes: [],
    colors: [],
    ...initialData
  });
  const [newSize, setNewSize] = useState({ size: 'M', stock: 0 });
  const [newColor, setNewColor] = useState({ color: '', color_code: '' });

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
    }
  };

  const handleRemoveSize = (index) => {
    setFormData({
      ...formData,
      sizes: formData.sizes.filter((_, i) => i !== index),
    });
  };

  const handleAddColor = () => {
    if (newColor.color) {
      setFormData({
        ...formData,
        colors: [...formData.colors, newColor],
      });
      setNewColor({ color: '', color_code: '' });
    }
  };

  const handleRemoveColor = (index) => {
    setFormData({
      ...formData,
      colors: formData.colors.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Original Price *</label>
                <input
                  type="number"
                  name="original_price"
                  value={formData.original_price}
                  onChange={handleChange}
                  required
                  step="0.01"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price</label>
                <input
                  type="number"
                  name="discount_price"
                  value={formData.discount_price}
                  onChange={handleChange}
                  step="0.01"
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                required
                className="input-field"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
              <input
                type="number"
                name="stock_quantity"
                value={formData.stock_quantity}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Sizes and Colors */}
        <div>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Sizes</h3>
            <div className="flex gap-2 mb-3">
              <select
                value={newSize.size}
                onChange={(e) => setNewSize({ ...newSize, size: e.target.value })}
                className="input-field"
              >
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>
              <input
                type="number"
                placeholder="Stock"
                value={newSize.stock}
                onChange={(e) => setNewSize({ ...newSize, stock: parseInt(e.target.value) })}
                className="input-field w-24"
              />
              <button type="button" onClick={handleAddSize} className="btn-primary px-3">
                <PlusIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-2">
              {formData.sizes.map((size, idx) => (
                <div key={idx} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                  <span>Size: {size.size} (Stock: {size.stock})</span>
                  <button type="button" onClick={() => handleRemoveSize(idx)} className="text-red-500">
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Colors</h3>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Color Name"
                value={newColor.color}
                onChange={(e) => setNewColor({ ...newColor, color: e.target.value })}
                className="input-field"
              />
              <input
                type="color"
                value={newColor.color_code || '#000000'}
                onChange={(e) => setNewColor({ ...newColor, color_code: e.target.value })}
                className="w-12 h-10 rounded border"
              />
              <button type="button" onClick={handleAddColor} className="btn-primary px-3">
                <PlusIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-2">
              {formData.colors.map((color, idx) => (
                <div key={idx} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded border" style={{ backgroundColor: color.color_code || '#000' }}></div>
                    <span>{color.color}</span>
                  </div>
                  <button type="button" onClick={() => handleRemoveColor(idx)} className="text-red-500">
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t">
        <button type="submit" disabled={isLoading} className="btn-primary">
          {isLoading ? 'Saving...' : 'Save Product'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;