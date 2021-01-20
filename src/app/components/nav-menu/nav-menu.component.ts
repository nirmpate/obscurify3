import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/spotifyAuth';
import { UserService, UserState } from 'src/app/services/userService';
import { ShareProfileComponent } from '../share-profile/share-profile.component';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent implements OnInit {

  userImage: string;
  userState: UserState;
  @ViewChild('dialog') dialogTemp: TemplateRef<any>;

  constructor(
    private tokenSvc: TokenService,
    private userService: UserService,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.userService.userStateSub().subscribe((userState: UserState) => {
      this.userState = userState;
      this.userImage = userState.userImageUrl;
    });
  }

  public logout() {
    this.tokenSvc.clearToken();
    window.open('https://www.spotify.com/logout', '_blank');
    this.router.navigate(['login']);
  }

  public openShareDialog() {
    this.dialog.open(ShareProfileComponent).componentInstance.userState = this.userState;
  }
}
