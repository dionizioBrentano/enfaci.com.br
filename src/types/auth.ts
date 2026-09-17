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
  mfa_enabled?: boolean;
  cpf?: string;
  phone?: string;
  user_type?: string;
  identities?: UserIdentity[];
  created_at?: string;
  updated_at?: string;
}

export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  user_type?: string;
  cpf?: string;
  phone?: string;
}

export interface AuthResponse {
  access_token?: string;
  token_type?: string;
  user?: User;
  message?: string;
  mfa_required?: boolean;
  abilities?: string[];
}

export interface MfaSetupResponse {
  secret: string;
  qr_code_svg: string;
}

export interface MfaVerifyPayload {
  totp_code: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  password?: string;
  cpf?: string;
  phone?: string;
}

export interface ApiErrorResponse {
  message?: string;
  code?: string;
  errors?: Record<string, string[]>;
}

