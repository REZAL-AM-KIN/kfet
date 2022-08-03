import axios from 'axios';
const BASE_URL = 'http://127.0.0.1:8000/api/'

export default axios.create({
  baseURL: BASE_URL
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'Application/json' },
  withCredentials: true
});
