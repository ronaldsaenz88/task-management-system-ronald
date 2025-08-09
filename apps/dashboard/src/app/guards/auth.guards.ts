import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('jwt');
    if (token) {
      // Optionally: validate token (expiry, etc.)
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}