import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';


@Injectable()
export class ObscurifyService {
    constructor(public http: HttpClient) {}

    private obscurifyData = {};
    private obscurifyData$: BehaviorSubject<{}>;

    public obscurifyUrl = 'https://ktp0b5os1g.execute-api.us-east-2.amazonaws.com/dev';

    getObscurifyData(countryID, obscurifyScore): Observable<{}> {
        return this.http.get(this.obscurifyUrl + '/getObscurifyData', {
            headers: new HttpHeaders({
                code: countryID,
                obscurifyScore: (obscurifyScore),
                Authorization: 'Basic'
            })
        }).pipe(
            tap((data: {}) => {
              console.log('user info', data);
              this.obscurifyData = {...data};
              this.obscurifyData$.next(this.obscurifyData);
            }),
            catchError(this.handleError('Error')
            )
          );
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
          (result as any) = error;
          return of(result as T);
        };
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

export default ObscurifyService;
