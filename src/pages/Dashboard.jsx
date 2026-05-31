import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { 
  ShoppingBagIcon, 
  CurrencyDollarIcon, 
  ShoppingCartIcon, 
  UsersIcon,
  ArrowTrendingUpIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchRecentOrders();
    fetchRecentUsers();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Please login again');
        window.location.href = '/login';
        return;
      }
      
      const response = await axios.get('/admin/orders/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        window.location.href = '/login';
      } else {
        toast.error(error.response?.data?.detail || 'Failed to load stats');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentOrders = async () => {
    try {
      const response = await axios.get('/admin/orders/recent?limit=5');
      setRecentOrders(response.data);
    } catch (error) {
      console.error('Error fetching recent orders:', error);
    }
  };

  const fetchRecentUsers = async () => {
    try {
      const response = await axios.get('/admin/users/recent?limit=5');
      setRecentUsers(response.data);
    } catch (error) {
      console.error('Error fetching recent users:', error);
    }
  };

  const statCards = [
    {
      title: 'Total Revenue',
      value: `$${stats?.total_revenue?.toFixed(2) || '0.00'}`,
      icon: CurrencyDollarIcon,
      gradient: 'from-emerald-500 to-teal-600',
      bgGradient: 'from-emerald-50 to-teal-50',
      trend: '+12.5%',
      trendUp: true,
    },
    {
      title: 'Total Orders',
      value: stats?.total_orders || 0,
      icon: ShoppingCartIcon,
      gradient: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-50 to-indigo-50',
      trend: '+8.2%',
      trendUp: true,
    },
    {
      title: 'Pending Orders',
      value: stats?.pending_orders || 0,
      icon: ShoppingBagIcon,
      gradient: 'from-amber-500 to-orange-600',
      bgGradient: 'from-amber-50 to-orange-50',
      trend: '-3.1%',
      trendUp: false,
    },
    {
      title: 'Total Users',
      value: stats?.total_users || 0,
      icon: UsersIcon,
      gradient: 'from-purple-500 to-pink-600',
      bgGradient: 'from-purple-50 to-pink-50',
      trend: '+15.3%',
      trendUp: true,
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' };
      case 'paid':
      case 'processing':
        return { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' };
      case 'shipped':
        return { bg: 'bg-indigo-100', text: 'text-indigo-700', dot: 'bg-indigo-500' };
      case 'delivered':
        return { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' };
      case 'cancelled':
        return { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-500' };
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 lg:py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
          </div>
          <p className="text-gray-500 ml-4">
            Welcome back! Here's an overview of your store performance.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className={`relative overflow-hidden bg-gradient-to-br ${stat.bgGradient} rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-medium ${stat.trendUp ? 'text-emerald-600' : 'text-red-600'} bg-white/50 px-2 py-1 rounded-full`}>
                    {stat.trendUp ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />}
                    {stat.trend}
                  </div>
                </div>
                <p className="text-gray-500 text-sm mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`absolute -right-6 -bottom-6 w-24 h-24 bg-gradient-to-br ${stat.gradient} rounded-full opacity-10 group-hover:opacity-20 transition-opacity`}></div>
            </div>
          ))}
        </div>

        {/* Charts and Analytics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* Sales Overview */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <ArrowTrendingUpIcon className="h-5 w-5 text-indigo-500" />
                <h2 className="text-lg font-semibold text-gray-800">Sales Overview</h2>
              </div>
              <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-gray-50 text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 3 months</option>
              </select>
            </div>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl">
              <p className="text-gray-400 text-sm">Chart will appear here</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
            <h2 className="text-lg font-semibold mb-4 opacity-90">Quick Stats</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm opacity-75">Average Order Value</p>
                <p className="text-2xl font-bold">${(stats?.total_revenue / stats?.total_orders || 0).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm opacity-75">Conversion Rate</p>
                <p className="text-2xl font-bold">2.4%</p>
              </div>
              <div>
                <p className="text-sm opacity-75">Customer Satisfaction</p>
                <p className="text-2xl font-bold">4.8 ★</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders and Users */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {recentOrders.length === 0 ? (
                <div className="p-8 text-center">
                  <ShoppingBagIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">No recent orders</p>
                </div>
              ) : (
                recentOrders.map((order) => {
                  const statusStyle = getStatusColor(order.status);
                  return (
                    <div key={order.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${statusStyle.dot}`}></div>
                          <span className="text-sm font-medium text-gray-900">#{order.order_number}</span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div>
                          <p className="text-xs text-gray-500">{order.customer_name || 'Guest'}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                        <p className="text-base font-semibold text-gray-900">${order.final_amount?.toFixed(2)}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            {recentOrders.length > 0 && (
              <div className="px-6 py-3 border-t border-gray-100 bg-gray-50">
                <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                  View All Orders →
                </button>
              </div>
            )}
          </div>

          {/* Recent Users */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">New Customers</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {recentUsers.length === 0 ? (
                <div className="p-8 text-center">
                  <UsersIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">No recent users</p>
                </div>
              ) : (
                recentUsers.map((user) => (
                  <div key={user.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                        <span className="text-indigo-600 font-medium text-sm">
                          {user.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{user.full_name || 'Anonymous'}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <p className="text-xs text-gray-400">{new Date(user.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            {recentUsers.length > 0 && (
              <div className="px-6 py-3 border-t border-gray-100 bg-gray-50">
                <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                  View All Customers →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;