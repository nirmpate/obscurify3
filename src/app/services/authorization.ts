import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
class SpotAuthService {
    private scope = 'user-read-private user-top-read playlist-modify-public playlist-modify-private';

    private requestAuthUrl = 'https://accounts.spotify.com/authorize';
    private authorized$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private authConfig = {
        client_id: '3af5f43840144db2a5ef883b56c5fb7e',  // WebPortal App Id. Shoud be config
        response_type: 'token',
        redirect_uri: 'http://localhost:3000/authorized',  // My URL
        state: '',
        show_dialog: true,
        scope: this.scope
      };


    constructor() {

    }

    public authorize() {
        window.location.href = this.buildAuthUrl();
      }

    private buildAuthUrl(): string {

        const params = [];
        for (const [key, value] of Object.entries(this.authConfig)) {
            if (typeof(value) === 'object') {
                params.push(`${key}=${(value as string[]).join(' ')}`);
            } else {
                params.push(`${key}=${value}`);
            }
        }

        return `${this.requestAuthUrl}?${params.join('&')}`;
    }

    // Signal someone, that router can navigate somewhere
    public authorized(): void {
        this.authorized$.next(true);
    }

    public get authorizedStream(): Observable<boolean> {
        return this.authorized$.asObservable();
    }

    public configure(config) {
    // Validate Config
        this.authConfig = config;
        return this;
    }

}

export default SpotAuthService;

