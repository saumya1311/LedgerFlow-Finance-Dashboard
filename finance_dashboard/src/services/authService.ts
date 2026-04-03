import { apiFetch } from './apiClient';
import { User, Role } from '../types';

interface AuthResponse {
  token: string;
  userId: number;
  email: string;
  name: string;
  role: string;
}

function decodeJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export const authService = {
  async login(email: string, password: string): Promise<User> {
    const data = await apiFetch<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    const payload = decodeJwt(data.token);
    const decodedRole = payload?.role || data.role;

    // Map backend role (uppercase) to frontend Role type
    const roleMap: Record<string, Role> = {
      'ADMIN': 'Admin',
      'ANALYST': 'Analyst',
      'VIEWER': 'Viewer'
    };

    const user: User = {
      id: data.userId,
      name: data.name,
      email: data.email,
      role: roleMap[decodedRole] || 'Viewer',
      token: data.token,
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(user));
    }

    return user;
  },

  async register(name: string, email: string, password: string): Promise<User> {
    const data = await apiFetch<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });

    const payload = decodeJwt(data.token);
    const decodedRole = payload?.role || data.role;

    const roleMap: Record<string, Role> = {
      'ADMIN': 'Admin',
      'ANALYST': 'Analyst',
      'VIEWER': 'Viewer'
    };

    const user: User = {
      id: data.userId,
      name: data.name,
      email: data.email,
      role: roleMap[decodedRole] || 'Viewer',
      token: data.token,
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(user));
    }

    return user;
  },

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
};
