import { Component, OnInit, ElementRef, Output, EventEmitter, AfterViewInit } from '@angular/core';
import IntersectionObserverService from 'src/app/services/intersectionObserver';
import { Subscription } from 'rxjs';
import { InfoService } from 'src/app/services/infoService';

@Component({
  selector: 'app-top-genres',
  templateUrl: './top-genres.component.html',
  styleUrls: ['./top-genres.component.scss'],
  providers: [IntersectionObserverService]

})
export class TopGenresComponent implements OnInit, AfterViewInit {

  @Output() appColor = new EventEmitter<number>();

  constructor(
    public element: ElementRef, 
    public intersectionObserverService: IntersectionObserverService,
    public infoSvc: InfoService
    ) { }
  public items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  public show = false;
  private intersectionObserverSubs: Subscription;

  private updateAppBackgroundColor() {

    this.appColor.emit(2);

  }

  ngOnInit() {
    this.infoSvc.getUserStream().subscribe((x: any) => {
      console.log('User in Genres', x);
    });
  }


  ngAfterViewInit(): void {
    this.intersectionObserverService.init(this.element.nativeElement, {
      threshold: 0.50
    });
    this.intersectionObserverSubs = this.intersectionObserverService
    .getSubject()
    .subscribe(el => {

      if (el.isIntersecting) {
        this.updateAppBackgroundColor();
        this.show = true;
      }

    });
  }

}
