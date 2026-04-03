import { apiFetch } from './apiClient';
import { Role } from '../types';

export interface UserDto {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export const userService = {
  async getAllUsers(): Promise<UserDto[]> {
    return apiFetch<UserDto[]>('/users');
  },

  async updateUserRole(userId: number, role: string): Promise<UserDto> {
    return apiFetch<UserDto>(`/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role: role.toUpperCase() })
    });
  }
};
