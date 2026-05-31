import axios from './axios';

export const usersAPI = {
  getAll: async () => {
    const response = await axios.get('/admin/auth/users');
    return response.data;
  },

  getById: async (id) => {
    const response = await axios.get(`/admin/auth/users/${id}`);
    return response.data;
  },

  updateRole: async (id, role) => {
    const response = await axios.put(`/admin/auth/users/${id}/role?role=${role}`);
    return response.data;
  },

  toggleStatus: async (id) => {
    const response = await axios.put(`/admin/auth/users/${id}/toggle-status`);
    return response.data;
  },
};