import { Component, OnInit } from '@angular/core';
import { TokenService, AuthService } from '../../services/spotifyAuth';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { InfoService } from '../../services/infoService';
import { Subscription} from 'rxjs';
import { combineLatest } from 'rxjs/index';
import ObscurifyService from 'src/app/services/obscurifyService';
import { SpotifyService } from 'src/app/services/spotifyService';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],

})
export class HomeComponent implements OnInit {

  constructor(
    public tokenSvc: TokenService,
    public cookieService: CookieService,
    public router: Router,
    public infoSvc: InfoService,
    public authService: AuthService,
    public obscurifyService: ObscurifyService,
    public spotifyService: SpotifyService
  ) { }
  private stream: Subscription | null = null;

  public bgColor = '#A9E5AC';

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
    const cookie = this.cookieService.get('spotifyResponse');

    if (cookie || this.tokenSvc.oAuthToken.spotifyToken) {
      this.tokenSvc.setAuthTokenCache(cookie);
      this.authService.authorized();
    } else {
      this.tokenSvc.clearToken();
      this.router.navigate(['login']);
    }

    const stream = this.tokenSvc.authTokens.pipe((x) => {
      return this.infoSvc.fetchUserInfo();
    });

    stream.subscribe((user: any ) => {
      if (user.error && user.error.error.status === 401) {
        console.log('Token Expired');
        this.router.navigate(['login']);
      } else {
        this.user = user;
        // Get the rest of Spotify Data

        const trackStream = combineLatest([
          this.infoSvc.fetchAllTimeTracks(),
          this.infoSvc.fetchCurrentTracks()
        ]).pipe(map(([a$, b$]) => ({
          allTimeTracks: a$,
          currentTracks: b$
        })));

        trackStream.subscribe((data: any) => {
          if (!data.allTimeTracks.error || !data.currentTracks.error) {
            this.currentTracks = { ...data.currentTracks };
            this.allTimeTracks = { ...data.allTimeTracks };

            const config = {
              allTimeTrackIDs: this.allTimeTracks.allTimeTrackIDs,
              currentTrackIDs: this.currentTracks.currentTrackIDs
            };

            this.spotifyService.getAudioFeatures(config).subscribe((audioFeatures) => {
              this.audioFeatures = audioFeatures;
            });
          }
        });

        const artistStream = combineLatest([
          this.infoSvc.fetchAllTimeArtists(),
          this.infoSvc.fetchCurrentArtists()]).pipe(map(([a$, b$]) => ({
            allTimeArtists: a$,
            currentArtists: b$,
          })));

        artistStream.subscribe((data: any) => {
          if (!data.allTimeArtists.error || !data.currentArtists.error) {

            this.currentArtists = { ...data.currentArtists };
            this.allTimeArtists = { ...data.allTimeArtists };

            this.obscurifyService.getObscurifyData(
              this.user.country,
              this.allTimeArtists.allTimeObscurifyScore,
              this.currentArtists.recentObscurifyScore).subscribe(
                (obscurifyData: any) => {
                  if (obscurifyData.error) {
                    console.log('Obscurify Server Error');
                  } else {
                    console.log('Obscurify info', obscurifyData);
                    this.obscurifyInfo = { ...obscurifyData };
                  }
              }
            );
          }
        });
      }
    });

    /*
      Obscurify Info


    */

    // this.infoSvc.getUserStream().subscribe((user: any) => {
    //   this.user = {...user};

    //   if (user.userInfo && user.allTimeObscurifyScore) {
    //     this.obscurifyService.getObscurifyData(user.userInfo.country, user.allTimeObscurifyScore, user.recentObscurifyScore).subscribe(
    //       (data: any) => {
    //         if (data.error) {
    //           console.log('Obscurify Server Error');
    //         } else {
    //           this.obscurifyInfo = { ...data };
    //         }
    //       }
    //     );
    //   }

    //   if (this.user.allTimeTrackIDs && this.user.currentTrackIDs) {
    //     const config = {
    //       allTimeTrackIDs: this.user.allTimeTrackIDs,
    //       currentTrackIDs: this.user.currentTrackIDs
    //     };

    //     this.spotifyService.getAudioFeatures(config).subscribe((data) => {
    //       this.audioFeatures = data;
    //     });
    //   }
    // });
  }

}
