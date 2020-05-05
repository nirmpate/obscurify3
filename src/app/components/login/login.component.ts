import { Component, OnInit } from '@angular/core';
import { AuthService, AuthConfig, TokenService } from '../../services/spotifyAuth/index';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  template: `
  <span>Login with</span>
  <div class="img-container">
    <a (click)="login($event)"> Login </a>
  </div>`,
  styles: [`
  :host{
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
    margin: auto;
    text-align: center;
    outline: dashed beige thin;
    background: white;
    width: 25%;
    padding: 1rem 4rem;
    margin-top: 10%;
}
.img-container{
    margin: 3rem 0;
}
.img-container img{
    min-width: 70px;
    width: 70%;
    object-fit: contain;
}
.img-container:hover{
    cursor: pointer;
    object-fit: contain;
}
span{
    font-size: x-large;
    font-weight: bold;
    flex: 1 auto;
}
label:hover{
    text-decoration: underline;
    color: blue;
    cursor: pointer;
}
  `]
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
