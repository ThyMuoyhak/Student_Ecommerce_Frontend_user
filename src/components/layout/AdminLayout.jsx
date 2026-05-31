import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      {/* Main Content */}
      <div className="lg:pl-72 transition-all duration-300">
        <Header setSidebarOpen={setSidebarOpen} />
        <main className="p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Page content container */}
            <div className="animate-fade-in">
              <Outlet />
            </div>
          </div>
        </main>
        
        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white/50 mt-8">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-400">
              <p>&copy; {new Date().getFullYear()} Studio Admin. All rights reserved.</p>
              <div className="flex gap-4">
                <a href="#" className="hover:text-gray-600 transition-colors">Terms</a>
                <a href="#" className="hover:text-gray-600 transition-colors">Privacy</a>
                <a href="#" className="hover:text-gray-600 transition-colors">Support</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;