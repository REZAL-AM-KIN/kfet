import { useLocation, Outlet, Navigate } from 'react-router-dom';

const RequireAuth = ({width, page}) => {
  const location = useLocation();
  // if the user is authenticated, we render the Outlet, else, we navigate him to the login page
  return (
    sessionStorage.getItem("access")
      ? <Outlet />
      : <Navigate to='/login' replace state={{ from: location }} />
  );
}

export default RequireAuth;
