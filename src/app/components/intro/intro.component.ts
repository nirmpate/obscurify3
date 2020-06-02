import { Component, OnInit, Output, EventEmitter, ElementRef, AfterViewInit, Input } from '@angular/core';
import IntersectionObserverService from 'src/app/services/intersectionObserver';
import { Subscription } from 'rxjs';
import { InfoService } from 'src/app/services/infoService';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/spotifyAuth';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss'],
  providers: [IntersectionObserverService]

})
export class IntroComponent implements OnInit, AfterViewInit {
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

  private intersectionObserverSubs: Subscription;
  private updateAppBackgroundColor(): void {
    this.appColor.emit(4);
  }


  ngOnInit() {
    this.userName = this.data.display_name.split(' ')[0];
    this.userImage = this.data.images[0].url;
    this.welcomeMessage = this.getRandomWelcomeMessage();
    this.greeting = this.getRandomGreeting();
  }

  ngAfterViewInit(): void {
    this.intersectionObserverService.init(this.element.nativeElement, {
      threshold: 0.70
    });
    this.intersectionObserverSubs = this.intersectionObserverService
      .getSubject()
      .subscribe(el => {
        if (el.isIntersecting) {
          this.updateAppBackgroundColor();
        }
      });
  }

  public logout() {
    this.tokenSvc.clearToken();
    window.open('https://www.spotify.com/logout', '_blank');
    this.router.navigate(['login']);
  }

  private getRandomGreeting () {
    let greetings = [
      "Hi",
      "Hey",
      "Hello"
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  private getRandomWelcomeMessage () {
    let messages = [
      "Let's see how obscure your taste is...",
      "Check out your stats below",
      "Find out more about your music taste below"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }

}
