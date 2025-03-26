import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Location } from '@angular/common';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  router = inject(Router);
  location = inject(Location);
  authenticationService = inject(AuthenticationService);

  route: string = '/login';

  @Output() redirectLogin = new EventEmitter();
  @Output() redirectDashboard = new EventEmitter();

  /**
   * This function gets the current url on initialization of the component.
   */
  ngOnInit(): void {
    this.route = this.router.url;
  }

  /**
   * This function redirects the user to the page where he comes from. It is needed for the privacy policy and imprint pages.
   */
  goBack(): void {
    this.location.back();
  }

  /**
   * This function calls the logout function from the authentication service. If the function returns true the user is redirected.
   */
  async logout() {
    await this.authenticationService.logout();
    this.sendRedirectLogin();
  }

  /**
   * This function emits an event so the redirect to login function in other components can be triggered. This way is needed because there are different animations taking place.
   */
  async sendRedirectLogin() {
    this.redirectLogin.emit();
  }

  /**
   * This function emits an event so the redirect to dashboard function in other components can be triggered. This way is needed because there are different animations taking place.
   */
  sendRedirectDashboard() {
    this.redirectDashboard.emit();
  }
}
