import axios from './axios';

export const dashboardAPI = {
  getStats: async () => {
    try {
      console.log('[Dashboard] Fetching stats...');
      const response = await axios.get('/admin/orders/dashboard/stats');
      console.log('[Dashboard] Stats response:', response.data);
      return response.data;
    } catch (error) {
      console.error('[Dashboard] Error fetching stats:', error);
      console.error('[Dashboard] Error response:', error.response?.data);
      throw error;
    }
  },
};