import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { SpotifyAuthResponse } from '../shared/spotify-auth-response.i';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class TokenService {

  constructor(public cookieService: CookieService) {}

  private token = '';
  private token$ = new BehaviorSubject(this.token);

  public get oAuthToken(): string {
    return this.token;
  }

  public clearToken(): void {
    this.token = '';
    this.token$.next(this.token);
  }

  public get authHeader(): {[name: string]: string} {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }

  public get authTokens(): Observable<string> {
    return this.token$.asObservable();
  }

  public setAuthTokenCache(tokenCookie): boolean {
    if (!!tokenCookie) {
      this.token = tokenCookie;
    } else {
      this.token = '';
    }
    this.token$.next(this.token);
    return !!this.token;
  }

  public setAuthToken(spotifyResponse: SpotifyAuthResponse): boolean {
    if (!!spotifyResponse && !!spotifyResponse.access_token) {
      console.log('Spotify Repsonse', spotifyResponse);
      console.log('Spotify Time', spotifyResponse.expires_in);

      const now = new Date();
      now.setTime(now.getTime() + 1 * Number(spotifyResponse.expires_in) * 1000);
      this.cookieService.set('spotifyResponse', spotifyResponse.access_token, now);
      this.token = spotifyResponse.access_token;
    } else {
      this.token = '';
    }
    this.token$.next(this.token);
    return !!this.token;
  }

}
