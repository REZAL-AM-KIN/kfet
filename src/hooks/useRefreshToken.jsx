import axios from '../auth/axios';

const useRefreshToken = () => {

  const refresh = async () => {
    const response = await axios.post('token/refresh/', {
      'refresh': sessionStorage.getItem("refresh"),
    });
    return response.data.access;
  }
  return refresh;
}

export default useRefreshToken;
