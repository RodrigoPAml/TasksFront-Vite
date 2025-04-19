import axios from 'axios';
import { getApiUrl } from '../utils/env';

const api = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error?.response?.status === 401) {
      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);

      return Promise.resolve({
        success: false,
        errorMessage: 'Login expired',
        code: error?.status ?? -1,
        data: null,
      });
    }

    const backendError = error?.response &&
      'data' in error.response &&
      typeof error.response.data === 'object' &&
      'code' in error.response.data &&
      'success' in error.response.data;

    if (backendError) {
      return Promise.resolve(error.response.data);
    }

    return Promise.resolve({
      success: false,
      errorMessage: 'Something went wrong',
      code: error?.status ?? -1,
      data: null,
    });
  }
);

export default api;