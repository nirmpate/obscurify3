import { Component, OnInit } from '@angular/core';
import { TokenService, AuthService } from '../../services/spotifyAuth';
import { Router } from '@angular/router';
import { InfoService } from '../../services/infoService';
import { Subscription} from 'rxjs';
import { combineLatest } from 'rxjs/index';
import ObscurifyService from 'src/app/services/obscurifyService';
import { SpotifyService } from 'src/app/services/spotifyService';
import { map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    public snkBar: MatSnackBar
  ) { }
  private stream: Subscription | null = null;

  public bgColor = '#A9E5AC';
  public userHistory;
  public user: any;
  public obscurifyInfo;
  public audioFeatures;
  public allTimeArtists;
  public allTimeTracks;
  public currentArtists;
  public currentTracks;

  setColor(val: number) {
    switch (val) {
      case 1:
        this.bgColor = '#A9E5AC';
        break;
      case 2:
        this.bgColor = '#FFA69E';
        break;
      case 3:
        this.bgColor = 'rgba(0,0,0,0.9)';
        break;
      case 4:
        this.bgColor = '#FFF';
        break;
      case 5:
        this.bgColor = '#759398';
        break;
    }
  }

  ngOnInit() {
    const userStream = this.tokenSvc.authTokens.pipe((x) => {
      if (this.tokenSvc.oAuthToken.spotifyToken) {
        this.authService.authorized();
      } else {
        this.tokenSvc.clearToken();
        this.authService.authorize();
      }
      const stream = this.tokenSvc.authTokens.pipe(() => {
        return this.infoSvc.fetchUserInfo();
      });
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

            this.spotifyService.getAudioFeatures(config).subscribe((audioFeatures) => {
              this.audioFeatures = audioFeatures;
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

  getUserHistory(val) {
    const getUserHistoryBody = {
      hex: this.tokenSvc.oAuthToken.obscurifyToken,
      userID: this.user.id
    };

    this.obscurifyService.getUserHistory(getUserHistoryBody).subscribe((res) => {
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
          this.snkBar.open('Server Error. Could not save history.', '' , { duration: 5000, panelClass: 'panel-error'});
        } else {
          this.userHistory = {...res};
        }
      });
    });
  }

}
