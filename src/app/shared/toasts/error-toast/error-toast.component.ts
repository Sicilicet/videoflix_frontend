import { Component, inject } from '@angular/core';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-error-toast',
  standalone: true,
  imports: [],
  templateUrl: './error-toast.component.html',
  styleUrl: './error-toast.component.scss',
})
export class ErrorToastComponent {
  toastService = inject(ToastService);

  message = '';
  isVisible = 'hidden';

  /**
   * This function subscribes to the toast message provided from the toast service.
   */
  ngOnInit(): void {
    this.toastService.toastMessage.subscribe((message: string) => {
      this.message = message;
    });
  }

  /**
   * This function closes a toast by calling the hide toast function from the toast service.
   */
  closeToast() {
    this.toastService.hideToast();
  }
}
