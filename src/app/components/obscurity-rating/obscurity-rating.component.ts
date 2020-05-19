import { Component, OnInit, Output, EventEmitter, ElementRef, AfterViewInit, Input } from '@angular/core';
import IntersectionObserverService from 'src/app/services/intersectionObserver';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-obscurity-rating',
  templateUrl: './obscurity-rating.component.html',
  styleUrls: ['./obscurity-rating.component.scss'],
  providers: [IntersectionObserverService]

})
export class ObscurityRatingComponent implements OnInit, AfterViewInit {
  @Input() data;
  @Output() appColor: EventEmitter<number> = new EventEmitter();

  constructor(public element: ElementRef, public intersectionObserverService: IntersectionObserverService) { }
  public show = false;
  private intersectionObserverSubs: Subscription;

  private updateAppBackgroundColor(val) {
    if (val) {
      this.appColor.emit(3);
    } else {
      this.appColor.emit(2);
    }
  }

  ngOnInit() {}


  ngAfterViewInit(): void {
    this.intersectionObserverService.init(this.element.nativeElement, {
      threshold: 0.20
    });
    this.intersectionObserverSubs = this.intersectionObserverService
      .getSubject()
      .subscribe(el => {

        if (el.isIntersecting) {
          this.updateAppBackgroundColor(true);
          this.show = true;
        } else {
          this.show = false;
        }

        if (el.isVisible) {
          this.updateAppBackgroundColor(false);
        }
      });
  }
}
