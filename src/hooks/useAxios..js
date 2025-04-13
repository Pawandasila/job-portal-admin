import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useContext, useMemo } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// Custom React hook for creating an authenticated axios instance
const useAxios = () => {
  const { token, refreshAccessToken, logout, isLoading } =
    useContext(AuthContext);
  const navigate = useNavigate();

  // Create memoized axios instance that persists between renders
  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: import.meta.env.VITE_BASE_URL + "/api", // Your API base URL
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor to add the token to every request
    instance.interceptors.request.use(
      async (config) => {
        // If auth is still loading, wait for it
        if (isLoading) {
          // Wait for auth to complete loading
          await new Promise((resolve) => {
            const checkLoading = () => {
              if (!isLoading) {
                resolve();
              } else {
                setTimeout(checkLoading, 100);
              }
            };
            checkLoading();
          });
        }

        // Get the current token from localStorage
        const currentToken = localStorage.getItem("token");

        // If no token and the endpoint is not public, redirect to login
        if (!currentToken && !config.url.includes("/public")) {
          navigate("/login");
          return Promise.reject("No auth token available");
        }

        // Add authorization header if token exists
        if (currentToken) {
          config.headers.Authorization = `Bearer ${currentToken}`;
          // Check if token is expired
          try {
            const user = jwtDecode(currentToken);
            const isExpired = user.exp ? user.exp * 1000 < Date.now() : false;

            if (!isExpired) {
              return config;
            }

            try {
              const result = await refreshAccessToken();

              if (result.success) {
                config.headers.Authorization = `Bearer ${currentToken}`;
                return config;
              } else {
                logout();
                navigate("/login");
                return Promise.reject("Token refresh failed");
              }
            } catch (refreshError) {
              console.error("Error refreshing token:", refreshError);
              logout();
              navigate("/login");
              return Promise.reject(refreshError);
            }
          } catch (error) {
            console.error("Token validation error:", error);
            return config;
          }
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle authentication errors
    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle 401 unauthorized errors
        if (error.response && error.response.status === 401) {
          logout();
          navigate("/login");
        }
        return Promise.reject(error);
      }
    );

    return instance;
  }, [token, refreshAccessToken, logout, navigate, isLoading]);

  return axiosInstance;
};

export default useAxios;
