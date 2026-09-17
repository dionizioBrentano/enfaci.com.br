export interface UserIdentity {
  id?: string | number;
  provider?: string;
  provider_id?: string;
  [key: string]: unknown;
}

export interface User {
  id: string | number;
  name: string;
  email: string;
  identities?: UserIdentity[];
  created_at?: string;
  updated_at?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  user_type?: string;
}

export interface AuthResponse {
  access_token?: string;
  token_type?: string;
  user?: User;
  message?: string;
}

export interface ApiErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
}
