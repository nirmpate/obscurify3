import { Component, OnInit } from '@angular/core';
import { AuthService, AuthConfig, TokenService } from '../../services/spotifyAuth/index';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private tokenSvc: TokenService,
    private router: Router,
    private cookieService: CookieService
  ) { }

  ngOnInit() {
    if (!!this.tokenSvc.oAuthToken) {
      this.router.navigate(['home']);
    }
  }

  public login(): void {
    const cookie = this.cookieService.get('spotifyResponse');

    if (cookie) {
      this.tokenSvc.setAuthTokenCache(cookie);
      this.authService.authorized();
    } else {
      this.authService.authorize();
    }
  }
}
