import { Component, OnInit } from '@angular/core';
import { TokenService, AuthService } from '../../services/spotifyAuth';
import { ActivatedRoute, Router, ROUTES } from '@angular/router';
import { ObscurifyService } from 'src/app/services/obscurifyService';
import { SpotifyService } from 'src/app/services/spotifyService';
import ObscurityFuncs from 'src/app/utilities/obscurityFuncs';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.scss']
})
export class PublicProfileComponent implements OnInit {

    private userID: string;
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

    public sliceLimit = 12;

  constructor(
      private routeParams: ActivatedRoute,
      public sanitizer: DomSanitizer,
      public obscurityFunc: ObscurityFuncs,
      public tokenSvc: TokenService,
      public authService: AuthService,
      public obscurifyService: ObscurifyService,
      public spotifyService: SpotifyService
  ) {
      this.userID = routeParams.snapshot.queryParams.id;
      this.shareCode = routeParams.snapshot.queryParams.code;
  }

  ngOnInit(): void {
      this.authService.setState(`/user/${this.userID}/${this.shareCode}`);
      if (this.tokenSvc.oAuthToken.spotifyToken) {
        this.authService.authorized();
        this.getPublicProfile();
        this.tokenSvc.resetState();

      } else {
        this.tokenSvc.clearToken();
        this.authService.authorize();
      }
  }

  getPublicProfile() {
        this.obscurifyService.getPublicProfile(this.userID, this.shareCode).subscribe(
          (userData: any) => {
            if (userData.error) {
              console.log(userData.error);
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

              // this.spotifyService.getArtists({artistIDs: this.currentArtistIDs}).then(
              //   (res: any) => {
              //     this.currentArtists = [...res.artists];
              //   }
              // ).catch(err => {
              //   console.log(err);
              // });

              // this.spotifyService.getTracks({trackIDs: this.currentTrackIDs}).then(
              //   (res: any) => {
              //     this.currentTracks = [...res.artists];
              //   }
              // ).catch(err => {
              //   console.log(err);
              // });

              this.spotifyService.getArtists({artistIDs: this.longTermArtistIDs})
                .then((res: any) => {
                  this.longTermArtists = [...res.artists];
                  this.genres = this.obscurityFunc.findTopGenres(this.longTermArtists);
                  console.log(this.genres);
                })
                .catch(err => {
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
                      console.log(obscurifyData.error)
                    } else {
                      this.obscurifyPercentile = obscurifyData.percentileByCountryAllTime;
                    }
                }
              );

            }
        }
      );
  }

}
