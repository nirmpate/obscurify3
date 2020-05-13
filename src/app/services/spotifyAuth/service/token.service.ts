import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class TokenService {

  constructor(public cookieService: CookieService) {}

  private token = {
    spotifyToken: '',
    obscurifyToken: ''
  };

  private token$ = new BehaviorSubject(this.token);

  public get oAuthToken(): any {
    return this.token;
  }

  public clearToken(): void {
    this.token = {
      spotifyToken: '',
      obscurifyToken: ''
    };
    this.token$.next(this.token);
  }

  public get authHeader(): {[name: string]: string} {
    return this.token.spotifyToken ? { Authorization: `Bearer ${this.token.spotifyToken}` } : {};
  }

  public get authTokens(): Observable<any> {
    return this.token$.asObservable();
  }

  // public setAuthTokenCache(tokenCookie): boolean {
  //   if (!!tokenCookie) {
  //     this.token = tokenCookie;
  //   } else {
  //     this.token = '';
  //   }
  //   this.token$.next(this.token);
  //   return !!this.token;
  // }

  public setAuthToken(spotifyResponse: any): boolean {
    if (!!spotifyResponse && !!spotifyResponse.spotifyToken && !!spotifyResponse.obscurifyToken) {
      console.log('Spotify Repsonse', spotifyResponse);
      console.log('Spotify Time', spotifyResponse.expires_in);

      const now = new Date();
      now.setTime(now.getTime() + 1 * Number(spotifyResponse.expires_in) * 1000);
      // this.cookieService.set('spotifyResponse', spotifyResponse.access_token, now);
      this.token.spotifyToken = spotifyResponse.spotifyToken;
      this.token.obscurifyToken = spotifyResponse.obscurifyToken;
    } else {
      this.token = {
        spotifyToken: '',
        obscurifyToken: ''
      };
    }
    this.token$.next(this.token);
    return !!this.token;
  }

}
