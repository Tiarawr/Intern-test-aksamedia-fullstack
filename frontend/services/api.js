// services/api.js
const API_BASE_URL = "http://localhost:8000/api"; // Sesuaikan dengan URL backend

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
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // 1. Login API
  async login(username, password) {
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
    return this.makeRequest("/logout", {
      method: "POST",
    });
  }
}

// Export singleton instance
export default new ApiService();

// Context untuk state management
import React, { createContext, useContext, useReducer } from "react";

const AppContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem("token"),
  employees: [],
  divisions: [],
  loading: false,
  error: null,
};

function appReducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.admin,
        token: action.payload.token,
        loading: false,
        error: null,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        employees: [],
        divisions: [],
      };
    case "SET_EMPLOYEES":
      return { ...state, employees: action.payload, loading: false };
    case "SET_DIVISIONS":
      return { ...state, divisions: action.payload, loading: false };
    case "ADD_EMPLOYEE":
      return {
        ...state,
        employees: [...state.employees, action.payload],
      };
    case "UPDATE_EMPLOYEE":
      return {
        ...state,
        employees: state.employees.map((emp) =>
          emp.id === action.payload.id ? action.payload : emp
        ),
      };
    case "DELETE_EMPLOYEE":
      return {
        ...state,
        employees: state.employees.filter((emp) => emp.id !== action.payload),
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
