import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { LandingPageService } from '../../services/landing-page.service';
import { AuthenticationService } from '../../services/authentication.service';
import { ToastService } from '../../services/toast.service';
import { ToastCTA } from '../../interfaces/toast-cta';
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
  landingPageService = inject(LandingPageService);
  toastService = inject(ToastService);
  authenticationService = inject(AuthenticationService);

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
   * This function builds the form and sets the value of the email field in case the user has entered anything on the landing page.
   */
  ngOnInit(): void {
    this.buildForm();
    this.setValueEmailField();
  }

  /**
   * This function sets the validation form and the requieries.
   */
  buildForm() {
    this.form = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
          ),
        ],
      ],
      password: ['', [Validators.required]],
    });
  }

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
   * This function sets the value of the email field depending on the value of the observable inputData.
   */
  setValueEmailField() {
    this.landingPageService.inputData
      .pipe(take(1))
      .subscribe((inputDataLandingPage: string) => {
        this.form.get('email')?.setValue(inputDataLandingPage);
      });
  }

  /**
   * This function submits the form if it is valid. If it is the password is logged in.
   * @returns
   */
  async onSubmit(): Promise<void> {
    this.submitted = true;
    const email = this.form.value.email;
    const password = this.form.value.password;

    if (this.form.invalid) {
      return;
    }
    this.buttonSubmitDisabled = true;
    let success = await this.authenticationService.login(email, password);
    if (success) {
      this.redirect('/dashboard');
    } else {
      this.buttonSubmitDisabled = false;
    }
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
