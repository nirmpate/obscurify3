import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BehaviorSubject } from 'rxjs';


import { Router } from '@angular/router';
import { tap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class InfoService {

  private apiUserUrl: string = 'https://api.spotify.com/v1/me';
  private apiAllTimeArtists = 'https://api.spotify.com/v1/me/top/artists?limit=50&time_range=long_term';
  private apiCurrentArtists = 'https://api.spotify.com/v1/me/top/artists?limit=50&time_range=short_term';
  private apiAllTimeTracks = 'https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=long_term';
  private apiCurrentTracks = 'https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=short_term';

  private user: {} = {};
  private user$: BehaviorSubject<{}>;

  constructor(
    private http: HttpClient,
    private router: Router) {
    this.user$ = new BehaviorSubject<{}>(this.user);
  }

  public fetchUserInfo(): Observable<{}> {
    return this.http.get(this.apiUserUrl).pipe(
      tap((user: {}) => {
        this.user = {
            userInfo: user
        };
        this.user$.next(this.user);
      }),
      catchError(this.handleError('getSelf'))
    );
  }

  public fetchAllTimeTracks(): Observable<{}> {
    return this.http.get(this.apiAllTimeTracks).pipe(
      tap((user: {}) => {
        this.user$.next(this.user);
      }),
      catchError(this.handleError('getSelfAlbums'))
    );
  }

  public fetchCurrentTracks(): Observable<{}> {
    return this.http.get(this.apiCurrentTracks).pipe(
      tap((user: {}) => {
        this.user$.next(this.user);
      }),
      catchError(this.handleError('getSelfAlbums'))
    );
  }

  public fetchAllTimeArtists(): Observable<{}> {
    return this.http.get(this.apiAllTimeArtists).pipe(
      tap((user: {}) => {
        this.user$.next(this.user);
      }),
      catchError(this.handleError('getSelfAlbums'))
    );
  }

  public fetchCurrentArtists(): Observable<{}> {
    return this.http.get(this.apiCurrentArtists).pipe(
      tap((user: {}) => {
        this.user$.next(this.user);
      }),
      catchError(this.handleError('getSelfAlbums'))
    );
  }


  public getUserStream(): Observable<{}> {
    return this.user$.asObservable();
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      (result as any) = error;
      return of(result as T);
    };
  }


}