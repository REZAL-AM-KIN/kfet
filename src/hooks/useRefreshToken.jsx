import axios from '../auth/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axios.post('token/refresh/', {
      'refresh': setAuth.refresh || sessionStorage.getItem("refresh"),
      withCredentials: true
    });
    setAuth(prev => {
      return { ...prev, access:response.data.access }
    });
    return response.data.access;
  }
  return refresh;
}

export default useRefreshToken;
