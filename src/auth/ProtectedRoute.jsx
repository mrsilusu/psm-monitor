import React from 'react';
import { useAuth } from './useAuth.js';

// `fallback` pode ser um nó React (ex.: <Login />) ou null
const ProtectedRoute = ({ children, fallback = null }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? children : fallback;
};

export default ProtectedRoute;
