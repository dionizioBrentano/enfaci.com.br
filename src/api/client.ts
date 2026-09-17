import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const TENANT_ID = import.meta.env.VITE_TENANT_ID || '';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(TENANT_ID ? { 'X-Tenant-ID': TENANT_ID } : {}),
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.response?.data?.errors) {
      const errors = error.response.data.errors as Record<string, string[]>;
      const firstKey = Object.keys(errors)[0];
      if (firstKey && errors[firstKey]?.length) {
        return errors[firstKey][0];
      }
    }
    return error.message || 'Erro ao conectar à API.';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Erro inesperado.';
}

export function isMfaRequired(error: unknown): boolean {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { code?: string; mfa_required?: boolean; message?: string } | undefined;
    if (error.response?.status === 403) {
      if (data?.code === 'mfa_required' || data?.mfa_required === true) {
        return true;
      }
      if (typeof data?.message === 'string') {
        const lower = data.message.toLowerCase();
        if (lower.includes('mfa') || lower.includes('dois fatores')) {
          return true;
        }
      }
    }
  }
  return false;
}


