import { Component, OnInit, Output, EventEmitter, ElementRef, Input } from '@angular/core';
import { IntersectionObserverService } from 'src/app/services/intersectionObserver';
import { InfoService } from 'src/app/services/infoService';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/spotifyAuth';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss'],
  providers: [IntersectionObserverService]

})
export class IntroComponent implements OnInit {
  @Input() data;
  @Output() appColor = new EventEmitter<number>();

  constructor(
    public element: ElementRef,
    public intersectionObserverService: IntersectionObserverService,
    public infoSvc: InfoService,
    public router: Router,
    public tokenSvc: TokenService) { }

  public userImage;
  public userName;
  public welcomeMessage;
  public greeting;

  ngOnInit() {
    this.userName = this.checkName(this.data.display_name.split(' ')[0]);
    this.userImage = this.data.images[0].url;
    this.welcomeMessage = this.getRandomWelcomeMessage();
    this.greeting = this.getRandomGreeting();
  }

  public logout() {
    this.tokenSvc.clearToken();
    window.open('https://www.spotify.com/logout', '_blank');
    this.router.navigate(['login']);
  }

  private checkName(name) {
    const nameArray = name.split('');
    nameArray.forEach(element => {
      if (Number(element)) {
        return false;
      }
    });
    return name;
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
      'Find out more about your music taste below'
    ];
    return messages[Math.floor(Math.random() * Math.floor(messages.length - 1))];
  }

}
