import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/spotifyAuth';
import { UserService, UserState } from 'src/app/services/userService';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent implements OnInit {

  userImage: string;

  constructor(private tokenSvc: TokenService, private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.userService.userStateSub().subscribe((userState: UserState) => {
      this.userImage = userState.userImageUrl;
    });
  }

  public logout() {
    this.tokenSvc.clearToken();
    window.open('https://www.spotify.com/logout', '_blank');
    this.router.navigate(['login']);
  }

}
