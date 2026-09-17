import { apiClient } from './client';
import type { LoginCredentials, RegisterCredentials, User, AuthResponse } from '../types/auth';

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<AuthResponse>('/api/v1/auth/login', credentials);
    const data = response.data;
    if (data.access_token) {
      localStorage.setItem('auth_token', data.access_token);
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function register(credentials: RegisterCredentials): Promise<AuthResponse> {
  try {
    await apiClient.post('/api/v1/auth/register', {
      name: credentials.name,
      email: credentials.email,
      password: credentials.password,
      password_confirmation: credentials.password_confirmation,
      user_type: 'professional',
    });

    return await login({
      email: credentials.email,
      password: credentials.password,
    });
  } catch (error) {
    throw error;
  }
}

export async function getUser(): Promise<User> {
  try {
    const response = await apiClient.get<User | { data: User }>('/api/v1/user');
    if ('data' in response.data && response.data.data) {
      return response.data.data;
    }
    return response.data as User;
  } catch (error) {
    throw error;
  }
}

export async function logout(): Promise<void> {
  try {
    await apiClient.post('/api/v1/auth/logout');
  } finally {
    localStorage.removeItem('auth_token');
  }
}

export function getStoredToken(): string | null {
  return localStorage.getItem('auth_token');
}

export function isAuthenticated(): boolean {
  return Boolean(getStoredToken());
}
