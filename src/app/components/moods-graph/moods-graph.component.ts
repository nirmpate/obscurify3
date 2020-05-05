import { Component, OnInit, Output, EventEmitter, ElementRef, AfterViewInit } from '@angular/core';
import IntersectionObserverService from 'src/app/services/intersectionObserver';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-moods-graph',
  templateUrl: './moods-graph.component.html',
  styleUrls: ['./moods-graph.component.scss'],
  providers: [IntersectionObserverService]
})
export class MoodsGraphComponent implements OnInit, AfterViewInit {

  @Output() appColor = new EventEmitter<number>();

  constructor(public element: ElementRef, public intersectionObserverService: IntersectionObserverService) { }

  public show = false;

  private intersectionObserverSubs: Subscription;

  private updateAppBackgroundColor() {

    this.appColor.emit(2);

  }

  ngOnInit() {}


  ngAfterViewInit(): void {
    this.intersectionObserverService.init(this.element.nativeElement, {
      threshold: 0.70
    });
    this.intersectionObserverSubs = this.intersectionObserverService
    .getSubject()
    .subscribe(el => {

      if (el.isIntersecting) {
        this.updateAppBackgroundColor();
        this.show = true;
      } else {
        this.show = false;
      }
    });

  }

}
