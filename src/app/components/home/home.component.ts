import { Component, OnInit } from '@angular/core';
import { TokenService, AuthService } from '../../services/spotifyAuth';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { InfoService } from '../../services/infoService';
import { Subscription } from 'rxjs';

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
    public authService: AuthService
  ) { }
  private stream: Subscription | null = null;

  public bgColor = '#A9E5AC';

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

    if (cookie || this.tokenSvc.oAuthToken) {
      this.tokenSvc.setAuthTokenCache(cookie);
      this.authService.authorized();
    } else {
      this.tokenSvc.clearToken();
      this.router.navigate(['login']);
    }
    const stream = this.tokenSvc.authTokens.pipe((x) => {
      return this.infoSvc.fetchUserInfo();
    });

    this.infoSvc.getUserStream().subscribe((user) => {
      console.log('user in home', user);
    });

    this.infoSvc.fetchAllTimeArtists().subscribe((x: any) => {
      console.log('artist tracks', x);
    });


    this.infoSvc.fetchAllTimeTracks().subscribe((x: any) => {
      console.log('artist tracks', x);
    });

    this.infoSvc.fetchCurrentTracks().subscribe((x: any) => {
      console.log('artist tracks', x);
    });

    this.infoSvc.fetchCurrentArtists().subscribe((x: any) => {
      console.log('artist tracks', x);
    });

    this.infoSvc.getUserStream().subscribe((x: any) => {
      console.log('User Info::', x);
    });

  }

}
