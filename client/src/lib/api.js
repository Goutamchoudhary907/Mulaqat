import axios from 'axios';
import { API_URL } from './constants';

const api = axios.create({ baseURL: `${API_URL}/api` });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mulaqat_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/** Pulls a human-readable message out of an axios error. */
export const errMsg = (err, fallback = 'Something went wrong') =>
  err?.response?.data?.message || fallback;

export default api;
