import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { VideoService } from '../../services/video.service';
import { environment } from '../../../environments/environment';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  animations: [
    trigger('hideShowTrigger', [
      state('shown', style({ transform: 'translateY(0%)', opacity: 1 })),
      state(
        'hidden-bottom',
        style({ transform: 'translateY(1000%)', opacity: 0.1 })
      ),
      transition('hidden-bottom => shown', [animate('0.7s ease-out')], {}),
      transition('shown => hidden-bottom', [animate('0.4s ease-in')], {}),
    ]),

    trigger('hideShowTeaser', [
      state('shown', style({ transform: 'translateX(0%)', opacity: 1 })),
      state(
        'hidden-right',
        style({ transform: 'translateX(1000%)', opacity: 0.1 })
      ),
      transition('hidden-right => shown', [animate('0.7s ease-out')], {}),
      transition('shown => hidden-right', [animate('0.4s ease-in')], {}),
    ]),

    trigger('showThumbnailTrigger', [
      state(
        'clear',
        style({ filter: 'blur(0px)', opacity: 1, transform: 'scale(1)' })
      ),
      state(
        'blurred',
        style({ filter: 'blur(5px)', opacity: 0.1, transform: 'scale(0.1)' })
      ),
      transition('blurred => clear', [animate('0.7s ease-out')], {}),
      transition('clear => blurred', [animate('0.4s ease-in')], {}),
    ]),

    trigger('zoomThumbnailTrigger', [
      state('zoom-out', style({})),
      state('zoom-in', style({ zIndex: '999' })),
      transition('zoom-out => zoom-in', [
        animate('0s', style({ position: 'absolute' })),
        animate(
          '1s ease-in-out',
          style({ transform: 'scale(10)', filter: 'blur(10px)' })
        ),
      ]),
    ]),
  ],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  router = inject(Router);
  videoService = inject(VideoService);

  state = 'hidden-bottom';
  teaserState = 'hidden-right';
  thumbnailState = 'blurred';
  zoomState = 'zoom-out';

  baseUrl = environment.baseUrl;

  /**
   * This function initializes the loading of the data from the database.
   */
  ngOnInit(): void {
    this.videoService.getDashboardData();
    this.videoService.getHeroData();
  }

  /**
   * This function triggers the animation on loading of the page.
   */
  ngAfterViewInit() {
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      this.state = 'shown';
      this.thumbnailState = 'clear';
      this.teaserState = 'shown';
    }, 200);
  }

  /**
   * This function sets the first letter of the category to upper case. They come in lower case from the database.
   * @param category string
   * @returns string, category in upper case (first letter)
   */
  upperCase(category: string) {
    return category.charAt(0).toUpperCase() + category.slice(1);
  }

  /**
   * This function triggers the animation to display the hero component. It gets the data from the service and sets the selected ID.
   * @param videoId number
   */
  showHero(videoId: number) {
    if (window.innerWidth > 769) {
      this.state = 'hidden-bottom';
      this.teaserState = 'hidden-right';
      setTimeout(() => {
        this.videoService.setselectedVideoId(videoId);
        this.videoService.getHeroData();
        this.state = 'shown';
        this.teaserState = 'shown';
      }, 700);
    } else {
      this.thumbnailState = 'blurred';
      setTimeout(() => {
        this.videoService.setselectedVideoId(videoId);
        this.videoService.getHeroData();
        this.redirect('/hero');
      }, 400);
    }
  }

  /**
   * This function triggers the animation if the user opens a video and redirects afterwards.
   * @param target string
   */
  openVideo(target: string) {
    document.body.style.overflow = 'hidden';
    this.zoomState = 'zoom-in';
    this.thumbnailState = 'blurred';
    setTimeout(() => {
      document.body.style.overflow = 'auto';
      this.redirect(target);
    }, 1000);
  }

  /**
   * This function triggers the animation in case the user hits the logout button. After the animation she is redirected.
   */
  logout() {
    this.state = 'hidden-bottom';
    this.thumbnailState = 'blurred';
    setTimeout(() => {
      this.redirect('/');
    }, 700);
  }

  /**
   * This function does the redirect.
   * @param target string, route to navigate
   */
  redirect(target: string) {
    this.router.navigate([`${target}`]);
  }

  /**
   * This function sets the overflow of the body to auto in case the user leaves the page.
   */
  ngOnDestroy(): void {
    document.body.style.overflow = 'auto';
  }
}
