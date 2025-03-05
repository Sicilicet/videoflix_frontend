import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  router = inject(Router);

  route: string = '/login';

  /**
   * This function gets the current url on initialization of the component.
   */
  ngOnInit(): void {
    this.route = this.router.url;
  }
}
