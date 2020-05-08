import { Component, OnInit, Output, EventEmitter, ElementRef, AfterViewInit } from '@angular/core';
import IntersectionObserverService from 'src/app/services/intersectionObserver';
import { Subscription } from 'rxjs';
import { InfoService } from 'src/app/services/infoService';
import { SpotifyProvider } from 'src/app/services/spotifyProvider/spotifyProvider';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.scss'],
  providers: [IntersectionObserverService]

})
export class RecommendationsComponent implements OnInit, AfterViewInit {
  @Output() appColor = new EventEmitter<number>();
  recommendedTracks: any;

  constructor(
    public element: ElementRef,
    public intersectionObserverService: IntersectionObserverService,
    public infoSvc: InfoService,
    public spotifyProvider: SpotifyProvider,
    public sanitizer: DomSanitizer,
    public snackBar: MatSnackBar) { }
    public show = false;
    public user;
    public tracks;
    private intersectionObserverSubs: Subscription;
    private initialTracks = false;

  private updateAppBackgroundColor() {

    this.appColor.emit(5);

  }

  ngOnInit() {
    this.infoSvc.getUserStream().subscribe((user) => {
      console.log('recommendations');
      this.user = {...user};
    });
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
          allTimeArtistIDs: this.user.allTimeArtistIDs,
          currentArtistsIDs: this.user.currentArtistsIDs,
          allTimeTrackIDs: this.user.allTimeTrackIDs,
          currentTrackIDs: this.user.currentTrackIDs,
          country: this.user.userInfo.country
        };

        if (!this.initialTracks) {
          this.spotifyProvider.getRecommendations(config)
          .then((data: any) => {
            console.log('data', data);
            this.tracks = data.tracks;
            this.recommendedTracks = this.tracks.slice(0, 16);
            console.log('tracks', this.tracks);
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

  makePlaylist() {
    const config = {
      userID: this.user.userInfo.id,
      playlistName: 'Recommended for You // Obscurify',
      tracks: this.recommendedTracks
    };
    this.spotifyProvider.makePlaylist(config).then((results: any) => {
      console.log('playlist', results);
      this.snackBar.open('Playlist Created in Spotify!', '' , { duration: 5000, panelClass: 'panel-success'});

    }).catch((err: any) => {
      console.log('playlist error', err);
      this.snackBar.open('Server Error. Please Try Again Later.', '' , { duration: 5000, panelClass: 'panel-error'});
    });
  }
}
