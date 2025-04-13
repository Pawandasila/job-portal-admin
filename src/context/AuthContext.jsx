import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_BASE_URL + "/api";
    // console.log(API_BASE_URL);
  useEffect(() => {
    const init = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");
        const storedRefreshToken = localStorage.getItem("refreshToken");

        if (storedUser && storedUser !== "undefined") {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Error parsing user data:", error);
                localStorage.removeItem("user");
            }
        }
        if (storedToken) {
          setToken(storedToken);

          if (storedRefreshToken) {
            setRefreshToken(storedRefreshToken);
          }
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error initializing auth context:", error);
        // Clear potentially corrupted data
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  // Login function that uses fetch API directly
  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log(data)

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Invalid email or password",
        };
      }

      // Set state
      console.log(data.adminResponse.id);
      console.log(data.adminResponse.accessToken);

      setUser(data.adminResponse.id);
      setToken(data.adminResponse.accessToken);

      if (data.refreshToken) {
        setRefreshToken(data.refreshToken);
        localStorage.setItem("refreshToken", data.adminResponse.refreshToken);
      }

      // Store in localStorage
      localStorage.setItem("user", JSON.stringify(data.adminResponse.user));
      localStorage.setItem("token", data.adminResponse.accessToken);

      return {
        success: true,
        message: "Logged in successfully",
        user: data.user,
      };
    } catch (error) {
      console.error("Login failed:", error);
      return {
        success: false,
        message: "Server error. Please try again later.",
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up function
  const signup = async (userData) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Signup failed",
        };
      }

      return {
        success: true,
        message: "Signup successful",
        data,
      };
    } catch (error) {
      console.error("Signup failed:", error);
      return {
        success: false,
        message: "Server error. Please try again later.",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const updateToken = (newAccessToken) => {
    setToken(newAccessToken);
    localStorage.setItem("token", newAccessToken);
  };

  // Function to refresh token
  const refreshAccessToken = async () => {
    const currentRefreshToken =
      refreshToken || localStorage.getItem("refreshToken");

    if (!currentRefreshToken) {
      return {
        success: false,
        message: "No refresh token available",
      };
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken: currentRefreshToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        // If refresh fails, logout the user
        logout();
        return {
          success: false,
          message: data.message || "Token refresh failed",
        };
      }

      updateToken(data.accessToken);
      return {
        success: true,
        accessToken: data.accessToken,
      };
    } catch (error) {
      console.error("Token refresh failed:", error);
      logout();
      return {
        success: false,
        message: "Server error. Please try again later.",
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Function to log out
  const logout = () => {
    setUser(null);
    setToken(null);
    setRefreshToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        refreshToken,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        updateToken,
        refreshAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
