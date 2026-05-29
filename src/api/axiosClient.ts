import axios, { AxiosError } from "axios";

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

export interface ApiError {
  status?: number;
  data?: unknown;
  message: string;
  originalError?: unknown;
}

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4321/";

const apiClient: AxiosInstance = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
  timeout: 30000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const apiError: ApiError = {
      message: error.message,
      originalError: error,
      status: error.response?.status,
      data: error.response?.data,
    };

    return Promise.reject(apiError);
  },
);

export const get = <T = unknown>(url: string, config?: AxiosRequestConfig) =>
  apiClient.get<T>(url, config);
export const post = <T = unknown>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
) => apiClient.post<T>(url, data, config);
export const put = <T = unknown>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
) => apiClient.put<T>(url, data, config);
export const del = <T = unknown>(url: string, config?: AxiosRequestConfig) =>
  apiClient.delete<T>(url, config);

export default apiClient;
