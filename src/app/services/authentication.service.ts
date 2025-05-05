import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { lastValueFrom } from 'rxjs';
import { LoginResponse } from '../interfaces/login-response';
import { getAuthHeaders } from '../utils/functions';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from './toast.service';
import { ToastCTA } from '../interfaces/toast-cta';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  http = inject(HttpClient);
  toastService = inject(ToastService);
  route = inject(ActivatedRoute);

  constructor() {}

  /**
   * This function creates a new user in the back end.
   * @param email string
   * @param password string
   * @returns boolean
   */
  async signUp(email: string, password: string): Promise<boolean> {
    const url = environment.baseUrl + '/auth/registration/';
    const body = { email, password };

    try {
      await lastValueFrom(this.http.post(url, body));
      this.toastService.showToast('Account created. Please verify your email.');
      return true;
    } catch (error) {
      this.toastService.showToast(
        'An error occured. Please contact our support.'
      );
      return false;
    }
  }

  /**
   * This function verificates the email address.
   * @param token string
   * @returns boolean
   */
  async verificateEmail(token: string): Promise<boolean> {
    const url = environment.baseUrl + '/auth/verification/';
    const body = { token };

    try {
      await lastValueFrom(this.http.post(url, body));
      return true;
    } catch (error) {
      const email = this.extractEmailFromToken(token);
      const toastData: ToastCTA = this.createToastDataVerificateEmail(email);
      this.toastService.showToastCTA(toastData);
      return false;
    }
  }

  /**
   * This function extracts the email address from the token.
   * @param token string
   * @returns email address as string
   */
  extractEmailFromToken(token: string): string {
    const parts = token.split(':');
    const email = parts[0];
    return email;
  }

  /**
   * This function creates the data for a CTA toast (call to action).
   * @param token string
   * @returns object of type ToastCTA
   */
  createToastDataVerificateEmail(token: string): ToastCTA {
    const toastContent: ToastCTA = {
      message: 'Sorry, something went wrong.',
      textButton: 'Resend email',
      action: () => this.resendVerificationEmail(token),
    };
    return toastContent;
  }

  /**
   * This function resends the verification email in case the user needs it again.
   * @param identifier string as email address
   * @returns boolean
   */
  async resendVerificationEmail(email: string): Promise<boolean> {
    const url = environment.baseUrl + '/auth/resend_verifiction/';
    const body = { email };

    try {
      await lastValueFrom(this.http.post(url, body));
      this.toastService.showToast('An email has been sent to this address.');
      return true;
    } catch (error) {
      this.toastService.showToast('An email has been sent to this address.');
      return false;
    }
  }

  /**
   * This function sends an email in case the user forgot her password.
   * @param email string
   * @returns boolean
   */
  async sendResetPasswordEmail(email: string): Promise<boolean> {
    const url = environment.baseUrl + '/auth/forgot_password/';
    const body = { email };

    try {
      await lastValueFrom(this.http.post(url, body));
      this.toastService.showToast('An email has been sent to this address.');
      return true;
    } catch (error) {
      this.toastService.showToast('An email has been sent to this address.');
      return false;
    }
  }

  /**
   * This function resets the password.
   * @param password string
   * @param token string
   * @returns boolean
   */
  async resetPassword(password: string, token: string): Promise<boolean> {
    const url = environment.baseUrl + '/auth/reset_password/';
    const body = { password, token };

    try {
      await lastValueFrom(this.http.post(url, body));
      this.toastService.showToast('Password reset.');
      return true;
    } catch (error) {
      this.toastService.showToast(
        'An error occured. Please contact our support.'
      );
      return false;
    }
  }

  /**
   * This function logs the user in. The returned token is stored in the local storage.
   * @param email string
   * @param password string
   * @returns boolean
   */
  async login(email: string, password: string): Promise<boolean> {
    const url = environment.baseUrl + '/auth/login/';
    const body = { username: email, password };
    try {
      const response = await lastValueFrom(
        this.http.post<LoginResponse>(url, body)
      );
      const token = response.token;
      localStorage.setItem('token', token);
      return true;
    } catch (error) {
      const toastData: ToastCTA = this.createToastDataLogin(email);
      this.toastService.showToastCTA(toastData);
      return false;
    }
  }

  /**
   * This function creates the data for the CTA toast (call to action). It contains a button where the user can resend the verification email.
   * @param email string
   * @returns object of type ToastCTA
   */
  createToastDataLogin(email: string): ToastCTA {
    return {
      message: 'Something went wrong. Already have an account?',
      textButton: 'Send verification email',
      action: () => this.resendVerificationEmail(email),
    };
  }

  /**
   * This function logs out the user. It removes the token from the local storage first because even if the logout fails in the background a new token is created on a new login. But without a token in the front end the user cannot login any longer.
   * @returns boolean
   */
  async logout(): Promise<boolean> {
    const url = environment.baseUrl + '/auth/logout/';
    const body = {};
    const headers = getAuthHeaders();
    localStorage.removeItem('token');
    try {
      await lastValueFrom(this.http.post(url, body, { headers }));
      return true;
    } catch (error) {
      return false;
    }
  }
}
