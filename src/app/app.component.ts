import { Component, OnInit } from '@angular/core';
import { TokenService, AuthService } from './services/spotifyAuth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'obscurify3';

  constructor(
    private tokenSvc: TokenService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.authorizedStream.subscribe((x: boolean) => {
      if (x) {
        this.router.navigate(['home']);
      }
    });
  }

  public getUserInfo(): void {
  }

  public logout(): void {
    this.tokenSvc.clearToken();
    this.router.navigate(['login']);
  }
}
