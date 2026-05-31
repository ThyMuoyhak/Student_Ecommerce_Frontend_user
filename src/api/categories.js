import axios from './axios';

export const categoriesAPI = {
  getAll: async () => {
    const response = await axios.get('/categories');
    return response.data;
  },

  getById: async (id) => {
    const response = await axios.get(`/categories/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await axios.post('/categories', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await axios.put(`/categories/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await axios.delete(`/categories/${id}`);
    return response.data;
  },
};