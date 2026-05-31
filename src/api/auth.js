import axios from './axios';

export const authAPI = {
  login: async (credentials) => {
    console.log('[Auth] Starting login for:', credentials.email);
    
    // Create form data
    const formData = new FormData();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);
    
    console.log('[Auth] FormData created with username:', credentials.email);
    
    try {
      const response = await axios.post('/auth/login', formData);
      
      console.log('[Auth] Response received:', response.status);
      console.log('[Auth] Response data:', response.data);
      
      // Check response structure
      if (!response.data) {
        console.error('[Auth] No data in response');
        throw new Error('No response data');
      }
      
      if (!response.data.access_token) {
        console.error('[Auth] No access_token in response. Response keys:', Object.keys(response.data));
        throw new Error('No access token received');
      }
      
      // Store token and user
      console.log('[Auth] Storing token:', response.data.access_token.substring(0, 50) + '...');
      localStorage.setItem('access_token', response.data.access_token);
      
      console.log('[Auth] Storing user:', response.data.user);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Verify storage
      const savedToken = localStorage.getItem('access_token');
      const savedUser = localStorage.getItem('user');
      
      console.log('[Auth] Verification - Token saved:', !!savedToken);
      console.log('[Auth] Verification - User saved:', !!savedUser);
      
      if (!savedToken) {
        console.error('[Auth] Token was not saved to localStorage!');
        throw new Error('Failed to save token');
      }
      
      return response.data;
      
    } catch (error) {
      console.error('[Auth] Login error:', error);
      if (error.response) {
        console.error('[Auth] Error response:', error.response.status, error.response.data);
      }
      throw error;
    }
  },

  logout: () => {
    console.log('[Auth] Logging out');
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  },

  getCurrentUser: async () => {
    console.log('[Auth] Getting current user');
    try {
      const response = await axios.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('[Auth] Error getting current user:', error);
      throw error;
    }
  },

  updateProfile: async (userData) => {
    console.log('[Auth] Updating profile');
    const response = await axios.put('/auth/profile', userData);
    return response.data;
  },
};