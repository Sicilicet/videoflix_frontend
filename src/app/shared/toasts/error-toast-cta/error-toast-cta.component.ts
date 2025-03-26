import { Component, inject } from '@angular/core';
import { ToastService } from '../../../services/toast.service';
import { ToastCTA } from '../../../interfaces/toast-cta';

@Component({
  selector: 'app-error-toast-cta',
  standalone: true,
  imports: [],
  templateUrl: './error-toast-cta.component.html',
  styleUrl: './error-toast-cta.component.scss',
})
export class ErrorToastCtaComponent {
  toastService = inject(ToastService);

  toastData: ToastCTA = {
    message: '',
    textButton: '',
    action: () => {},
  };
  isVisible = 'hidden';

  /**
   * This function subscribes to the toast data provided from the toast service.
   */
  ngOnInit(): void {
    this.toastService.toastCTAdata.subscribe((toastData: ToastCTA | null) => {
      if (toastData) {
        this.toastData = toastData;
      }
    });
  }

  /**
   * This function closes a toast by calling the hide toast function from the toast service.
   */
  closeToast() {
    this.toastService.hideToast();
  }
}
