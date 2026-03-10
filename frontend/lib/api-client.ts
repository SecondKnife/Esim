import axios from "axios";
// API client for frontend to communicate with backend server

// Auto-convert HTTP to HTTPS if site is running on HTTPS (fix Mixed Content)
const getApiBaseUrl = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // If site is on HTTPS and API URL is HTTP, try to convert to HTTPS
  if (typeof window !== "undefined" && window.location.protocol === "https:") {
    if (apiUrl.startsWith("http://")) {
      // Replace http:// with https://
      return apiUrl.replace("http://", "https://");
    }
  }

  return apiUrl;
};

export const API_BASE_URL = getApiBaseUrl();

// Configure axios defaults
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true;

// Helper function to make API requests
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include", // Include cookies for authentication
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    return apiRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  signup: async (name: string, email: string, password: string) => {
    return apiRequest("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  },

  logout: async () => {
    return apiRequest("/api/auth/logout", {
      method: "POST",
    });
  },

  getCurrentUser: async () => {
    return apiRequest("/api/auth/me");
  },
};

// Product API
export const productAPI = {
  getAll: async () => {
    return apiRequest("/api/product");
  },

  getById: async (id: string) => {
    return apiRequest(`/api/product/${id}`);
  },

  getByCategory: async (categoryId: string) => {
    return apiRequest(`/api/product/category/${categoryId}`);
  },

  create: async (data: any) => {
    return apiRequest("/api/product", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: any) => {
    return apiRequest(`/api/product/edit/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/api/product/${id}`, {
      method: "DELETE",
    });
  },
};

// Category API
export const categoryAPI = {
  getAll: async () => {
    return apiRequest("/api/categories");
  },

  create: async (data: any) => {
    return apiRequest("/api/categories", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: any) => {
    return apiRequest(`/api/categories/edit/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
};

// Billboard API
export const billboardAPI = {
  getAll: async () => {
    return apiRequest("/api/billboards");
  },

  getById: async (id: string) => {
    return apiRequest(`/api/billboards/edit/${id}`);
  },

  create: async (data: any) => {
    return apiRequest("/api/billboards", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: any) => {
    return apiRequest(`/api/billboards/edit/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/api/billboards/${id}`, {
      method: "DELETE",
    });
  },
};

// Order API
export const orderAPI = {
  getAll: async () => {
    return apiRequest("/api/orders");
  },

  getById: async (orderId: string) => {
    return apiRequest(`/api/orders/${orderId}`);
  },
};

// Checkout API
export const checkoutAPI = {
  create: async (data: any) => {
    return apiRequest("/api/checkout", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};

// Upload API
export const uploadAPI = {
  upload: async (files: File[], folder: string = "products") => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("folder", folder);

    const response = await fetch(`${API_BASE_URL}/api/upload`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Unknown error" }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },
};

// Size API
export const sizeAPI = {
  getAll: async () => {
    return apiRequest("/api/sizes");
  },

  getByProduct: async (productId: string) => {
    return apiRequest(`/api/sizes/product/${productId}`);
  },

  getByCategoryId: async (categoryId: string) => {
    return apiRequest(`/api/sizes/${categoryId}`);
  },

  create: async (name: string) => {
    return apiRequest("/api/sizes", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
  },

  update: async (id: string, name: string) => {
    return apiRequest(`/api/sizes/${id}`, {
      method: "PUT",
      body: JSON.stringify({ name }),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/api/sizes/${id}`, {
      method: "DELETE",
    });
  },
};

// Graph API
export const graphAPI = {
  getRevenue: async () => {
    return apiRequest("/api/graph");
  },
};

// User API (admin only)
export const userAPI = {
  getAll: async () => {
    return apiRequest("/api/users");
  },

  getById: async (id: string) => {
    return apiRequest(`/api/users/${id}`);
  },
};

// Clerk API (admin only)
export const clerkAPI = {
  createUser: async (data: any) => {
    return apiRequest("/api/clerk/users", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getAllUsers: async () => {
    return apiRequest("/api/clerk/users");
  },

  getUserById: async (id: string) => {
    return apiRequest(`/api/clerk/users/${id}`);
  },
};
