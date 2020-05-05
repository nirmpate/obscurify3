import { Component, OnInit, Output, EventEmitter, ElementRef, AfterViewInit } from '@angular/core';
import IntersectionObserverService from 'src/app/services/intersectionObserver';
import { Subscription } from 'rxjs';
import { InfoService } from 'src/app/services/infoService';

@Component({
  selector: 'app-artist-list',
  templateUrl: './artist-list.component.html',
  styleUrls: ['./artist-list.component.scss'],
  providers: [IntersectionObserverService]
})
export class ArtistListComponent implements AfterViewInit {

  @Output() appColor = new EventEmitter<number>();

  constructor(
    public element: ElementRef,
    public intersectionObserverService: IntersectionObserverService,
    public infoSvc: InfoService
    ) { }
  public allTimeArtist = [];

  public sliceLimit = 10;
  private intersectionObserverSubs: Subscription;
  private updateAppBackgroundColor(): void {
    this.appColor.emit(4);
  }


  ngOnInit() {
    this.infoSvc.fetchAllTimeArtists().subscribe((x: any) => {
      console.log('Artist List::', x);

      if (x.items) {
        this.allTimeArtist = [...x.items];

        console.log('artist List::', this.allTimeArtist);
      }
    });

    this.infoSvc.fetchAllTimeTracks().subscribe((x: any) => {

    });

    this.infoSvc.fetchCurrentTracks().subscribe((x: any) => {

    });
    this.infoSvc.fetchCurrentArtists().subscribe((x: any) => {

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
          console.log('is intersecting artists');
          this.updateAppBackgroundColor();
        }
      });
  }
}
