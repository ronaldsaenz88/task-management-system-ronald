import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseURL = 'http://localhost:3001';
  private apiLoginUrl = `${this.baseURL}/api/auth/login`;

  // Constructor using inject (Angular 16+)
  private http = inject(HttpClient);

  // Login method to authenticate user and store JWT token
  login(email: string, password: string): Observable<{ access_token: string }> {
    return this.http.post<{ access_token: string }>(this.apiLoginUrl, { email, password }).pipe(
      tap(res => {
        // Store the JWT token for future requests
        localStorage.setItem('jwt', res.access_token);
      })
    );
  }

  // Logout method to clear the stored JWT token
  logout() {
    localStorage.removeItem('jwt');
  }

  // Method to check if user is authenticated
  getToken(): string | null {
    return localStorage.getItem('jwt');
  }
}