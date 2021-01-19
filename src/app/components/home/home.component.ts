import { Component, OnInit, Directive } from '@angular/core';
import { TokenService, AuthService } from '../../services/spotifyAuth';
import { Router } from '@angular/router';
import { InfoService } from '../../services/infoService';
import { Subscription} from 'rxjs';
import { combineLatest } from 'rxjs/index';
import { ObscurifyService } from 'src/app/services/obscurifyService';
import { SpotifyService } from 'src/app/services/spotifyService';
import { map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SeoService } from '../../services/metaData';
import { ObscurityFuncs } from 'src/app/utilities/obscurityFuncs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],

})
export class HomeComponent implements OnInit {
  constructor(
    public tokenSvc: TokenService,
    public router: Router,
    public infoSvc: InfoService,
    public authService: AuthService,
    public obscurifyService: ObscurifyService,
    public spotifyService: SpotifyService,
    public snkBar: MatSnackBar,
    private seoService: SeoService,
    private obscurifyFunc: ObscurityFuncs
  ) {
    this.loaded = false;
  }
  private stream: Subscription | null = null;

  // public bgColor = '#A9E5AC';
  public userHistory = null;
  public user: any = null;
  public obscurifyInfo = null;
  public shortTermAudioFeatures = null;
  public shortTermAudioFeaturesPerTrack = null;
  public longTermAudioFeatures = null;
  public allTimeArtists = null;
  public allTimeTracks = null;
  public topGenres = null;
  public currentArtists = null;
  public currentTracks = null;
  public loaded = false;
  public hex: string;
  public isProfilePublic: boolean;

  ngOnInit() {
    this.seoService.setMetaTags();
    const userStream = this.tokenSvc.authTokens.pipe((x) => {
      if (this.tokenSvc.oAuthToken.spotifyToken) {
        this.authService.authorized();
      } else {
        this.tokenSvc.clearToken();
        this.authService.authorize();
      }
      this.hex = this.tokenSvc.oAuthToken.obscurifyToken;
      return this.infoSvc.fetchUserInfo();
    });

    userStream.subscribe((user: any ) => {
      if (user.error && user.error.error.status === 401) {
        this.authService.authorize();
      } else if (user.error && user.error.error.status === 402) {
        this.router.navigate(['login', { serverError: true }]);
      } else {
        this.user = user;
        // Get the rest of Spotify Data
        this.isProfilePublic = this.tokenSvc.oAuthToken.isPublic;
        const artistAndTrackStream = combineLatest([
          this.infoSvc.fetchAllTimeTracks(),
          this.infoSvc.fetchCurrentTracks(),
          this.infoSvc.fetchAllTimeArtists(),
          this.infoSvc.fetchCurrentArtists(),
        ]).pipe(map(([a$, b$, c$, d$]) => ({
          allTimeTracks: a$,
          currentTracks: b$,
          allTimeArtists: c$,
          currentArtists: d$
        })));

        artistAndTrackStream.subscribe((data: any) => {
          if (!data.allTimeTracks.error || !data.currentTracks.error) {
            this.currentTracks = { ...data.currentTracks };
            this.allTimeTracks = { ...data.allTimeTracks };
            this.allTimeArtists = { ...data.allTimeArtists };
            this.currentArtists = { ...data.currentArtists };

            const config = {
              allTimeTrackIDs: this.allTimeTracks.allTimeTrackIDs,
              currentTrackIDs: this.currentTracks.currentTrackIDs
            };
            this.topGenres = this.obscurifyFunc.findTopGenres(this.allTimeArtists.allTimeArtists);

            this.spotifyService.getAudioFeatures(config).subscribe((audioFeatures: any) => {
                if (audioFeatures && audioFeatures.length === 2) {
                    this.longTermAudioFeatures = this.obscurifyFunc.calculateAudioFeatureAverages(audioFeatures[0].audio_features);
                    this.shortTermAudioFeatures = this.obscurifyFunc.calculateAudioFeatureAverages(audioFeatures[1].audio_features);
                    this.shortTermAudioFeaturesPerTrack = audioFeatures[1].audio_features;
                }
            });

            this.obscurifyService.getObscurifyData(
              this.user.country,
              this.allTimeArtists.allTimeObscurifyScore,
              this.currentArtists.recentObscurifyScore).subscribe(
                (obscurifyData: any) => {
                  if (obscurifyData.error) {
                    this.router.navigate(['login', { serverError: true }]);
                  } else {
                    this.obscurifyInfo = { ...obscurifyData };
                  }
              }
            );
          }
        });
      }
    });
  }

  switchCountry(countryCode) {
    this.obscurifyService.getObscurifyData(
      countryCode,
      this.allTimeArtists.allTimeObscurifyScore,
      this.currentArtists.recentObscurifyScore).subscribe(
        (obscurifyData: any) => {
          if (obscurifyData.error) {
            this.router.navigate(['login', { serverError: true }]);
          } else {
            this.obscurifyInfo = { ...obscurifyData };
            this.user.country = countryCode;
          }
      }
    );
  }

  getUserHistory(val) {
    const getUserHistoryBody = {
      hex: this.tokenSvc.oAuthToken.obscurifyToken,
      userID: this.user.id
    };

    this.obscurifyService.getUserHistory(getUserHistoryBody).subscribe((res: any) => {
      if (!res.error && res.userHistory != undefined) {
        this.userHistory = [...res.userHistory];
        for (let history of this.userHistory) {
          let tempDate = history.formattedDate;
          if (tempDate.length > 2) {
            tempDate = tempDate.slice(0, tempDate.length - 2) + "'" + tempDate.slice(tempDate.length - 2);
          }
          history.formattedDate = tempDate;
        }
      }
      const saveUserHistoryBody = {
        country: this.user.country,
        userID: this.user.id,
        longTermArtistIDs: this.allTimeArtists.allTimeArtistIDs,
        longTermTrackIDs: this.allTimeTracks.allTimeTrackIDs,
        obscurifyScore: this.allTimeArtists.allTimeObscurifyScore,
        longTermAudioFeatures: val,
        shortTermArtistIDs: this.currentArtists.currentArtistIDs,
        shortTermTrackIDs: this.currentTracks.currentTrackIDs,
        hex: this.tokenSvc.oAuthToken.obscurifyToken
      };
      this.obscurifyService.saveUserHistory(saveUserHistoryBody).subscribe((res: any) => {
        if (res.error) {
          this.snkBar.open('Server Error. Could not save history.', '' , {
            duration: 5000,
            panelClass: 'panel-error',
          verticalPosition: 'top'
        });
        } else {
          // console.log('Save History', res);
        }
      });
    });
  }

  loadEvent(val) {
    this.loaded = val;
  }

}
