import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  // Constructor using inject (Angular 16+)
  private authService = inject(AuthService);
  private router = inject(Router);

  logout() {
    this.authService.logout(); // just call the method
    this.router.navigate(['/login']);
  }
}