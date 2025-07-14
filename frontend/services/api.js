// services/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL;

class ApiService {
  constructor() {
    this.token = localStorage.getItem("token");
  }

  // Set token setelah login
  setToken(token) {
    this.token = token;
    localStorage.setItem("token", token);
  }

  // Remove token saat logout
  removeToken() {
    this.token = null;
    localStorage.removeItem("token");
  }

  // Helper untuk membuat request
  async makeRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Check if body is FormData
    const isFormData = options.body instanceof FormData;
    
    const config = {
      headers: {
        // Only set Content-Type for non-FormData requests
        ...(!isFormData && { "Content-Type": "application/json" }),
        "Accept": "application/json",
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    // Debug logging
    console.log('🔍 API Request:', {
      url,
      method: options.method || 'GET',
      hasToken: !!this.token,
      isFormData,
      token: this.token ? `${this.token.substring(0, 10)}...` : 'none',
      headers: config.headers
    });

    try {
      const response = await fetch(url, config);
      
      // Log response status
      console.log('📡 API Response:', {
        url,
        status: response.status,
        ok: response.ok,
        contentType: response.headers.get('content-type')
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('❌ Non-JSON Response:', text.substring(0, 200));
        throw new Error(`Server returned non-JSON response: ${response.status}`);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      return data;
    } catch (error) {
      console.error('❌ API Error:', {
        url,
        error: error.message
      });
      throw error;
    }
  }

  // 1. Login API
  async login(username, password) {
    // Don't initialize CSRF for login - it's token-based auth
    return this.makeRequest("/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  }

  // 2. Get All Divisions
  async getDivisions(name = "") {
    const params = new URLSearchParams();
    if (name) params.append("name", name);

    return this.makeRequest(`/divisions?${params}`);
  }

  // Create Division
  async createDivision(divisionData) {
    return this.makeRequest("/divisions", {
      method: "POST",
      body: JSON.stringify(divisionData),
    });
  }

  // Update Division
  async updateDivision(id, divisionData) {
    return this.makeRequest(`/divisions/${id}`, {
      method: "PUT",
      body: JSON.stringify(divisionData),
    });
  }

  // Delete Division
  async deleteDivision(id) {
    return this.makeRequest(`/divisions/${id}`, {
      method: "DELETE",
    });
  }

  // 3. Get All Employees
  async getEmployees(filters = {}) {
    const params = new URLSearchParams();
    if (filters.name) params.append("name", filters.name);
    if (filters.division_id) params.append("division_id", filters.division_id);
    if (filters.page) params.append("page", filters.page);

    return this.makeRequest(`/employees?${params}`);
  }

  // 4. Create Employee
  async createEmployee(employeeData) {
    const formData = new FormData();
    Object.keys(employeeData).forEach((key) => {
      if (employeeData[key] !== null && employeeData[key] !== undefined) {
        formData.append(key, employeeData[key]);
      }
    });

    return this.makeRequest("/employees", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        // Don't set Content-Type for FormData, browser will set it automatically
      },
      body: formData,
    });
  }

  // 5. Update Employee
  async updateEmployee(id, employeeData) {
    const formData = new FormData();
    Object.keys(employeeData).forEach((key) => {
      if (employeeData[key] !== null && employeeData[key] !== undefined) {
        formData.append(key, employeeData[key]);
      }
    });
    formData.append("_method", "PUT"); // Laravel workaround for file uploads

    return this.makeRequest(`/employees/${id}`, {
      method: "POST", // Using POST with _method for file uploads
      headers: {
        "Accept": "application/json",
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      body: formData,
    });
  }

  // 6. Delete Employee
  async deleteEmployee(id) {
    return this.makeRequest(`/employees/${id}`, {
      method: "DELETE",
    });
  }

  // 7. Logout
  async logout() {
    try {
      await this.makeRequest("/logout", {
        method: "POST",
      });
    } catch (error) {
      console.log("Logout request failed, but clearing local storage anyway");
    } finally {
      // Always clear local storage regardless of API response
      this.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }

  // User Profile APIs
  async getProfile() {
    return this.makeRequest("/profile");
  }

  async updateProfile(profileData) {
    return this.makeRequest("/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  }
}

// Export singleton instance
const apiService = new ApiService();
export default apiService;

// Helper functions for authentication
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Auth API
export const authAPI = {
  login: async (username, password) => {
    try {
      const response = await apiService.login(username, password);
      if (response && response.status === 'success') {
        apiService.setToken(response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.admin));
        return response;
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      throw error;
    }
  },
  logout: () => apiService.logout(),
};

// Employees API
export const employeesAPI = {
  getAll: (filters = {}) => apiService.getEmployees(filters),
  create: (data) => apiService.createEmployee(data),
  update: (id, data) => apiService.updateEmployee(id, data),
  delete: (id) => apiService.deleteEmployee(id),
};

// Divisions API
export const divisionsAPI = {
  getAll: (name = "") => apiService.getDivisions(name),
  create: (data) => apiService.createDivision(data),
  update: (id, data) => apiService.updateDivision(id, data),
  delete: (id) => apiService.deleteDivision(id),
};

// User API
export const userAPI = {
  getProfile: () => apiService.getProfile(),
  updateProfile: (data) => apiService.updateProfile(data),
};
