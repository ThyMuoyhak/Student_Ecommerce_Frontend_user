import React, { useState } from 'react';
import axios from '../api/axios';
import toast from 'react-hot-toast';

const SimpleLogin = () => {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);
    
    console.log('Sending login request...');
    
    try {
      const response = await axios.post('/auth/login', formData);
      console.log('Login response:', response.data);
      setResult({ success: true, data: response.data });
      
      if (response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        toast.success('Login successful! Check console');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setResult({ success: false, error: error.response?.data || error.message });
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const checkStorage = () => {
    const token = localStorage.getItem('access_token');
    const user = localStorage.getItem('user');
    setResult({
      storage: {
        token: token ? token.substring(0, 50) + '...' : 'null',
        user: user
      }
    });
  };

  const testAdminEndpoint = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      toast.error('No token found. Please login first.');
      return;
    }
    
    try {
      const response = await axios.get('/admin/orders/dashboard/stats');
      console.log('Admin endpoint response:', response.data);
      setResult({ adminData: response.data });
      toast.success('Admin endpoint successful!');
    } catch (error) {
      console.error('Admin endpoint failed:', error);
      setResult({ adminError: error.response?.data });
      toast.error('Admin endpoint failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Simple Login Test</h1>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="mt-4 space-y-2">
          <button
            onClick={checkStorage}
            className="w-full bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600"
          >
            Check localStorage
          </button>
          
          <button
            onClick={testAdminEndpoint}
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
          >
            Test Admin Endpoint
          </button>
        </div>
        
        {result && (
          <div className="mt-4 p-3 bg-gray-100 rounded-md overflow-auto max-h-96">
            <pre className="text-xs">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleLogin;