import axios from 'axios';


function refresh_token() {
  return axios.post('http://127.0.0.1:8000/api/token/refresh/', {'refresh': sessionStorage.getItem('refresh_token')})
}


axios_instance.interceptors.response.use((response) => {
  return response
}, async (error) => {
  const config = error.config;
  if (error.response && error.response.status === 401) {
    let res = await refresh_token();
    if (res.data.access) {
      sessionStorage.setItem("access_token", res.data.accesss)
      return acios_instance(config);
    }
  }
  return Promise.reject(error)
});
