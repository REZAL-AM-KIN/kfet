import { useLocation, Outlet, Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const RequireAuth = () => {
  const { auth } = useAuth();
  const location = useLocation();
  // if the user is authenticated, we render the Outlet, else, we navigate him to the login page
  return(
    auth?.user || sessionStorage.getItem("access")
      ? <Outlet />
      : <Navigate to='/login' replace state={{ from: location }} />
  );
}

export default RequireAuth;
