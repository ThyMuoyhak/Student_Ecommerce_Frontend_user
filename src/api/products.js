import axios from './axios';

export const productsAPI = {
  getAll: async (params = {}) => {
    try {
      const response = await axios.get('/products', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await axios.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  create: async (formData) => {
    try {
      const response = await axios.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  update: async (id, formData) => {
    try {
      // Use PUT with FormData for image updates
      const response = await axios.put(`/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await axios.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  toggleStatus: async (id) => {
    try {
      const response = await axios.put(`/admin/products/${id}/toggle-status`);
      return response.data;
    } catch (error) {
      console.error('Error toggling product status:', error);
      throw error;
    }
  },
};