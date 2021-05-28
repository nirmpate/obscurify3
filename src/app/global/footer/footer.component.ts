import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService, AuthService } from 'src/app/services/spotifyAuth';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  @Input() login;
  @Input() spotlight;
  @Input() privacy;
  @Input() about;

  userProfile: any;

  constructor(
    public router: Router,
    public tokenSvc: TokenService,
    private authService: AuthService
    ) { }


  ngOnInit() {
    this.userProfile = JSON.parse(window.localStorage.getItem('userProfile'));
    if (this.userProfile) {
      this.login = false;
    }
  }

  logout() {
    this.tokenSvc.clearToken();
    window.open('https://www.spotify.com/logout', '_blank');
    this.router.navigate(['login']);
  }

  public authorize(): void {
    this.authService.authorize();
  }

}
