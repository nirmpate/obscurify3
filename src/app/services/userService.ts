import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { lodash } from 'lodash-es';

export interface UserState {
    userImageUrl?: string;
    profileCode?: string;
    userName?: string;
    userId?: string;
    profileUrl?: string;
}
@Injectable()
export class UserService {
    constructor() {
        let localUserProfile;
        if (window) {
            localUserProfile = JSON.parse(window.localStorage.getItem('userProfile'));
            if (localUserProfile) {
                this.setUserState(localUserProfile);
            }
        }
    }

    private userState: UserState = {
        userImageUrl: '',
        profileCode: '',
        userName: '',
        userId: '',
    };

    private user$ = new BehaviorSubject(this.userState);

    public getUserState() {
        return this.userState;
    }

    public userStateSub(): Observable<any> {
        return this.user$.asObservable();
    }

    public setUserState(config: UserState) {
        this.userState = {
            userImageUrl: lodash.get(config, 'userImageUrl', this.userState.userImageUrl),
            userName: lodash.get(config, 'userName', this.userState.userName),
            userId: lodash.get(config, 'userId', this.userState.userId),
            profileCode: lodash.get(config, 'profileCode', this.userState.profileCode)
        };

        if (window) {
            window.localStorage.setItem('userProfile', JSON.stringify(this.userState));
        }

        this.user$.next(this.userState);
    }

}
