import { Token } from '@angular/compiler/src/ml_parser/lexer';
import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ObscurifyService } from 'src/app/services/obscurifyService';
import { TokenService } from 'src/app/services/spotifyAuth';
import { UserService, UserState } from 'src/app/services/userService';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-share-profile',
  templateUrl: './share-profile.component.html',
  styleUrls: ['./share-profile.component.scss']
})
export class ShareProfileComponent implements OnInit, OnDestroy {

  @Input() userState: UserState;

  public userProfileUrl = '';
  public checked;
  public userSub: Subscription;
  constructor(public userService: UserService, public obscurifyService: ObscurifyService, public tokenSvc: TokenService) { }

  ngOnInit(): void {
    this.checked = this.userState.profileCode ? true : false;
    if (this.userState.profileCode) {
      this.createProfileUrl();
    }

    this.userSub = this.userService.userStateSub().subscribe(userState => {
      this.userState = userState;
    });
  }

  public toggle(toggleOn: boolean) {
    const obscurifyToken = this.tokenSvc.oAuthToken.obscurifyToken;
    if (toggleOn) {
        this.obscurifyService.togglePublicProfile(
            this.userState.userId, 'y', obscurifyToken, this.userState.userName, this.userState.userImageUrl
        ).subscribe(
          (response: any) => {
            if (response.error) {
              console.log(response.error);
            } else {
              this.userService.setUserState({
                profileCode: response.shareCode
              });
              this.createProfileUrl();
              this.checked = true;
            }
        }
      );
    } else {
        this.obscurifyService.togglePublicProfile(this.userState.userId, 'n', obscurifyToken).subscribe(
          (response: any) => {
            if (response.error) {
              console.log(response.error);
            } else {
              this.userProfileUrl = '';
              this.checked = false;
            }
        }
      );
    }
  }

  createProfileUrl() {
    return this.userProfileUrl = `${environment.obscurifyBaseUrl}/user?id=${this.userState.userId}&code=${this.userState.profileCode}`;
  }

  getProfileUrl() {
    return this.userProfileUrl;
  }

  toggleChange($event) {
    this.toggle($event.checked);
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

}
