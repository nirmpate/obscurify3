import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class TokenService {

  constructor() {
      let localUserToken;

      if (window) {
          localUserToken = JSON.parse(window.localStorage.getItem('userToken'));
          if (localUserToken) {
              this.setAuthTokenFromStorage(localUserToken);
          }
      }
  }

  private token = {
    spotifyToken: '',
    obscurifyToken: '',
    state: '',
    spotifyTokenRefresh: null
  };

  private token$ = new BehaviorSubject(this.token);

  public get oAuthToken(): any {
    return this.token;
  }

  public clearToken(): void {
    this.token = {
      spotifyToken: '',
      obscurifyToken: '',
      state: '',
      spotifyTokenRefresh: null
    };
    window.localStorage.removeItem('userToken');
    window.localStorage.removeItem('userProfile');
    this.token$.next(this.token);
  }

  public get authHeader(): {[name: string]: string} {
    return this.token.spotifyToken ? { Authorization: `Bearer ${this.token.spotifyToken}` } : {};
  }

  public get authTokens(): Observable<any> {
    return this.token$.asObservable();
  }

  public resetState() {
      this.token.state = '';
      window.localStorage.setItem('userToken', JSON.stringify(this.token));
  }

  setState(state) {
      this.token.state = state;
      window.localStorage.setItem('userToken', JSON.stringify(this.token));
  }


    public setAuthTokenFromStorage(localResponse: any): boolean {
      if (!!localResponse &&
          !!localResponse.spotifyToken &&
          !!localResponse.obscurifyToken &&
          !!localResponse.spotifyTokenRefresh
      ) {
        const date = new Date();
        this.token.spotifyToken = localResponse.spotifyToken;
        this.token.obscurifyToken = localResponse.obscurifyToken;
        this.token.state = localResponse.state;
        this.token.spotifyTokenRefresh = localResponse.spotifyTokenRefresh;

        if (window) {
          window.localStorage.setItem('userToken', JSON.stringify(this.token));
        }
      } else {
        this.token = {
          spotifyToken: '',
          obscurifyToken: '',
          state: '',
          spotifyTokenRefresh: null
        };
        window.localStorage.removeItem('userToken');
      }
      this.token$.next(this.token);
      return !!this.token;
    }


  public setAuthTokenFromSpotify(spotifyResponse: any): boolean {
    if (!!spotifyResponse &&
        !!spotifyResponse.spotifyToken &&
        !!spotifyResponse.obscurifyToken &&
        !!spotifyResponse.expiresIn
    ) {
      const date = new Date();
      this.token.spotifyToken = spotifyResponse.spotifyToken;
      this.token.obscurifyToken = spotifyResponse.obscurifyToken;
      this.token.state = spotifyResponse.state;
      this.token.spotifyTokenRefresh = date.setTime(date.getTime() + spotifyResponse.expiresIn * 1000);

      if (window) {
        window.localStorage.setItem('userToken', JSON.stringify(this.token));
      }
    } else {
      this.token = {
        spotifyToken: '',
        obscurifyToken: '',
        state: '',
        spotifyTokenRefresh: null
      };
      window.localStorage.removeItem('userToken');
    }
    this.token$.next(this.token);
    return !!this.token;
  }

}
