import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthRedirectService {
  router = inject(Router);

  constructor() {}

  /**
   * This function checks if a user is not authenticated by checking if a token is stored in the local storage. It is needed to redirect the user to the dashboard in case he is signed in.
   * @returns boolean
   */
  canActivate(): boolean {
    if (!this.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate(['/dashboard']);
      return false;
    }
  }

  /**
   * This function gets the token from the local storage.
   * @returns token as string
   */
  isAuthenticated() {
    return localStorage.getItem('token');
  }
}
