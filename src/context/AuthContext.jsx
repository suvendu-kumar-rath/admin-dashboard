import { createContext, useContext, useState } from "react";
import { loginUser, setAuthToken, clearAuthTokens } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
