import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ErrorToastComponent } from './shared/toasts/error-toast/error-toast.component';
import { ErrorToastCtaComponent } from './shared/toasts/error-toast-cta/error-toast-cta.component';
import { ToastService } from './services/toast.service';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    ErrorToastComponent,
    ErrorToastCtaComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [
    trigger('slideInOut', [
      state('hidden', style({ transform: 'translateX(-100%)' })),
      state('visible', style({ transform: 'translateX(0)' })),
      transition('hidden => visible', [animate('0.3s ease-out')]),
      transition('visible => hidden', [animate('0.3s ease-in')]),
    ]),
  ],
})
export class AppComponent {
  title = 'videoflix';
  toastService = inject(ToastService);
  displayToast = false;
  isVisible = false;
  errorToastState = 'hidden';
  displayToastCTA = false;
  isVisibleCTA = false;
  errorToastStateCTA = 'hidden';

  /**
   * This function initializes the two subscriptions of both toasts.
   */
  ngOnInit(): void {
    this.subscribeToast();
    this.subscribeCTAToast();
  }

  /**
   * This function subscribes to the displayToast variable from the toast service. It is used to determine wether the toast is displayed or not.
   */
  subscribeToast() {
    this.toastService.displayToast.subscribe((displayToast) => {
      this.displayToast = displayToast;
      if (this.displayToast) {
        this.showErrorToast();
      } else {
        this.hideErrorToast();
      }
    });
  }

  /**
   * This function subscribes to the displayToastCTA (call to action) variable from the toast service. It is used to determine wether the toast is displayed or not.
   */
  subscribeCTAToast() {
    this.toastService.displayToastCTA.subscribe((displayToastCTA) => {
      this.displayToastCTA = displayToastCTA;
      if (this.displayToastCTA) {
        this.showErrorToastCTA();
      } else {
        this.hideErrorToastCTA();
      }
    });
  }

  /**
   * This function sets the variable isVisible to true and starts the animation to display it. The timeout is needed so the animation plays correctly.
   */
  showErrorToast() {
    this.isVisible = true;
    setTimeout(() => {
      this.errorToastState = 'visible';
    }, 0);
  }

  /**
   * This function hides the toast by setting the variable isVisible to false. It resets the animation state to hidden.
   */
  hideErrorToast() {
    this.errorToastState = 'hidden';
    this.isVisible = false;
  }

  /**
   * This function sets the variable isVisibleCTA (call to action) to true and starts the animation to display it. The timeout is needed so the animation plays correctly.
   */
  showErrorToastCTA() {
    this.isVisibleCTA = true;
    setTimeout(() => {
      this.errorToastStateCTA = 'visible';
    }, 0);
  }

  /**
   * This function hides the toast by setting the variable isVisibleCTA (call to action) to false. It resets the animation state to hidden.
   */
  hideErrorToastCTA() {
    this.errorToastStateCTA = 'hidden';
    this.isVisibleCTA = false;
  }
}
