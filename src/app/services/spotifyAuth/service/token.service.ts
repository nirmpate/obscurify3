import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class TokenService {

  constructor() {}

  private token = {
    spotifyToken: '',
    obscurifyToken: '',
    state: ''
  };

  private token$ = new BehaviorSubject(this.token);

  public get oAuthToken(): any {
    return this.token;
  }

  public clearToken(): void {
    this.token = {
      spotifyToken: '',
      obscurifyToken: '',
      state: ''
    };
    this.token$.next(this.token);
  }

  public get authHeader(): {[name: string]: string} {
    return this.token.spotifyToken ? { Authorization: `Bearer ${this.token.spotifyToken}` } : {};
  }

  public get authTokens(): Observable<any> {
    return this.token$.asObservable();
  }

  public resetState() {
      this.token.state = "";
  }

  public setAuthToken(spotifyResponse: any): boolean {
    if (!!spotifyResponse && !!spotifyResponse.spotifyToken && !!spotifyResponse.obscurifyToken) {
      this.token.spotifyToken = spotifyResponse.spotifyToken;
      this.token.obscurifyToken = spotifyResponse.obscurifyToken;
      this.token.state = spotifyResponse.state;
    } else {
      this.token = {
        spotifyToken: '',
        obscurifyToken: '',
        state: ''
      };
    }
    this.token$.next(this.token);
    return !!this.token;
  }

}
