import type { LoginCredentials } from '../types/auth';

const API_BASE = 'http://localhost:';

export const authService = {
  async login(credentials: LoginCredentials) {
    const response = await fetch(`${API_BASE}3000/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    return data;
  },

  async apiCall(url: string, options: RequestInit = {},port : number = 3000) {
    console.log(port)
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE}3000${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (response.status === 401) {
      // Handle token expiration
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw new Error('Session expired, please login again');
    }

    return response;
  }
};