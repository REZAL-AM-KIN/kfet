import React from 'react';
import { useLocation } from 'react-router';
import { Outlet, Navigate } from 'react-router-dom';

import { isAuthenticated } from './user';

const RequireAuth = () => {
  const location = useLocation();
  // if the user is authenticated, we render the Outlet, else, we navigate him to the login page
  return isAuthenticated() ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ from: location}}/>
  )
}

export default RequireAuth
