import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform } from '@angular/cdk/platform';


@Injectable()
export class SpotifyProvider {

  token = '';
  doneLoading = false;
  userData: any;

  constructor(
      public http: HttpClient,
      public platform: Platform) {
  }

    getRecommendations(config) {
      let url;
      if (config.allTimeArtistIDs && config.allTimeTrackIDs) {
        url = 'https://api.spotify.com/v1/recommendations?seed_artists?country=' + ',' +
        config.allTimeArtistIDs[Math.floor(Math.random() * config.allTimeArtistIDs.length)] +
        config.currentArtistsIDs[Math.floor(Math.random() * config.currentArtistsIDs.length)] + '&seed_tracks='
        + config.allTimeTrackIDs[Math.floor(Math.random() * config.allTimeTrackIDs.length)] + ','
            + config.currentTrackIDs[Math.floor(Math.random() * config.currentTrackIDs.length)]
                + '&market=' + config.country + '&max_popularity=55' + '&min_popularity=25' + '&limit=16';
      } else {
        url = 'https://api.spotify.com/v1/recommendations?seed_artists?country=' + ',' +
        config.currentArtistsIDs[Math.floor(Math.random() * config.currentArtistsIDs.length)] + '&seed_tracks='
            + config.currentTrackIDs[Math.floor(Math.random() * config.currentTrackIDs.length)]
                + '&market=' + config.country + '&max_popularity=55' + '&min_popularity=25' + '&limit=16';
      }

      return new Promise((resolve, reject) => {
        this.http.get(url).subscribe((data: any) => {
          resolve(data);
        }, err => {
          reject(err);
        });
      });
    }

    makePlaylist(config) {
      const {userID, token, playlistName, tracks} = config;
      const url =  'https://api.spotify.com/v1/users/' + userID + '/playlists';
      const headers = new HttpHeaders()
            .set('Authorization',  'Bearer ' + token)
            .set('Accept', 'application/json');

      const that = this;
      return new Promise((resolve, reject) => {
        this.http.post(url, { name: playlistName }, { headers: (headers) }).subscribe((data: any) => {
          resolve(data);
          const uriArray = [];
          const playlistID = data.id;

          for (const track of tracks) {
            uriArray.push(track.uri);
          }
          that.fillPlaylistWithTracks(config, uriArray, playlistID);
        }, (err) => {
          reject(err);
        });
      });
    }


    fillPlaylistWithTracks(config, uriArray: any[], playlistID: string) {
      const url =  'https://api.spotify.com/v1/users/' + config.userID + '/playlists/' + playlistID + '/tracks';
      const headers = new HttpHeaders()
            .set('Authorization',  'Bearer ' )
            .set('Accept', 'application/json');
      return new Promise((resolve, reject) => {
        this.http.post(url, { uris: uriArray }, { headers: (headers) }).subscribe((data: any) => {
          resolve(data);

        }, (err) => {
          reject(err);
        });
      });
    }


    // getHistoryIDs() {
    //   if (this.userData.userHistory == null || this.userData.userHistory.length == 0) {
    //     let url = 'https://obscurifymusic.com/api/getUserHistory?userID=' + this.userData.userID + '&hex=' + this.userData.hex;
    //     return new Promise(resolve => {
    //       this.http.get(url).subscribe((data : any) => {
    //         resolve(data);
    //         this.userData.userHistory = data;
    //       }, err => {
    //         console.log('rest.ts', err);
    //       });
    //     });
    //   } else {
    //     return new Promise(resolve => {
    //       resolve({'status' : 'history already retrieved'})
    //     })
    //   }
    // }


    // getHistoryItems(history: any){
    //   let url = 'https://obscurifymusic.com/spotifyData/getHistoryItems?artistIDs=' + history.shortTermArtistIDs.join() +
    //     '&trackIDs=' + history.shortTermTrackIDs.join() +
    //     '&accessToken=' + this.token;

    //   return new Promise(resolve => {
    //     this.http.get(url).subscribe((data : any) => {
    //       resolve(data);
    //     }, err => {
    //       console.log('rest.ts', err);
    //     });
    //   });
    // }

}
