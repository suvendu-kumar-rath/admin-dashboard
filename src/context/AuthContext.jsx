import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, setAuthToken, clearAuthTokens, getAuthToken } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Restore user session on app mount
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    const token = getAuthToken();
    
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to restore user session:", err);
        clearAuthTokens();
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await loginUser(email, password);
      // Handle both local and production API response formats
      const token = response.token || response.accessToken;
      const userData = response.user;

      // Store tokens and user data
      setAuthToken(token);
      if (response.refreshToken) {
        sessionStorage.setItem("refreshToken", response.refreshToken);
      }
      sessionStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    clearAuthTokens();
  };

  const value = {
    user,
    isLoading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
