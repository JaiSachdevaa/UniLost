// Reads VITE_API_URL from .env in production (set on Vercel).
// Falls back to localhost for local development.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

export const api = {

  // ── Auth ────────────────────────────────────────────────────────────────────

  sendOTP: async (data) => {
    const res = await fetch(`${API_BASE_URL}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  verifyOTPAndRegister: async (data) => {
    const res = await fetch(`${API_BASE_URL}/auth/verify-otp-register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  forgotPassword: async (data) => {
    const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  resetPassword: async (data) => {
    const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  login: async (data) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  adminLogin: async (data) => {
    const res = await fetch(`${API_BASE_URL}/auth/admin-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  getCurrentUser: async () => {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return res.json();
  },

  deleteAccount: async (confirmText) => {
    const res = await fetch(`${API_BASE_URL}/auth/delete-account`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ confirmText }),
    });
    return res.json();
  },

  // ── Admin ───────────────────────────────────────────────────────────────────

  getPendingReports: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/reports/pending`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return res.json();
  },

  getAllReports: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/reports/all`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return res.json();
  },

  approveReport: async (reportId) => {
    const res = await fetch(`${API_BASE_URL}/admin/reports/${reportId}/approve`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return res.json();
  },

  rejectReport: async (reportId) => {
    const res = await fetch(`${API_BASE_URL}/admin/reports/${reportId}/reject`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return res.json();
  },

  deleteReport: async (reportId) => {
    const res = await fetch(`${API_BASE_URL}/admin/reports/${reportId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return res.json();
  },

  getAdminItems: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/items`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return res.json();
  },

  deleteAdminItem: async (itemId) => {
    const res = await fetch(`${API_BASE_URL}/admin/items/${itemId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return res.json();
  },

  getAdminStats: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return res.json();
  },

  // ── Items ───────────────────────────────────────────────────────────────────

  getItems: async (speciality = '') => {
    const url = speciality
      ? `${API_BASE_URL}/items?speciality=${encodeURIComponent(speciality)}`
      : `${API_BASE_URL}/items`;
    const res = await fetch(url);
    return res.json();
  },

  getItem: async (id) => {
    const res = await fetch(`${API_BASE_URL}/items/${id}`);
    return res.json();
  },

  // ── Appointments ────────────────────────────────────────────────────────────

  bookAppointment: async (data) => {
    const formData = new FormData();
    formData.append('item_id',   data.item_id);
    formData.append('item_type', data.item_type  || '');
    formData.append('location',  data.location   || '');
    formData.append('time_lost', data.time_lost  || '');
    if (data.proofFile) formData.append('proofFile', data.proofFile);

    const res = await fetch(`${API_BASE_URL}/appointments`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData,
    });
    return res.json();
  },

  getMyAppointments: async () => {
    const res = await fetch(`${API_BASE_URL}/appointments/my-appointments`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return res.json();
  },

  deleteAppointment: async (id) => {
    const res = await fetch(`${API_BASE_URL}/appointments/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return res.json();
  },

  deleteAppointmentAdmin: async (id) => {
    const res = await fetch(`${API_BASE_URL}/appointments/admin/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return res.json();
  },

  // ── User ────────────────────────────────────────────────────────────────────

  getUserProfile: async () => {
    const res = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return res.json();
  },

  updateProfile: async (data) => {
    const res = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  updateProfileImage: async (formData) => {
    const res = await fetch(`${API_BASE_URL}/users/profile/image`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData,
    });
    return res.json();
  },

  changePassword: async (data) => {
    const res = await fetch(`${API_BASE_URL}/users/change-password`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  submitReport: async (data) => {
    const formData = new FormData();
    formData.append('item_type',   data.item_type);
    formData.append('location',    data.location);
    formData.append('time_found',  data.time_found);
    formData.append('description', data.description);
    if (data.media) formData.append('media', data.media);

    const res = await fetch(`${API_BASE_URL}/users/report`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData,
    });
    return res.json();
  },

  getUserReports: async () => {
    const res = await fetch(`${API_BASE_URL}/users/reports`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return res.json();
  },
};

export default api;