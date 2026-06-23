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

/**
 * Get all editors
 * @returns {Promise<{success, data: {editors, total, page, pages}}>} Response with editors list
 */
export const getEditors = async () => {
  try {
    console.log('📋 Fetching editors...');
    
    const data = await authenticatedFetch('/editors', {
      method: 'GET',
    });

    console.log('✅ Editors fetched successfully');
    return data; // { success, data: { editors, total, page, pages }, ... }
  } catch (error) {
    console.error('❌ Error fetching editors:', error);
    throw error;
  }
};

/**
 * Add a new editor
 * @param {object} editorData - Editor data
 * @param {string} editorData.name - Editor name
 * @param {string} editorData.email - Editor email
 * @param {string} editorData.phone - Editor phone
 * @param {boolean} editorData.isActive - Is editor active
 * @returns {Promise<{success, editor}>} Response with created editor
 */
export const addEditor = async (editorData) => {
  try {
    console.log(`📝 Adding editor: ${editorData.name}`);
    
    const data = await authenticatedFetch('/editors', {
      method: 'POST',
      body: JSON.stringify(editorData),
    });

    console.log('✅ Editor added successfully');
    return data; // { success, editor, ... }
  } catch (error) {
    console.error('❌ Error adding editor:', error);
    throw error;
  }
};

/**
 * Update an editor by ID
 * @param {number} id - Editor ID
 * @param {object} editorData - Editor data to update
 * @param {string} editorData.name - Editor name
 * @param {string} editorData.email - Editor email
 * @param {string} editorData.phone - Editor phone
 * @param {boolean} editorData.isActive - Is editor active
 * @returns {Promise<{success, editor}>} Response with updated editor
 */
export const updateEditor = async (id, editorData) => {
  try {
    console.log(`✏️ Updating editor ID: ${id}`);
    
    const data = await authenticatedFetch(`/editors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(editorData),
    });

    console.log('✅ Editor updated successfully');
    return data; // { success, editor, ... }
  } catch (error) {
    console.error('❌ Error updating editor:', error);
    throw error;
  }
};

/**
 * Delete an editor by ID
 * @param {number} id - Editor ID
 * @returns {Promise<{success}>} Response confirming deletion
 */
export const deleteEditor = async (id) => {
  try {
    console.log(`🗑️ Deleting editor ID: ${id}`);
    
    const data = await authenticatedFetch(`/editors/${id}`, {
      method: 'DELETE',
    });

    console.log('✅ Editor deleted successfully');
    return data; // { success, ... }
  } catch (error) {
    console.error('❌ Error deleting editor:', error);
    throw error;
  }
};
