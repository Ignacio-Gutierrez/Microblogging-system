import { inject, Injectable, InjectionToken } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import type { JwtToken, LoginRequest, RegisterRequest } from '../models/auth.model';

export const TOKEN_KEY = new InjectionToken<string>('Authentication token key', {
  factory: () => 'jhi-authenticationToken',
});

export const USERNAME_KEY = new InjectionToken<string>('Username storage key', {
  factory: () => 'jhi-username',
});

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly document = inject(DOCUMENT);
  private readonly tokenKey = inject(TOKEN_KEY);
  private readonly usernameKey = inject(USERNAME_KEY);
  private storage!: Storage;

  constructor() {
    this.storage = this.document.defaultView?.localStorage ?? {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      key: () => null,
      get length() { return 0; },
    } as unknown as Storage;
  }

  login(credentials: LoginRequest): Observable<string> {
    return this.http
      .post<JwtToken>('/api/authenticate', credentials)
      .pipe(map(response => response.id_token));
  }

  register(registration: RegisterRequest): Observable<void> {
    return this.http.post<void>('/api/register', registration);
  }

  activateAccount(key: string): Observable<void> {
    return this.http.get<void>('/api/activate', {
      params: { key },
    });
  }

  requestPasswordReset(email: string): Observable<void> {
    return this.http.post<void>('/api/account/reset-password/init', email, {
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  finishPasswordReset(key: string, newPassword: string): Observable<void> {
    return this.http.post<void>('/api/account/reset-password/finish', { key, newPassword });
  }

  storeToken(token: string, username?: string): void {
    this.storage.setItem(this.tokenKey, token);
    if (username) {
      this.storage.setItem(this.usernameKey, username);
    }
  }

  getToken(): string | null {
    return this.storage.getItem(this.tokenKey);
  }

  getUsername(): string {
    return this.storage.getItem(this.usernameKey) ?? '';
  }

  logout(): void {
    this.storage.removeItem(this.tokenKey);
    this.storage.removeItem(this.usernameKey);
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  getAuthorizationHeader(): string {
    const token = this.getToken();
    return token ? `Bearer ${token}` : '';
  }
}
