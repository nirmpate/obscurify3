import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../services/spotifyAuth';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { InfoService } from '../../services/infoService';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],

})
export class HomeComponent implements OnInit {

  constructor(
    public tokenSvc: TokenService,
    public cookieService: CookieService,
    public router: Router,
    public infoSvc: InfoService
  ) { }
  private stream: Subscription | null = null;

  public bgColor = '#A9E5AC';

  setColor(val: number) {
    switch (val) {
      case 1:
        this.bgColor = '#A9E5AC';
        break;
      case 2:
        this.bgColor = '#FFA69E';
        break;
      case 3:
        this.bgColor = 'rgba(0,0,0,0.9)';
        break;
      case 4:
        this.bgColor = '#FFF';
        break;
      case 5:
        this.bgColor = '#759398';
        break;
    }
  }

  ngOnInit() {
    const stream = this.tokenSvc.authTokens.pipe((x) => {
      return this.infoSvc.fetchUserInfo();
    });

    this.stream = stream.subscribe((x: {}) =>  {
      console.log('userInfo', x);
    });

    this.infoSvc.fetchAllTimeTracks().subscribe((x: any) => {
      console.log('artist tracks', x);
    });

    this.infoSvc.fetchAllTimeArtists().subscribe((x: any) => {
      console.log('artist tracks', x);
    });

    this.infoSvc.getUserStream().subscribe((user) => {
      console.log('user', user);
    });
  }

}
