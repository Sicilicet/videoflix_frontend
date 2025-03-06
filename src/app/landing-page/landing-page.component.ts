import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { LandingPageService } from '../services/landing-page.service';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
  animations: [
    trigger('hideShowTrigger', [
      state('shown', style({ transform: 'translateY(0%)', opacity: 1 })),
      state(
        'hidden-bottom',
        style({ transform: 'translateY(1000%)', opacity: 0.1 })
      ),
      state(
        'hidden-left',
        style({ transform: 'translateX(-1000%)', opacity: 0.1 })
      ),
      transition('hidden-bottom => shown', [animate('0.7s ease-out')], {}),
      transition('shown => hidden-left', [animate('0.4s ease-in')], {}),
    ]),
    trigger('backgroundFadeTrigger', [
      state('background-fade-in', style({ opacity: 1 })),
      state('background-fade-out', style({ opacity: 0 })),
      transition('background-fade-out => background-fade-in', [
        animate('1s ease-in-out'),
      ]),
      transition('background-fade-in => background-fade-out', [
        animate('0.4s ease-out'),
      ]),
    ]),
  ],
})
export class LandingPageComponent {
  router = inject(Router);
  landingPageService = inject(LandingPageService);

  state = 'hidden-bottom';
  backgroundState = 'background-fade-out';
  inputData = '';

  /**
   * This function triggers the animation of the landing page and redirects to the login.
   */
  redirectLogin() {
    this.state = 'hidden-left';
    this.backgroundState = 'background-fade-out';
    this.landingPageService.setInputData(this.inputData);
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 400);
  }

  /**
   * This function triggers the animation of the landing page after the page has loaded.
   */
  ngAfterViewInit() {
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      this.state = 'shown';
      this.backgroundState = 'background-fade-in';
    }, 200);
    setTimeout(() => {
      document.body.style.overflow = 'auto';
    }, 1000);
  }
}
