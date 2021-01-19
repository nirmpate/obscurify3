import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/spotifyAuth';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent implements OnInit {

  constructor(private tokenSvc: TokenService, private router: Router) { }

  ngOnInit(): void {
    this.tokenSvc.authTokens.subscribe(user => {
      console.log('nav menu item', user);
    })
  }

  public logout() {
    this.tokenSvc.clearToken();
    window.open('https://www.spotify.com/logout', '_blank');
    this.router.navigate(['login']);
  }

}
