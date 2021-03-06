import { Component, OnInit, Output, EventEmitter, ElementRef, Input, OnChanges } from '@angular/core';
import { IntersectionObserverService } from 'src/app/services/intersectionObserver';
import { InfoService } from 'src/app/services/infoService';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/spotifyAuth';
import { ObscurifyService } from 'src/app/services/obscurifyService';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Platform } from '@angular/cdk/platform';
import { environment } from '../../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { ShareProfileComponent } from '../share-profile/share-profile.component';
import { UserService, UserState } from '../../services/userService';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss'],
  providers: [IntersectionObserverService]

})
export class IntroComponent implements OnInit, OnChanges {
  @Input() data;
  @Input() hex;
  @Input() isProfilePublic;
  @Input() error;

  constructor(
    public element: ElementRef,
    public intersectionObserverService: IntersectionObserverService,
    public infoSvc: InfoService,
    public obscurifyService: ObscurifyService,
    public router: Router,
    public tokenSvc: TokenService,
    public snkBar: MatSnackBar,
    public platform: Platform,
    public dialog: MatDialog,
    ) { }

  public userImage;
  public userName;
  public welcomeMessage;
  public greeting;

  ngOnChanges(change) {
    if (!change.data.previousValue && change.data.currentValue) {
        if (this.data) {
            this.userName = this.checkName(this.data.display_name);
            this.userImage = this.data.images[0] ? this.data.images[0].url : null;
        }
        this.welcomeMessage = this.getRandomWelcomeMessage();
        this.greeting = this.getRandomGreeting();
    }
  }

  ngOnInit() {

    if (this.error) {
      this.snkBar.open('No data. Try again later.', '' , {
        duration: 5000,
        panelClass: 'panel-error',
      verticalPosition: 'top'
    });
    }
  }

  public logout() {
    this.tokenSvc.clearToken();
    window.open('https://www.spotify.com/logout', '_blank');
    this.router.navigate(['login']);
  }

  private checkName(name) {
    if (name.split(' ').length >= 2) {
      return ' ' + name.split(' ')[0] + '.';
    } else {
      const nameArray = name.split('');
      nameArray.forEach(element => {
        if (Number(element)) {
          return '!';
        }
      });
    }
  }

  public getFirstName(name) {
      if (name.split(' ').length >= 2) {
          return name.split(' ')[0];
      } else {
          return name;
      }
  }

  private getRandomGreeting() {
    const greetings = [
      'Hi',
      'Hey',
      'Hello'
    ];
    return greetings[Math.floor(Math.random() * Math.floor(greetings.length - 1))];
  }

  private getRandomWelcomeMessage() {
    const messages = [
      'Let\'s see how obscure your taste is...',
      'Check out your stats below',
      'Find out more about your music taste below',
      'Let\'s check out your stats...'
    ];
    return messages[Math.floor(Math.random() * Math.floor(messages.length - 1))];
  }

}
