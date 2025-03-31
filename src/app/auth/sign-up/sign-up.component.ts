import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import Validation from '../../utils/validation';
import { AuthenticationService } from '../../services/authentication.service';
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
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
  animations: [
    trigger('hideShowTrigger', [
      state('shown', style({ transform: 'translateY(0%)', opacity: 1 })),
      state(
        'hidden-top',
        style({ transform: 'translateY(-1000%)', opacity: 0.1 })
      ),
      state(
        'hidden-left',
        style({ transform: 'translateX(-1000%)', opacity: 0.1 })
      ),
      transition('hidden-top => shown', [animate('0.7s ease-out')], {}),
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
export class SignUpComponent implements OnInit, AfterViewInit{
  router = inject(Router);
  authenticationService = inject(AuthenticationService);

  form: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
  });
  submitted = false;
  buttonSubmitDisabled = false;
  passwordVisible: boolean = false;
  state = 'hidden-top';
  backgroundState = 'background-fade-out';

  constructor(private formBuilder: FormBuilder) {}

  /**
   * This function sets the validation form and the requieries.
   */
  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        email: [
          '',
          [
            Validators.required,
            Validators.pattern(
              /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
            ),
          ],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(40),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: [Validation.match('password', 'confirmPassword')],
      }
    );
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
   * This function submits the form if it is valid. If it is a new user is created.
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
    let success = await this.authenticationService.signUp(email, password);
    if (success) {
      this.redirect('/login');
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
      this.router.navigate([`${target}`]);
    }, 400);
  }
}
