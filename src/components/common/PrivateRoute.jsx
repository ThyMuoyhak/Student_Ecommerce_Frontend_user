// src/components/common/PrivateRoute.jsx
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';  // Fixed path
import Loader from './Loader';

const PrivateRoute = () => {
  const { isAuthenticated, loading, user } = useContext(AuthContext);

  console.log('PrivateRoute - isAuthenticated:', isAuthenticated);
  console.log('PrivateRoute - loading:', loading);
  console.log('PrivateRoute - user:', user);

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Check if user is admin
  if (user?.role !== 'admin') {
    console.log('User is not admin, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log('Authenticated as admin, rendering outlet');
  return <Outlet />;
};

export default PrivateRoute;