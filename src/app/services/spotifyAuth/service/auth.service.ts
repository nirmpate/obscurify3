import { Injectable } from '@angular/core';

import { AuthConfig } from '../shared/spotify-auth-config.i';
import { ScopesBuilder } from '../shared/scopes-builder';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

import { environment } from '../../../../environments/environment'

@Injectable()
export class AuthService {

  constructor(public cookieService: CookieService) {}

  private requestAuthUrl = 'https://accounts.spotify.com/authorize';
  private authorized$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private state = this.generateRandomString();

  private authConfig: AuthConfig = {
    client_id: environment.client_id,  // WebPortal App Id. Shoud be config
    response_type: 'code',
    redirect_uri: environment.redirect_uri, // My URL
    state: this.state,
    show_dialog: false,
    scope: 'user-read-private user-top-read playlist-modify-public playlist-modify-private'

  };

  private generateRandomString() {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 16; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

  public authorize() {
    console.log('authorize()');
    console.log(this.buildAuthUrl())
    this.cookieService.set('spotify_auth_state', this.state)
    window.location.href = this.buildAuthUrl();
  }

  // Signal someone, that router can navigate somewhere
  public authorized(): void {
    console.log('Called auth');
    this.authorized$.next(true);
  }

  public get authorizedStream(): Observable<boolean> {
    return this.authorized$.asObservable();
  }

  public configure(config: AuthConfig): AuthService {
    // Validate Config
    this.authConfig = config;
    return this;
  }

  private buildAuthUrl(): string {

    const params = [];
    for (const [key, value] of Object.entries(this.authConfig)) {
      if (typeof (value) === 'object') {
        params.push(`${key}=${(value as string[]).join(' ')}`);
      } else {
        params.push(`${key}=${value}`);
      }
    }

    return `${this.requestAuthUrl}?${params.join('&')}`;
  }
}
