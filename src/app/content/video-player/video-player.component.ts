import {
  Component,
  ElementRef,
  HostListener,
  inject,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { take } from 'rxjs';
import { VideoService } from '../../services/video.service';
import { environment } from '../../../environments/environment';
import { VideoModel } from '../../models/video.class';
import { Resolutions } from '../../interfaces/resolutions';
import { VjsPlayerComponent } from './vjs-player/vjs-player.component';

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [CommonModule, RouterModule, VjsPlayerComponent],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.scss',
})
export class VideoPlayerComponent {
  playerWidth: string = '100%';
  videoService = inject(VideoService);
  router = inject(Router);
  baseUrl = environment.baseUrl;

  selectedVideoData: VideoModel = {
    id: 0,
    title: '',
    timestamp: 0,
    hls_file: '',
  };
  videoUrl: string = '';
  showRestartConfirm = false;
  isFirstLoad = true;
  videoResolution: Resolutions = 360;
  private resizeTimeout: any;

  @ViewChild('container', { static: true }) container!: ElementRef;
  @ViewChild('videoPlayer') videoPlayer!: VjsPlayerComponent;

  /**
   * This function does some initializing tasks. It adjusts the players size, subscribes to video resolution observable, sets the initial video resolution based on the screen size, starts the loading of the video, gets the data from the service and sets the variable has watched.
   */
  async ngOnInit() {
    this.adjustPlayerSize();
    this.subscribeVideoResolution();
    this.setInitialVideoResolution();
    await this.videoService.getVideo(this.videoResolution);
    this.getVideoDataFromService();
  }

  /**
   * This function sets the initial video resolution based on the current screen size.
   */
  setInitialVideoResolution() {
    const screenWidth = window.innerWidth;
    if (screenWidth > 1400) {
      this.videoService.setVideoResolution(1080);
    } else if (screenWidth > 1000) {
      this.videoService.setVideoResolution(720);
    } else if (screenWidth > 800) {
      this.videoService.setVideoResolution(480);
    } else {
      this.videoService.setVideoResolution(360);
    }
  }

  /**
   * This function gets the video data from the video service.
   */
  getVideoDataFromService() {
    this.videoService.selectedVideoData
      .pipe(take(1))
      .subscribe((selectedVideoData) => {
        this.selectedVideoData = selectedVideoData;
        this.videoUrl = this.baseUrl + this.selectedVideoData.hls_file;
        this.setShowResetConfirm();
      });
  }

  /**
   * This function subscribes to the observable videoResolution.
   */
  subscribeVideoResolution() {
    this.videoService.videoResolution.subscribe((videoResolution) => {
      this.videoResolution = videoResolution;
    });
  }

  /**
   * This function sets the variable showRestartConfirm to true in case there is a timestamp other than 0.
   */
  setShowResetConfirm() {
    if (this.selectedVideoData.timestamp !== 0 && this.isFirstLoad) {
      this.showRestartConfirm = true;
      this.isFirstLoad = false;
    }
  }

  /**
   * This function function sets the timestamp to 0 in case the user wants to watch a video from anew.
   */
  resetTimestamp() {
    this.videoService.storeVideoTimestampSessionStorage(0);
    this.showRestartConfirm = false;
    setTimeout(() => {
      this.videoPlayer.playVideo();
    }, 200);
  }

  /**
   * This function changes the variable showRestartConfirm to false. This is needed to undisplay the dialog for restart and continue.
   */
  continueVideo() {
    this.showRestartConfirm = false;
    setTimeout(() => {
      this.videoPlayer.playVideo();
    }, 200);
  }

  /**
   * This function forwards the timestamp for 10s.
   */
  forward() {
    this.videoPlayer.changeTimestamp(10);
  }

  /**
   * This function rewinds the timestamp for 10s.
   */
  rewind() {
    this.videoPlayer.changeTimestamp(-10);
  }

  /**
   * This function changes the video resolution and loads the new data.
   * @param resolution number of type Resolutions
   */
  async setVideoResolution(resolution: Resolutions) {
    this.videoService.setVideoResolution(resolution);
    await this.videoService.getVideo(resolution);
    this.getVideoDataFromService();
    this.videoPlayer.reloadVideo(this.videoUrl);
  }

  /**
   * This function resizes the video player in case the user changes the size of the window.
   */
  @HostListener('window:resize')
  onResize() {
    clearTimeout(this.resizeTimeout);

    this.adjustPlayerSize();

    this.resizeTimeout = setTimeout(() => {
      this.setInitialVideoResolution();
      this.setVideoResolution(this.videoResolution);
    }, 200);
  }

  /**
   * This fuction calculates the width and height of the player so it can be displayed as big as possible.
   */
  adjustPlayerSize() {
    const containerWidth = this.container.nativeElement.offsetWidth;
    const containerHeight = this.container.nativeElement.offsetHeight - 160;
    const aspectRatio = 16 / 9;

    if (containerWidth / containerHeight > aspectRatio) {
      const newWidth =
        (aspectRatio / (containerWidth / containerHeight)) * 100 - 0.1;
      this.playerWidth = `${newWidth}%`;
    } else {
      this.playerWidth = '100%';
    }
  }

  /**
   * This function deletes the session storage and redirects the user to the dashboard.
   */
  redirectToDashboard() {
    this.deleteSessionStorage();
    this.redirect();
  }

  /**
   * This function deletes the session storage.
   */
  deleteSessionStorage() {
    sessionStorage.removeItem('timestamp');
    sessionStorage.removeItem('selectedVideoId');
  }

  /**
   * This function redirects the user to the dashboard.
   */
  redirect() {
    this.router.navigate(['/dashboard']);
  }

  /**
   * This function deletes the session storage in case the user leaves the page.
   */
  ngOnDestroy(): void {
    this.deleteSessionStorage();
  }
}
