const API_BASE_URL = import.meta.env.VITE_API_URL || "https://ampercent.in/api";

/**
 * Login API call
 * 
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<{success, token, user}>} Login response with token and user data
 */
export const loginUser = async (email, password) => {
  try {
    console.log(`🔐 Attempting login with email: ${email}`);
    console.log(`🌐 API URL: ${API_BASE_URL}`);
    
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const contentType = response.headers.get("content-type");
    const isJson = contentType && contentType.includes("application/json");

    if (!response.ok) {
      let errorMessage = "Login failed";
      
      if (isJson) {
        try {
          const error = await response.json();
          errorMessage = error.message || error.error || errorMessage;
        } catch {
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
      } else {
        const text = await response.text();
        console.error("🚫 Server returned non-JSON response:", text.substring(0, 500));
        errorMessage = `Server error: ${response.status} ${response.statusText}`;
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log("✅ Login successful");
    
    // Store token from response
    if (data.token) {
      setAuthToken(data.token);
    }
    
    return data; // { success, token, user, ... }
  } catch (error) {
    console.error("❌ Login error details:", error);
    throw error;
  }
};

/**
 * Set authorization header for authenticated requests
 * @param {string} token - Access token
 */
export const setAuthToken = (token) => {
  if (token) {
    sessionStorage.setItem("accessToken", token);
  } else {
    sessionStorage.removeItem("accessToken");
  }
};

/**
 * Get authorization header for authenticated requests
 */
export const getAuthToken = () => {
  return sessionStorage.getItem("accessToken");
};

/**
 * Clear authentication tokens
 */
export const clearAuthTokens = () => {
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");
  sessionStorage.removeItem("user");
};

/**
 * Authenticated API request wrapper
 * @param {string} endpoint - API endpoint
 * @param {object} options - Fetch options
 */
export const authenticatedFetch = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
};
