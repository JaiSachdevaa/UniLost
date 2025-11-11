const API_BASE_URL = 'http://localhost:5000/api';

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// API Service
export const api = {
  // ========== Auth Endpoints ==========
  
  // Send OTP to email
  sendOTP: async (data) => {
    const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // Verify OTP and register user
  verifyOTPAndRegister: async (data) => {
    const response = await fetch(`${API_BASE_URL}/auth/verify-otp-register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // Old register (kept for backward compatibility, but not used anymore)
  register: async (data) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // Login user
  login: async (data) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // Get current logged-in user
  getCurrentUser: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    return response.json();
  },

  // ========== Items Endpoints ==========
  
  // Get all items with optional category filter
  getItems: async (speciality = '') => {
    const url = speciality 
      ? `${API_BASE_URL}/items?speciality=${encodeURIComponent(speciality)}`
      : `${API_BASE_URL}/items`;
    const response = await fetch(url);
    return response.json();
  },

  // Get single item by ID
  getItem: async (id) => {
    const response = await fetch(`${API_BASE_URL}/items/${id}`);
    return response.json();
  },

  // Create new item (admin/staff use)
  createItem: async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key]) formData.append(key, data[key]);
    });

    const response = await fetch(`${API_BASE_URL}/items`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getToken()}`
      },
      body: formData
    });
    return response.json();
  },

  // ========== Appointments Endpoints ==========
  
  // Book appointment to claim an item
  bookAppointment: async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key]) formData.append(key, data[key]);
    });

    const response = await fetch(`${API_BASE_URL}/appointments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getToken()}`
      },
      body: formData
    });
    return response.json();
  },

  // Get current user's appointments
  getMyAppointments: async () => {
    const response = await fetch(`${API_BASE_URL}/appointments/my-appointments`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    return response.json();
  },

  // Cancel an appointment
  cancelAppointment: async (id) => {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    return response.json();
  },

  // ========== User Endpoints ==========
  
  // Get user profile
  getUserProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    return response.json();
  },

  // Update user profile
  updateProfile: async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key]) formData.append(key, data[key]);
    });

    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getToken()}`
      },
      body: formData
    });
    return response.json();
  },

  // Change user password
  changePassword: async (data) => {
    const response = await fetch(`${API_BASE_URL}/users/change-password`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // Submit found item report
  submitReport: async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key]) formData.append(key, data[key]);
    });

    const response = await fetch(`${API_BASE_URL}/users/report`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getToken()}`
      },
      body: formData
    });
    return response.json();
  }
};

export default api;