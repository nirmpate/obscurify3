import { Component, OnInit, Output, EventEmitter, ElementRef, AfterViewInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import IntersectionObserverService from 'src/app/services/intersectionObserver';
import { Subscription } from 'rxjs';
import { InfoService } from 'src/app/services/infoService';
import { TokenService } from 'src/app/services/spotifyAuth';
import { SpotifyService } from 'src/app/services/spotifyService';

@Component({
  selector: 'app-artist-list',
  templateUrl: './artist-list.component.html',
  styleUrls: ['./artist-list.component.scss'],
  providers: [IntersectionObserverService]
})
export class ArtistListComponent implements AfterViewInit, OnInit {

  @Output() appColor = new EventEmitter<number>();

  constructor(
    public element: ElementRef,
    public intersectionObserverService: IntersectionObserverService,
    public infoSvc: InfoService,
    public tokenSvc: TokenService,
    public spotifyService: SpotifyService,
    public snackBar: MatSnackBar
    ) { }

  public navState = {
    listType: 'artists',
    historyList: [
      {name: 'Current', value: 'current'},
      {name: 'All Time', value: 'allTime'},
    ],
    selectedHistory: {name: 'Current', value: 'current'}
  };

  public allTimeArtists = [];
  public currentArtists = [];
  public allTimeTracks = [];
  public currentTracks = [];
  public userInfo;

  public sliceLimit = 10;

  public showNav = false;

  private intersectionObserverSubs: Subscription;

  private updateAppBackgroundColor(): void {
    this.appColor.emit(4);
  }


  ngOnInit() {
    this.infoSvc.fetchAllTimeArtists().subscribe((x: any) => {

      if (x.items) {
        this.allTimeArtists = [...x.items];
      }

    });

    this.infoSvc.fetchAllTimeTracks().subscribe((x: any) => {

      if (x.items) {
        this.allTimeTracks = [...x.items];
      }

    });

    this.infoSvc.fetchCurrentTracks().subscribe((x: any) => {
      if (x.items) {
        this.currentTracks = [...x.items];
      }
    });

    this.infoSvc.fetchCurrentArtists().subscribe((x: any) => {
      if (x.items) {
        this.currentArtists = [...x.items];
      }
    });

    this.infoSvc.getUserStream().subscribe((user: any) => {
      this.userInfo = {...user.userInfo};
    });
  }

  ngAfterViewInit(): void {
    this.intersectionObserverService.init(this.element.nativeElement, {
      threshold: 0.20
    });
    this.intersectionObserverSubs = this.intersectionObserverService
      .getSubject()
      .subscribe(el => {
        if (el.isIntersecting) {
          console.log('is intersecting artists');
          this.updateAppBackgroundColor();
          this.showNav = true;
        } else {
          this.showNav = false;
        }
      });
  }

  getHistory(data) {
    this.navState = {...data};
    console.log(this.navState);
  }

  createPlaylist() {
    let playlistName = '';

    if (this.navState.selectedHistory.name === 'Current') {
      playlistName = 'Current';
    } else {
      playlistName = 'All-Time Top Tracks // Obscurify';
    }

    if (playlistName === 'Current') {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];
      const dateObj = new Date();
      const month = monthNames[dateObj.getMonth()]; // months from 1-12
      const day = dateObj.getDate();
      const year = dateObj.getFullYear() % 100;
      const newdate = month + ' ' + day + ' \'' + year;
      playlistName = newdate + ' // Obscurify';
    }

    const config = {
      userID: this.userInfo.id,
      token: this.tokenSvc.oAuthToken,
      playlistName: (playlistName),
      tracks: null
    };

    if (this.navState.selectedHistory.value === 'current') {
      config.tracks = this.currentTracks;
    } else {
      config.tracks = this.allTimeTracks;
    }

    this.spotifyService.makePlaylist(config).then((results: any) => {
      console.log('playlist', results);
      this.snackBar.open('Playlist Created in Spotify!', '' , { duration: 5000, panelClass: 'panel-success'});

    }).catch((err: any) => {
      console.log('playlist error', err);
      this.snackBar.open('Server Error. Please Try Again Later.', '' , { duration: 5000, panelClass: 'panel-error'});
    });
  }

  showMore() {
    this.sliceLimit = 50;
  }
  showLess() {
    this.sliceLimit = 10;
  }
}
