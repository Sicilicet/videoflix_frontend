import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginComponent } from './auth/login/login.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { ImprintComponent } from './imprint/imprint.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { VerificationComponent } from './auth/verification/verification.component';
import { DashboardComponent } from './content/dashboard/dashboard.component';
import { HeroComponent } from './content/hero/hero.component';
import { VideoPlayerComponent } from './content/video-player/video-player.component';
import { AuthRedirectService } from './services/guard/auth-redirect.service';
import { AuthGuardService } from './services//guard/auth-guard.service';

export const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthRedirectService],
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
    canActivate: [AuthRedirectService],
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [AuthRedirectService],
  },
  {
    path: 'reset-password',
    component: LoginComponent,
    canActivate: [AuthRedirectService],
  },
  {
    path: 'reset-password/:token',
    component: ResetPasswordComponent,
    canActivate: [AuthRedirectService],
  },
  {
    path: 'verification',
    component: LoginComponent,
    canActivate: [AuthRedirectService],
  },
  {
    path: 'verification/:token',
    component: VerificationComponent,
    canActivate: [AuthRedirectService],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuardService],
  },
  { path: 'hero', component: HeroComponent, canActivate: [AuthGuardService] },
  {
    path: 'video-player',
    component: VideoPlayerComponent,
    canActivate: [AuthGuardService],
  },
  { path: 'imprint', component: ImprintComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
];
