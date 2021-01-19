import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { lodash } from 'lodash-es';

@Injectable()
export class UserService {
    constructor() {}

    private userState = {
        userImageUrl: '',
        isProfilePublic: '',
        userName: '',
        profileUrL: ''
    };

    private user$ = new BehaviorSubject(this.userState);

    public getUserState() {
        return this.userState;
    }

    public userStateSub(): Observable<any> {
        return this.user$.asObservable();
    }

    public setUserState(config) {
        this.userState = {
            userImageUrl: lodash.get(config, 'userImageUrl', ''),
            isProfilePublic: lodash.get(config, 'isProfilePublic', ''),
            userName: lodash.get(config, 'userName', ''),
            profileUrL: lodash.get(config, 'profileUr;', '')
        };

        this.user$.next(this.userState);
    }

}
