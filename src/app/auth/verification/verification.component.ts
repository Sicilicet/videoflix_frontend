import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { AuthenticationService } from '../../services/authentication.service';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'app-verification',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './verification.component.html',
  styleUrl: './verification.component.scss',
  animations: [
    trigger('hideShowTrigger', [
      state('shown', style({ transform: 'translateY(0%)', opacity: 1 })),
      state(
        'hidden-left',
        style({ transform: 'translateX(-1000%)', opacity: 0.1 })
      ),
      transition('hidden-left => shown', [animate('0.7s ease-out')], {}),
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
export class VerificationComponent {
  router = inject(Router);
  route = inject(ActivatedRoute);
  authenticationService = inject(AuthenticationService);

  state = 'hidden-left';
  backgroundState = 'background-fade-out';

  /**
   * This function checks in initializattion of the component if the token transmitted in the url is valid. If so, a success message is shown. The case if the token is not valid is handled in the autentication service.
   */
  async ngOnInit(): Promise<void> {
    const token = this.route.snapshot.paramMap.get('token');

    if (token) {
      const isVerified = await this.authenticationService.verificateEmail(
        token
      );
      if (isVerified) {
        this.showSuccess();
      }
    }
  }

  /**
   * This function redirects the user to the target.
   * @param target string
   */
  redirect(target: string) {
    this.state = 'hidden-left';
    this.backgroundState = 'background-fade-out';
    setTimeout(() => {
      this.router.navigate([`${target}`]);
    }, 400);
  }

  /**
   * This function triggers the animation to show the user the success message.
   */
  showSuccess() {
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
