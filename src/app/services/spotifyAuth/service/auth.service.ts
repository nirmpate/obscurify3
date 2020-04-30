import { Injectable } from '@angular/core';

import { AuthConfig } from '../shared/spotify-auth-config.i';
import { ScopesBuilder } from '../shared/scopes-builder';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthService {

  constructor(public cookieService: CookieService) {}

  private requestAuthUrl = 'https://accounts.spotify.com/authorize';
  private authorized$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  private authConfig: AuthConfig = {
    client_id: '3af5f43840144db2a5ef883b56c5fb7e',  // WebPortal App Id. Shoud be config
    response_type: 'token',
    redirect_uri: 'http://localhost:3000/authorized',  // My URL
    state: '',
    show_dialog: true,
    scope: new ScopesBuilder().build()
  };

  public authorize() {
    console.log('authorize()');
    const tokenCookie = this.cookieService.get('spotifyResponse');
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
