// ---------------------------------------------------------------------------
// Auth domain types
// ---------------------------------------------------------------------------

export type LoginCredentials = {
  usuario: string;
  clave: string;
};

export type UserBranch = {
  id: number;
  sucursal: string;
  sigla: string;
  nombre_comercial: string;
  rol: string;
};

export type AuthUser = {
  id: number;
  name: string;
  full_name: string;
  email: string;
  sucursales: UserBranch[];
};

export type LoginResponseData = {
  token: string;
  token_type: string;
  expires_at: string;
  refresh_token: string;
  rt_expires_at: string;
  name: string;
  full_name: string;
  email: string;
  id: number;
  sucursales: UserBranch[];
};

export type LoginResponse = {
  status: string;
  code: number;
  message: string;
  resultado: {
    status: string;
    code: number;
    message: string;
    data: LoginResponseData;
  };
};

export type RefreshResponse = {
  token: string;
  token_type: string;
  expires_at: string;
  refresh_token: string;
  rt_expires_at: string;
};

export type AuthState = 'loading' | 'unauthenticated' | 'needs_branch' | 'authenticated';
