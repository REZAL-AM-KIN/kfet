import axios from 'axios';
import {BASE_URL} from '../settings'

export default axios.create({
  baseURL: BASE_URL
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'Application/json' },

});
