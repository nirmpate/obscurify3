import { Component, OnInit } from '@angular/core';
import { AuthService, AuthConfig, TokenService } from '../../services/spotifyAuth/index';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public serverError;
  constructor(
    private authService: AuthService,
    private tokenSvc: TokenService,
    private router: Router,
    private snkBar: MatSnackBar) { }

  ngOnInit() {
    if (this.serverError) {
      this.snkBar.open('Server Error. Please Try Again Later.', '' , { duration: 5000, panelClass: 'panel-error'});
    }
    if (!!this.tokenSvc.oAuthToken.spotifyToken) {
      this.router.navigate(['home']);
    }
  }

  public login(): void {
    this.authService.authorize();
  }
}
