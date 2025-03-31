import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService {
  router = inject(Router);

  constructor() {}

  /**
   * This function checks if a user is authenticated by checking if a token is stored in the local storage. It is needed to redirect the user to the login page in case he is not signed in.
   * @returns
   */
  canActivate(): boolean {
    if (this.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate(['/login']);
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
