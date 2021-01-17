import { Component, OnInit, ElementRef, AfterViewInit, Input } from '@angular/core';
import { IntersectionObserverService } from 'src/app/services/intersectionObserver';
import { Subscription } from 'rxjs';
import { InfoService } from 'src/app/services/infoService';

@Component({
  selector: 'app-top-genres',
  templateUrl: './top-genres.component.html',
  styleUrls: ['./top-genres.component.scss'],
  providers: [IntersectionObserverService]

})
export class TopGenresComponent implements OnInit, AfterViewInit {

  @Input() data: any;

  constructor(
    public element: ElementRef,
    public intersectionObserverService: IntersectionObserverService,
    public infoSvc: InfoService
    ) { }
  public items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  public show = false;

  public topGenres;
  private intersectionObserverSubs: Subscription;

  ngOnInit() {
      this.topGenres = this.data.topGenres;
  }


  ngAfterViewInit(): void {
    this.intersectionObserverService.init(this.element.nativeElement, {
      threshold: [0.20]
    });
    this.intersectionObserverSubs = this.intersectionObserverService
    .getSubject()
    .subscribe(el => {

      if (el.isIntersecting) {
        this.show = true;
      }
    });
  }

}
