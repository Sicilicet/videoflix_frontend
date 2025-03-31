import {
  Component,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import videojs from 'video.js';
import { VideoService } from '../../../services/video.service';

@Component({
  selector: 'app-vjs-player',
  standalone: true,
  imports: [],
  template: `
    <video #target class="video-js" muted playsinline preload="none"></video>
  `,
  styleUrl: './vjs-player.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class VjsPlayerComponent implements OnInit, OnDestroy {
  videoService = inject(VideoService);
  @ViewChild('target', { static: true }) target!: ElementRef;

  @Input() options!: {
    autoplay: boolean;
    sources: { src: string; type: string; label: string }[];
    controls: boolean;
    fluid: boolean;
    muted: boolean;
  };

  player!: ReturnType<typeof videojs>;

  /**
   * This function initializes the vjs player and checks if there is a timestamp in session storage available.
   */
  ngOnInit() {
    const playerOptions = {
      ...this.options,
      controlBar: {
        children: {
          playToggle: true,
          volumePanel: true,
          progressControl: true,
          remainingTimeDisplay: true,
          fullscreenToggle: true,
        },
      },
    };
    this.player = videojs(this.target.nativeElement, playerOptions, () => {});
    this.getCurrentTimestamp();
  }

  /**
   * This function changes the timestamp of the player by the seconds input. It is needed to skip forward and rewind.
   * @param seconds number
   */
  changeTimestamp(seconds: number) {
    const currentTime = this.player.currentTime();
    if (currentTime) {
      this.player.currentTime(currentTime + seconds);
    }
  }

  /**
   * This function stores the current timestamp in the session storage.
   */
  setCurrentTimestamp() {
    const timestamp = this.player.currentTime();
    if (timestamp) {
      this.videoService.storeVideoTimestampSessionStorage(timestamp);
    }
  }

  /**
   * This function gets the timestamp from the session storage.
   */
  getCurrentTimestamp() {
    const timestamp = this.videoService.getVideoTimestampFromSessionStorage();
    if (timestamp) {
      this.player.currentTime(timestamp);
    }
  }

  /**
   * This function gets the new .m3u8 and the corresponding .ts files from the database in case the user switches the resolution.
   * @param newResolutionUrl string
   */
  reloadVideo(newResolutionUrl: string) {
    this.player.src({ src: newResolutionUrl, type: 'application/x-mpegURL' });
    const currentTime = this.player.currentTime();
    this.player.load();
    this.player.currentTime(currentTime);
    this.playVideo();
  }

  /**
   * This function plays the video.
   */
  playVideo() {
    this.player.play();
  }

  /**
   * This function stores the timestamp before the player is destroyed.
   */
  ngOnDestroy() {
    if (this.player) {
      const currentTime = this.player.currentTime();

      if (currentTime) {
        const timeAsInteger = Math.floor(currentTime);
        this.videoService.storeWatchHistory(timeAsInteger);
      }
      this.player.dispose();
    }
  }
}
