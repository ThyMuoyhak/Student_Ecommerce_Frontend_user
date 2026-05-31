import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AdminLayout from './components/layout/AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/Products/ProductList';
import ProductCreate from './pages/Products/ProductCreate';
import ProductEdit from './pages/Products/ProductEdit';
import CategoryList from './pages/Categories/CategoryList';
import CategoryCreate from './pages/Categories/CategoryCreate';
import CategoryEdit from './pages/Categories/CategoryEdit';
import OrderList from './pages/Orders/OrderList';
import OrderDetail from './pages/Orders/OrderDetail';
import UserList from './pages/Users/UserList';
import UserDetail from './pages/Users/UserDetail';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import PrivateRoute from './components/common/PrivateRoute';

function App() {
  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Fashion Store</title>
      </Helmet>
      
      <Routes>
        <Route path="/" element={<Login />} />
        
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* Products */}
            <Route path="products" element={<ProductList />} />
            <Route path="products/create" element={<ProductCreate />} />
            <Route path="products/edit/:id" element={<ProductEdit />} />
            
            {/* Categories */}
            <Route path="categories" element={<CategoryList />} />
            <Route path="categories/create" element={<CategoryCreate />} />
            <Route path="categories/edit/:id" element={<CategoryEdit />} />
            
            {/* Orders */}
            <Route path="orders" element={<OrderList />} />
            <Route path="orders/:id" element={<OrderDetail />} />
            
            {/* Users */}
            <Route path="users" element={<UserList />} />
            <Route path="users/:id" element={<UserDetail />} />
            
            {/* Settings */}
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
        
        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;