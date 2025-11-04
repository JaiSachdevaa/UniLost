const API_BASE_URL = 'http://localhost:5000/api';

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// API Service
export const api = {
  // ========== Auth Endpoints ==========
  register: async (data) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  login: async (data) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  getCurrentUser: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    return response.json();
  },

  // ========== Items Endpoints ==========
  getItems: async (speciality = '') => {
    const url = speciality 
      ? `${API_BASE_URL}/items?speciality=${encodeURIComponent(speciality)}`
      : `${API_BASE_URL}/items`;
    const response = await fetch(url);
    return response.json();
  },

  getItem: async (id) => {
    const response = await fetch(`${API_BASE_URL}/items/${id}`);
    return response.json();
  },

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

  getMyAppointments: async () => {
    const response = await fetch(`${API_BASE_URL}/appointments/my-appointments`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    return response.json();
  },

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
  getUserProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    return response.json();
  },

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