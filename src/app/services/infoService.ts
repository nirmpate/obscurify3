import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BehaviorSubject } from 'rxjs';


import { Router } from '@angular/router';
import { tap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import ObscurityFuncs from '../utilities/obscurityFuncs';

@Injectable()
export class InfoService {

  private apiUserUrl: string = 'https://api.spotify.com/v1/me';
  private apiAllTimeArtists = 'https://api.spotify.com/v1/me/top/artists?limit=50&time_range=long_term';
  private apiCurrentArtists = 'https://api.spotify.com/v1/me/top/artists?limit=50&time_range=short_term';
  private apiAllTimeTracks = 'https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=long_term';
  private apiCurrentTracks = 'https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=short_term';

  private user = {};
  private user$: BehaviorSubject<{}>;

  constructor(
    private http: HttpClient,
    private router: Router,
    private obscurifyFuncs: ObscurityFuncs) {
    this.user$ = new BehaviorSubject<{}>(this.user);
  }

  public fetchUserInfo(): Observable<{}> {
    return this.http.get(this.apiUserUrl).pipe(
      tap((user: {}) => {
        console.log('user info', user);
        this.user = {
          ...this.user,
            userInfo: user
        };
        this.user$.next(this.user);
      }),
      catchError(this.handleError('getSelf'))
    );
  }

  public fetchAllTimeTracks(): Observable<{}> {
    return this.http.get(this.apiAllTimeTracks).pipe(
      tap((tracks: {items: [{id: string, popularity: number}]}) => {

        const allTimeTrackIDs = [];

        for (const track of tracks.items) {
          allTimeTrackIDs.push(track.id);
        }

        console.log('info service', tracks.items);

        this.user = {
          ...this.user,
          allTimeTracks: tracks.items,
          allTimeTrackIDs: [...allTimeTrackIDs]
        };
        this.user$.next(this.user);
      }),
      catchError(this.handleError('getSelfAlbums'))
    );
  }

  public fetchCurrentTracks(): Observable<{}> {
    return this.http.get(this.apiCurrentTracks).pipe(
      tap((tracks: {items: [{id: string, popularity: number}]}) => {
        const currentTrackIDs = [];
        for (const track of tracks.items) {
          currentTrackIDs.push(track.id);
        }
        this.user = {
          ...this.user,
          currentTracks: tracks.items,
          currentTrackIDs: [...currentTrackIDs]
        };
        this.user$.next(this.user);
      }),
      catchError(this.handleError('getSelfAlbums'))
    );
  }

  public fetchAllTimeArtists(): Observable<{}> {
    return this.http.get(this.apiAllTimeArtists).pipe(
      tap((artists: {items: [{id: string, popularity: number, genres: []}]}) => {
        let allTimeObscurifyScore = 0;
        const genres: any = {};
        const topGenres: any = [];
        const allTimeArtistIDs = [];

        // Loop Through All Time Artists
        // Get Obscure Score and Top Genres
        for (let i = 0; i < artists.items.length; i++) {

          allTimeObscurifyScore = allTimeObscurifyScore + (50 / artists.items.length) *
            Math.floor(artists.items[i].popularity * (1 - i / artists.items.length));

          allTimeArtistIDs.push(artists.items[i].id);

          for (let y = 0; y < artists.items[i].genres.length; y++) {
            if (genres[artists.items[i].genres[y]] != null) {
              genres[artists.items[i].genres[y]] = genres[artists.items[i].genres[y]] + 1;
            } else {
              genres[artists.items[i].genres[y]] = 1;
            }
          }
        }

        for (const g in genres) {
          if (genres.hasOwnProperty(g)) {
            topGenres.push([g, genres[g]]);
          }
        }

        topGenres.sort(this.obscurifyFuncs.comparator);


        allTimeObscurifyScore =  Math.floor(allTimeObscurifyScore / 10);
        this.user = {
          ...this.user,
          allTimeArtists: artists.items,
          allTimeObscurifyScore: (allTimeObscurifyScore),
          topGenres: (topGenres),
          allTimeArtistIDs: (allTimeArtistIDs)
        };
        this.user$.next(this.user);
      }),
      catchError(this.handleError('getSelfAlbums'))
    );
  }

  public fetchCurrentArtists(): Observable<{}> {
    return this.http.get(this.apiCurrentArtists).pipe(
      tap((artists: {items: [{id: string, popularity: any}]}) => {
        let recentObscurifyScore = 0;
        const currentArtistsIDs = [];

        for (let i = 0; i < artists.items.length; i++) {

          currentArtistsIDs.push(artists.items[i]);

          recentObscurifyScore = recentObscurifyScore + (50 / artists.items.length) *
            Math.floor(artists.items[i].popularity * (1 - i / artists.items.length));
        }

        recentObscurifyScore = Math.floor(recentObscurifyScore / 10);

        this.user = {
          ...this.user,
          currentArtistsIDs: [...currentArtistsIDs],
          currentArtists: artists.items,
          recentObscurifyScore: (recentObscurifyScore)
        };

        this.user$.next(this.user);
      }),
      catchError(this.handleError('getSelfAlbums'))
    );
  }

  public fetchRecommendations(): Observable<{}> {
    return this.http.get(this.apiCurrentArtists).pipe(
      tap((artists: {}) => {
        this.user = {
          ...this.user,
          currentArtists: artists
        };
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
