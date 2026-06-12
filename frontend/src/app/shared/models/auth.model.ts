export interface LoginRequest {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface JwtToken {
  id_token: string;
}

export interface RegisterRequest {
  login: string;
  email: string;
  password: string;
  langKey: string;
  activated?: boolean;
}
