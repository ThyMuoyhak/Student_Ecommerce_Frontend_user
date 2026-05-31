import axios from './axios';

export const ordersAPI = {
  getAll: async (params = {}) => {
    const response = await axios.get('/admin/orders', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await axios.get(`/orders/${id}`);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await axios.put(`/admin/orders/${id}/status?status=${status}`);
    return response.data;
  },
};