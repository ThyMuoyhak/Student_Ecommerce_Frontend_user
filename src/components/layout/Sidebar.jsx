import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  HomeIcon, 
  ShoppingBagIcon, 
  TagIcon, 
  ShoppingCartIcon, 
  UsersIcon, 
  Cog6ToothIcon,
  UserCircleIcon,
  XMarkIcon,
  ArrowRightStartOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useContext(AuthContext);

  const menuItems = [
    { path: '/dashboard', name: 'Dashboard', icon: HomeIcon },
    { path: '/products', name: 'Products', icon: ShoppingBagIcon },
    { path: '/categories', name: 'Categories', icon: TagIcon },
    { path: '/orders', name: 'Orders', icon: ShoppingCartIcon },
    { path: '/users', name: 'Users', icon: UsersIcon },
    { path: '/profile', name: 'Profile', icon: UserCircleIcon },
    { path: '/settings', name: 'Settings', icon: Cog6ToothIcon },
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-72 bg-gradient-to-b from-gray-900 to-gray-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Logo Section */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-700/50">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-lg font-semibold text-white tracking-tight">Studio Admin</span>
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="text-gray-400 hover:text-white transition-colors lg:hidden"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* User Profile Section */}
        <div className="px-4 py-5 border-b border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-gray-700">
              <UserCircleIcon className="h-6 w-6 text-indigo-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.full_name || 'Admin User'}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {user?.role === 'admin' ? 'Administrator' : 'Staff'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 overflow-y-auto">
          <div className="mb-6">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Main Menu
            </p>
          </div>
          {menuItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1.5 transition-all duration-200 group ${
                  active
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className={`h-5 w-5 transition-colors ${
                  active ? 'text-white' : 'text-gray-400 group-hover:text-white'
                }`} />
                <span className="text-sm font-medium">{item.name}</span>
                {active && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Section */}
        <div className="p-4 border-t border-gray-700/50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-red-500/10 transition-all duration-200 group"
          >
            <ArrowRightStartOnRectangleIcon className="h-5 w-5 group-hover:text-red-400" />
            <span className="text-sm font-medium">Logout</span>
          </button>
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-600">
              v1.0.0
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;