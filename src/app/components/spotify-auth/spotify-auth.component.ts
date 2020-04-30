import { Component, OnInit } from '@angular/core';
import { AuthService, TokenService } from 'src/app/services/spotifyAuth';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-spotify-auth',
  template: `<h3>Authorizing&hellip;</h3>`,
  styles: [``]
})
export class SpotifyAuthComponent implements OnInit {

  public constructor(private authService: AuthService, private cookieService: CookieService, private tknService: TokenService) {

  }

  public ngOnInit(): void {
    // Send it back to app home
    this.authService.authorized();
  }
}
