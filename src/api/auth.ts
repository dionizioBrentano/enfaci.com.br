import { apiClient, isMfaRequired, getErrorMessage } from './client';
import type {
  LoginCredentials,
  RegisterCredentials,
  User,
  AuthResponse,
  MfaSetupResponse,
  UpdateProfileData,
} from '../types/auth';

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<AuthResponse>('/api/v1/auth/login', {
      identifier: credentials.identifier,
      password: credentials.password,
    });
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
      ...(credentials.cpf ? { cpf: credentials.cpf } : {}),
      ...(credentials.phone ? { phone: credentials.phone } : {}),
    });

    return await login({
      identifier: credentials.email,
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

export async function setupMfa(): Promise<MfaSetupResponse> {
  try {
    const response = await apiClient.post<MfaSetupResponse>('/api/v1/auth/mfa/setup');
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function verifyMfa(totpCode: string): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<AuthResponse>('/api/v1/auth/mfa/verify', {
      totp_code: totpCode,
    });
    const data = response.data;
    if (data.access_token) {
      localStorage.setItem('auth_token', data.access_token);
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function updateProfile(data: UpdateProfileData): Promise<User> {
  try {
    const response = await apiClient.patch<{ message?: string; user?: User } | User>(
      '/api/v1/auth/profile',
      data
    );
    if ('user' in response.data && response.data.user) {
      return response.data.user;
    }
    return response.data as User;
  } catch (error) {
    throw error;
  }
}

export function hasOnlyProfileRead(abilities?: string[]): boolean {
  if (!abilities || abilities.length === 0) {
    return true;
  }
  return abilities.length === 1 && abilities[0] === 'profile:read';
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

export { isMfaRequired, getErrorMessage };

