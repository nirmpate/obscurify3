import { Component, OnInit, Output, EventEmitter, ElementRef, AfterViewInit, Input } from '@angular/core';
import { IntersectionObserverService } from 'src/app/services/intersectionObserver';
import { Subscription } from 'rxjs';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange } from '@angular/material/select';


@Component({
  selector: 'app-obscurity-rating',
  templateUrl: './obscurity-rating.component.html',
  styleUrls: ['./obscurity-rating.component.scss'],
  providers: [IntersectionObserverService]

})
export class ObscurityRatingComponent implements OnInit, AfterViewInit {
  @Input() data;
  @Output() switchCountryEvent: EventEmitter<string> = new EventEmitter<string>();

  constructor(public element: ElementRef, public intersectionObserverService: IntersectionObserverService) { }
  public show = false;
  private intersectionObserverSubs: Subscription;
  public countryList: any = [
    {value: 'US', viewValue: 'United States'},
    {value: 'GB', viewValue: 'Great Britain'},
    {value: 'BR', viewValue: 'Brazil'}
  ];

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.intersectionObserverService.init(this.element.nativeElement, {
      root: null,
      rootMargin: '0px',
      threshold: [0.20]
    });
    this.intersectionObserverSubs = this.intersectionObserverService
      .getSubject()
      .subscribe(el => {

        if (el.isIntersecting) {
          this.show = true;
        } else {
          this.show = false;
        }
      });
  }

  switchCountry(code) {
    this.switchCountryEvent.emit(code)
  }
}
