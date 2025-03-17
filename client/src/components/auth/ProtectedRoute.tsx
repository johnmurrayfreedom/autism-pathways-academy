import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  // Allow additional props in the future
  redirectPath?: string;
}

/**
 * A wrapper component for routes that require authentication.
 * If the user is not authenticated, they will be redirected to the login page.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  redirectPath = '/login',
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading if authentication state is still being determined
  if (isLoading) {
    // You could replace this with a loading spinner component
    return <div className="loading-spinner">Loading...</div>;
  }

  // If not authenticated, redirect to login with the current path as a return URL
  if (!isAuthenticated) {
    return (
      <Navigate
        to={redirectPath}
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  // If authenticated, render the child routes
  return <Outlet />;
};

export default ProtectedRoute; 