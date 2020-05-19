import { Component, OnInit, Output, EventEmitter, ElementRef, AfterViewInit, Input } from '@angular/core';
import IntersectionObserverService from 'src/app/services/intersectionObserver';
import { Subscription } from 'rxjs';
import { InfoService } from 'src/app/services/infoService';
import { SpotifyService } from 'src/app/services/spotifyService';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.scss'],
  providers: [IntersectionObserverService]

})
export class RecommendationsComponent implements OnInit, AfterViewInit {
  @Input() data;
  @Output() appColor = new EventEmitter<number>();

  constructor(
    public element: ElementRef,
    public intersectionObserverService: IntersectionObserverService,
    public infoSvc: InfoService,
    public spotifyService: SpotifyService,
    public sanitizer: DomSanitizer,
    public snackBar: MatSnackBar) { }
    public show = false;
    public user: any;
    public recommendedTracks: any;

    private intersectionObserverSubs: Subscription;
    private initialTracks = false;

  private updateAppBackgroundColor() {

    this.appColor.emit(5);

  }

  ngOnInit() {
    // this.infoSvc.getUserStream().subscribe((user) => {
    //   console.log('recommendations');
    //   this.user = {...user};
    // });
  }


  ngAfterViewInit(): void {
    this.intersectionObserverService.init(this.element.nativeElement, {
      threshold: 0.70
    });
    this.intersectionObserverSubs = this.intersectionObserverService
    .getSubject()
    .subscribe(el => {

      if (el.isIntersecting) {
        this.updateAppBackgroundColor();
        this.show = true;

        const config = {
          allTimeArtistIDs: this.data.allTimeArtistIDs,
          currentArtistIDs: this.data.currentArtistIDs,
          allTimeTrackIDs: this.data.allTimeTrackIDs,
          currentTrackIDs: this.data.currentTrackIDs,
          country: this.data.userInfo.country
        };

        if (!this.initialTracks) {
          this.spotifyService.getRecommendations(config)
          .then((data: any) => {
            this.recommendedTracks = data.tracks;
            this.initialTracks = true;
          })
          .catch((err) => {
            console.log('Error getting recommended Tracks');
          });
        }

      } else {
        this.show = false;
      }

    });
  }

  refreshTracks() {
    const config = {
      allTimeArtistIDs: this.data.allTimeArtistIDs,
      currentArtistIDs: this.data.currentArtistIDs,
      allTimeTrackIDs: this.data.allTimeTrackIDs,
      currentTrackIDs: this.data.currentTrackIDs,
      country: this.data.userInfo.country
    };

    this.spotifyService.getRecommendations(config).then((data: any) => {
      this.recommendedTracks = data.tracks;
    }).catch((err) => {

      console.log('playlist error', err);
      this.snackBar.open('Server Error. Please Try Again Later.', '' , { duration: 5000, panelClass: 'panel-error'});
    });
  }

  makePlaylist() {
    const config = {
      userID: this.data.userInfo.id,
      playlistName: 'Recommended for You // Obscurify',
      tracks: this.recommendedTracks
    };
    this.spotifyService.makePlaylist(config).then((results: any) => {
      console.log('playlist', results);
      this.snackBar.open('Playlist Created in Spotify!', '' , { duration: 5000, panelClass: 'panel-success'});

    }).catch((err: any) => {
      console.log('playlist error', err);
      this.snackBar.open('Server Error. Please Try Again Later.', '' , { duration: 5000, panelClass: 'panel-error'});
    });
  }
}
