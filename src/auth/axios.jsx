import axios from 'axios';

console.log(process.env.REACT_APP_BASE_URL)
export default axios.create({
  baseURL: process.env.REACT_APP_BASE_URL
});

export const axiosPrivate = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: { 'Content-Type': 'Application/json' },

});
