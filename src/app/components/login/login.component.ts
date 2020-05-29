import { Component, OnInit } from '@angular/core';
import { AuthService, AuthConfig, TokenService } from '../../services/spotifyAuth/index';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private tokenSvc: TokenService,
    private router: Router) { }

  ngOnInit() {
    if (!!this.tokenSvc.oAuthToken.spotifyToken) {
      this.router.navigate(['home']);
    }
  }

  public login(): void {
    this.authService.authorize();
  }
}
