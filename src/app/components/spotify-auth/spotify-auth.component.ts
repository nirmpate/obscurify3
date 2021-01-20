import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService, TokenService } from 'src/app/services/spotifyAuth';
import { UserService } from 'src/app/services/userService';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-spotify-auth',
  template: `<h3>Authorizing&hellip;</h3>`,
  styles: [``]
})
export class SpotifyAuthComponent implements AfterViewInit {

  public constructor(private userService: UserService, private authService: AuthService, private atr: ActivatedRoute) {

  }

  public ngAfterViewInit() {
    const params = this.atr.snapshot.queryParams;

    this.userService.setUserState({
      profileCode: params.shareCode
    });
    this.authService.authorized();
  }
}
