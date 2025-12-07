import { useLocation, Outlet, Navigate } from 'react-router-dom';
import {useIsActivated} from "../hooks/useUser";

const RequireAuth = () => {
  const location = useLocation();
  const isActivated = useIsActivated();
  // if the user is authenticated and his consommateur is activated, we render the Outlet, else, we navigate him to the login page
  return (
      isActivated
      ? <Outlet />
      : <Navigate to='/login' replace state={{ from: location }} />
  );
}

export default RequireAuth;
