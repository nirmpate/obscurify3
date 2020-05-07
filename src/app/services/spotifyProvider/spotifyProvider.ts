import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform } from '@angular/cdk/platform';


@Injectable()
export class SpotifyProvider {

  token = '';
  doneLoading = false;
  userData: any;
  currentlyRecommendingArtist: any;

  constructor(
      public http: HttpClient,
      public platform: Platform) {
  }

    // getRecommendations(artistID: string, desiredObscurity: number){
    //   let url = 'https://obscurifymusic.com/spotifyData/getRecommendations?country=' + this.userData.country +
    //     "&accessToken=" + this.token + "&artistID=" + artistID + "&desiredObscurity=" + desiredObscurity;

    //   return new Promise(resolve => {
    //     this.http.get(url).subscribe((data : any) => {
    //       resolve(data);
    //       this.userData.recommendedTracks = data.recommendedTracks;
    //     }, err => {
    //       console.log('rest.ts', err);
    //     });
    //   });
    // }

    makePlaylist(config) {
      const {userID, token, playlistName, tracks} = config;
      const url =  'https://api.spotify.com/v1/users/' + userID + '/playlists';
      const headers = new HttpHeaders()
            .set('Authorization',  'Bearer ' + token)
            .set('Accept', 'application/json');

      const that = this;
      return new Promise(resolve => {
        this.http.post(url, { name: playlistName }, { headers: (headers) }).subscribe((data: any) => {
          resolve(data);
          const uriArray = [];
          const playlistID = data.id;

          for (const track of tracks) {
            uriArray.push(track.uri);
          }
          that.fillPlaylistWithTracks(config, uriArray, playlistID);
        }, err => {
          console.log('rest.ts', err);
        });
      });
    }


    fillPlaylistWithTracks(config, uriArray: any[], playlistID: string){
      const url =  'https://api.spotify.com/v1/users/' + config.userID + '/playlists/' + playlistID + '/tracks';
      const headers = new HttpHeaders()
            .set('Authorization',  'Bearer ' + config.token)
            .set('Accept', 'application/json');
      return new Promise(resolve => {
        this.http.post(url, { uris: uriArray }, { headers: (headers) }).subscribe((data : any) => {
          resolve(data);

        //   const alert = this.alertCtrl.create({
        //     title: 'Playlist created',
        //     subTitle: '"' + playlistName + '" was created in your Spotify library!',
        //     buttons: ['Great!']
        //   });

        //   alert.present();
        }, err => {
          console.log('rest.ts', err);
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
