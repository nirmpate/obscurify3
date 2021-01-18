import { Component, OnInit, Output, EventEmitter, ElementRef, AfterViewInit, Input, ViewChild } from '@angular/core';
import { IntersectionObserverService } from 'src/app/services/intersectionObserver';
import { Subscription } from 'rxjs';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { SummaryComponent } from '../summary/summary.component';


@Component({
  selector: 'app-obscurity-rating',
  templateUrl: './obscurity-rating.component.html',
  styleUrls: ['./obscurity-rating.component.scss'],
  providers: [IntersectionObserverService]

})
export class ObscurityRatingComponent implements OnInit, AfterViewInit {
  @Input() data;
  @Output() switchCountryEvent: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('tweetContainer') tweetContainer;
  constructor(public element: ElementRef, public intersectionObserverService: IntersectionObserverService, public dialog: MatDialog) { }
  public show = false;
  private intersectionObserverSubs: Subscription;
  public countryList: any = [
    {value: 'US', viewValue: 'United States'},
    {value: 'AR', viewValue: 'Argentina'},
    {value: 'AU', viewValue: 'Australia'},
    {value: 'BE', viewValue: 'Belgium'},
    {value: 'BR', viewValue: 'Brazil'},
    {value: 'CL', viewValue: 'Chile'},
    {value: 'DK', viewValue: 'Denmark'},
    {value: 'FI', viewValue: 'Finland'},
    {value: 'FR', viewValue: 'France'},
    {value: 'DE', viewValue: 'Germany'},
    {value: 'GB', viewValue: 'Great Britain'},
    {value: 'HU', viewValue: 'Hungary'},
    {value: 'IN', viewValue: 'India'},
    {value: 'ID', viewValue: 'Indonesia'},
    {value: 'IE', viewValue: 'Ireland'},
    {value: 'IT', viewValue: 'Italy'},
    {value: 'MX', viewValue: 'Mexico'},
    {value: 'MY', viewValue: 'Malaysia'},
    {value: 'NL', viewValue: 'Netherlands'},
    {value: 'NZ', viewValue: 'New Zealand'},
    {value: 'NO', viewValue: 'Norway'},
    {value: 'PH', viewValue: 'Philippines'},
    {value: 'PL', viewValue: 'Poland'},
    {value: 'PT', viewValue: 'Portugal'},
    {value: 'ES', viewValue: 'Spain'},
    {value: 'SG', viewValue: 'Singapore'},
    {value: 'SE', viewValue: 'Sweden'},
    {value: 'TR', viewValue: 'Turkey'},
    {value: 'VN', viewValue: 'Vietnam'}
  ];

  ngOnInit() {
      window['twttr'].ready().then((callback) => {
          window['twttr'].widgets.createShareButton('obscurifymusic.com 🎧', this.tweetContainer.nativeElement, {
              text: `My music taste is more obscure than ${Math.round(this.data.obscurifyInfo.percentileByCountryAllTime)}% of other listeners on Obscurify. \n\nFind yours at`,
              size: 'large'
          });


      })
  }

  openSummary() {
    const dialogRef = this.dialog.open(SummaryComponent, {
        maxWidth: '450px',
        maxHeight: '632pt',
        width: '100vw',
        data: {
            percentileByCountryAllTime: this.data.obscurifyInfo.percentileByCountryAllTime,
            percentileByCountryRecent: this.data.obscurifyInfo.percentileByCountryRecent,
            country: this.data.country,
            allTimeArtists: this.data.allTimeArtists,
            allTimeTracks: this.data.allTimeTracks,
            currentArtists: this.data.currentArtists,
            currentTracks: this.data.currentTracks,
            audioFeatureAverages: this.data.obscurifyInfo.audioFeatureAverages,
            longTermAudioFeatures: this.data.longTermAudioFeatures,
            shortTermAudioFeatures: this.data.shortTermAudioFeatures,
            topGenres: this.data.topGenres
        }
    });
    dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
    });
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
    this.switchCountryEvent.emit(code);
  }
}
