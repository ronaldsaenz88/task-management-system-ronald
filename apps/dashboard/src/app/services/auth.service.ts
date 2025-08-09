import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseURL = 'http://localhost:3001';
  private apiLoginUrl = `${this.baseURL}/api/auth/login`;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<{ access_token: string }> {
    return this.http.post<{ access_token: string }>(this.apiLoginUrl, { email, password }).pipe(
      tap(res => {
        // Store the JWT token for future requests
        localStorage.setItem('jwt', res.access_token);
      })
    );
  }

  logout() {
    localStorage.removeItem('jwt');
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }
}