import { Component, OnInit, Output, EventEmitter, ElementRef, AfterViewInit, Input } from '@angular/core';
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

  @Input() data: any;
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

  public userInfo;

  public sliceLimit = 12;

  public showNav = false;

  private intersectionObserverSubs: Subscription;

  private updateAppBackgroundColor(): void {
    this.appColor.emit(4);
  }


  ngOnInit() {
    this.userInfo = this.data.userInfo;
  }

  ngAfterViewInit(): void {
    this.intersectionObserverService.init(this.element.nativeElement, {
      threshold: 0.50
    });
    this.intersectionObserverSubs = this.intersectionObserverService
      .getSubject()
      .subscribe(el => {
        if (el.isIntersecting) {
          this.updateAppBackgroundColor();
          this.showNav = true;
        } else {
          this.showNav = false;
        }
      });
  }

  getHistory(data) {
    this.navState = {...data};
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
      userID: this.data.userInfo.id,
      token: this.tokenSvc.oAuthToken,
      playlistName: (playlistName),
      tracks: null
    };

    if (this.navState.selectedHistory.value === 'current') {
      config.tracks = this.data.currentTracks;
    } else {
      config.tracks = this.data.allTimeTracks;
    }

    this.spotifyService.makePlaylist(config).then((results: any) => {
      this.snackBar.open('Playlist Created in Spotify!', '' , { duration: 5000, panelClass: 'panel-success'});

    }).catch((err: any) => {
      this.snackBar.open('Server Error. Please Try Again Later.', '' , { duration: 5000, panelClass: 'panel-error'});
    });
  }

  showMore() {
    this.sliceLimit = 50;
  }
  showLess() {
    this.sliceLimit = 12;
  }
}
