import { Component, OnInit } from '@angular/core';
import { TokenService, AuthService } from '../../services/spotifyAuth';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { InfoService } from '../../services/infoService';
import { Subscription } from 'rxjs';
import ObscurifyService from 'src/app/services/obscurifyService';

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
    public obscurifyService: ObscurifyService
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

    stream.subscribe((user: any ) => {

    });
    this.infoSvc.getUserStream().subscribe((user: any) => {
      if (user.userInfo && user.allTimeObscurifyScore) {
        this.obscurifyService.getObscurifyData(user.userInfo.country, user.allTimeObscurifyScore, user.recentObscurifyScore).subscribe(
          (data) => {
            console.log('obscurify data', data);
          }
        );
      }
    });

  }

}
