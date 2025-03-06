import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  animations: [
    trigger('hideShowTrigger', [
      state('shown', style({ transform: 'translateX(0%)', opacity: 1 })),
      state(
        'hidden-right',
        style({ transform: 'translateX(1000%)', opacity: 0.1 })
      ),
      state(
        'hidden-left',
        style({ transform: 'translateX(-1000%)', opacity: 0.1 })
      ),
      transition('hidden-right => shown', [animate('0.7s ease-out')], {}),
      transition('shown => hidden-right', [animate('0.7s ease-in')], {}),
      transition('shown => hidden-left', [animate('0.7s ease-in')], {}),
    ]),
    trigger('backgroundFadeTrigger', [
      state('background-fade-in', style({ opacity: 1 })),
      state('background-fade-out', style({ opacity: 0 })),
      transition('background-fade-out => background-fade-in', [
        animate('1s ease-in-out'),
      ]),
      transition('background-fade-in => background-fade-out', [
        animate('0.7s ease-out'),
      ]),
    ]),
  ],
})
export class LoginComponent {
  router = inject(Router);

  form: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
    rememberMe: new FormControl(false),
  });
  submitted = false;
  buttonSubmitDisabled = false;
  passwordVisible = false;
  state = 'hidden-right';
  backgroundState = 'background-fade-out';

  constructor(private formBuilder: FormBuilder) {}

  /**
   * This function is a getter function to retrieve all form controls in the current form group.
   */
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  /**
   * This function is a getter function to check if the form is either invalid or untouched (pristine).
   */
  get formEmpty() {
    return this.form.invalid || this.form.pristine;
  }

  /**
   * This function resets the form.
   */
  onReset(): void {
    this.submitted = false;
    this.form.reset();
  }

  /**
   * This function toggles the variable passwordVisible.
   */
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  /**
   * This function triggers the animation when the page is loaded.
   */
  ngAfterViewInit() {
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      this.state = 'shown';
      this.backgroundState = 'background-fade-in';
    }, 200);
    setTimeout(() => {
      document.body.style.overflow = 'auto';
    }, 1200);
  }

  /**
   * This function handles the animation in case the user leaves the page.
   * @param target string
   */
  redirect(target: string) {
    this.state = 'hidden-left';
    this.backgroundState = 'background-fade-out';
    setTimeout(() => {
      this.router.navigate([`/${target}`]);
    }, 700);
  }
}
