import { Component, OnInit } from '@angular/core';
import { TokenService, AuthService } from '../../services/spotifyAuth';
import { ActivatedRoute, Router, ROUTES } from '@angular/router';
import { ObscurifyService } from 'src/app/services/obscurifyService';
import { SpotifyService } from 'src/app/services/spotifyService';
import { ObscurityFuncs } from 'src/app/utilities/obscurityFuncs';
import { DomSanitizer } from '@angular/platform-browser';
import { UserService } from 'src/app/services/userService';

@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.scss']
})
export class PublicProfileComponent implements OnInit {

    public profileUserID: string;
    public showError = false;
    private shareCode: string;
    public loaded = false;
    public country: string;
    public displayName: string;
    public imageURL: string;
    public longTermTrackIDs: any[];
    public longTermTracks: any[];
    public longTermArtistIDs: any[];
    public longTermArtists: any[];
    public longTermAudioFeatures: any;
    public currentTrackIDs: any[];
    public currentTracks: any[];
    public currentArtistIDs: any[];
    public currentArtists: any[];
    public obscurifyScore: number;
    public obscurifyPercentile: number;
    public userHistory: any[];
    public genres: any[];
    public userID: string;
    public sliceLimit = 12;

  constructor(
      private routeParams: ActivatedRoute,
      public sanitizer: DomSanitizer,
      public obscurityFunc: ObscurityFuncs,
      public tokenSvc: TokenService,
      public authService: AuthService,
      public obscurifyService: ObscurifyService,
      public spotifyService: SpotifyService,
      public userService: UserService,
      public router: Router
  ) {
      this.profileUserID = routeParams.snapshot.queryParams.id;
      this.shareCode = routeParams.snapshot.queryParams.code;
  }

  ngOnInit(): void {
    this.userID = this.userService.getUserState().userId;
    this.authService.setState(`/profile/${this.profileUserID}/${this.shareCode}`);
    this.tokenSvc.setState(`/profile/${this.profileUserID}/${this.shareCode}`);
    const now = new Date().getTime();
    this.authService.authorizedStream.subscribe( res => {
      this.getPublicProfile();
    })
    this.authService.authorize();


  }

  getPublicProfile() {
        this.obscurifyService.getPublicProfile(this.profileUserID, this.shareCode).subscribe(
          (userData: any) => {
            if (userData.error) {
                this.tokenSvc.resetState();
            } else {
              this.loaded = true;
              this.country = (userData.country ? userData.country.S : null);
              this.displayName = (userData.displayName ? userData.displayName.S : null);
              this.imageURL = (userData.imageURL ? userData.imageURL.S : null);
              this.longTermTrackIDs = (userData.longTermTrackIDs ?
                  userData.longTermTrackIDs.L.map(x => x.S) : null);
              this.longTermArtistIDs = (userData.longTermArtistIDs ?
                  userData.longTermArtistIDs.L.map(x => x.S) : null);

              this.longTermAudioFeatures = (userData.longTermAudioFeatures ? userData.longTermAudioFeatures.M : null);
              this.obscurifyScore = (userData.obscurifyScore ? userData.obscurifyScore.N : null);
              this.userHistory = (userData.userHistory ?
                  userData.userHistory.L.map(x => x.M) : null);
              for (const history of this.userHistory) {
                let tempDate = history.formattedDate;
                if (tempDate.length > 2) {
                  tempDate = tempDate.slice(0, tempDate.length - 2) + '\'' + tempDate.slice(tempDate.length - 2);
                }
                history.formattedDate = tempDate;
              }
              this.spotifyService.getArtists({artistIDs: this.longTermArtistIDs})
                .then((res: any) => {
                  this.longTermArtists = [...res.artists];
                  this.genres = this.obscurityFunc.findTopGenres(this.longTermArtists);
                })
                .catch(err => {
                  if (err.error && err.error.error.status === 401) {
                    this.tokenSvc.clearToken();
                    this.authService.authorize();
                  };
                  console.log(err);
                });
              this.spotifyService.getTracks({trackIDs: this.longTermTrackIDs})
              .then((res: any) => {
                this.longTermTracks = [...res.tracks];
              })
              .catch(err => {
                console.log(err);
              });


              this.obscurifyService.getObscurifyData(
                this.country,
                this.obscurifyScore,
                0).subscribe(
                  (obscurifyData: any) => {
                    if (obscurifyData.error) {
                      console.log(obscurifyData.error);
                    } else {
                      this.obscurifyPercentile = obscurifyData.percentileByCountryAllTime;
                    }
                }
              );

              this.tokenSvc.resetState();

            }
        },
        err => {
            this.authService.resetState();
            this.tokenSvc.resetState();
            this.showError = true;
            this.loaded = true;
        }
      );
  }

}
