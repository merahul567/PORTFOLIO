import axios from 'axios';

// Base Axios instance
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || '/api/',
  timeout: 10000, // Timeout in milliseconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor (optional)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Retrieve auth token if available
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor (optional)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Unauthorized access. Please log in.');
      // Handle redirection or token refresh logic if necessary
    }
    return Promise.reject(error);
  }
);

// Axios HTTP methods
export const axiosGet = async (url, params = {}) => {
  try {
    const response = await apiClient.get(url, { params }); 
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const axiosPost = async (url, data = {}) => {
  try {
    const response = await apiClient.post(url, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const axiosPut = async (url, data = {}) => {
  try {
    const response = await apiClient.put(url, data); 
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const axiosDelete = async (url, params = {}) => {
  try {
    const response = await apiClient.delete(url, { params }); 
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Default export with all methods
export default {
  axiosGet,
  axiosPost,
  axiosPut,
  axiosDelete,
};
