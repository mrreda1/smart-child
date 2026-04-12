import axios from "axios";

import { toast } from "react-toastify";

import authService from "@/services/authService";

const apiBaseURL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: apiBaseURL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.config?.silent_error) return Promise.reject(error);

    if (!error.response) {
      toast.error(error.message);
      return Promise.reject(error);
    }

    const status = error.response.status;

    let serverMessage = error.response.data?.message;

    serverMessage = serverMessage && serverMessage.split(":").pop().trim();

    switch (status) {
      case 400:
        toast.error(
          serverMessage || "Validation failed. Please check your inputs.",
        );
        break;
      case 401:
        if (localStorage.getItem("jwt")) {
          toast.error(serverMessage);
          authService.logout(4);
        }
        break;
      case 403:
        toast.error(
          serverMessage || "You do not have permission to perform this action.",
        );
        break;
      case 404:
        toast.error(serverMessage || "The requested resource was not found.");
        break;
      case 500:
      case 502:
      case 503:
        toast.error("Server error. Our engineers have been notified.");
        break;
      default:
        toast.error(serverMessage || "An unexpected error occurred.");
    }

    return Promise.reject(error);
  },
);

export default apiClient;
