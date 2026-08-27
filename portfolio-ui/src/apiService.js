import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "/api/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export const axiosGet = async (url, params = {}) => {
  const response = await apiClient.get(url, { params });
  return response.data;
};

export const axiosPost = async (url, data = {}) => {
  const response = await apiClient.post(url, data);
  return response.data;
};

export const axiosPut = async (url, data = {}) => {
  const response = await apiClient.put(url, data);
  return response.data;
};

export const axiosDelete = async (url, params = {}) => {
  const response = await apiClient.delete(url, { params });
  return response.data;
};

export default {
  axiosGet,
  axiosPost,
  axiosPut,
  axiosDelete,
};
