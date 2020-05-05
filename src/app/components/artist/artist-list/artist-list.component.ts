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
export class ArtistListComponent implements AfterViewInit, OnInit {

  @Output() appColor = new EventEmitter<number>();

  constructor(
    public element: ElementRef,
    public intersectionObserverService: IntersectionObserverService,
    public infoSvc: InfoService
    ) { }

  public allTimeArtists = [];
  public currentArtists = [];
  public allTimeTracks = [];
  public currentTracks = [];

  public sliceLimit = 10;

  public showNav = false;

  private intersectionObserverSubs: Subscription;
  private updateAppBackgroundColor(): void {
    this.appColor.emit(4);
  }


  ngOnInit() {
    this.infoSvc.fetchAllTimeArtists().subscribe((x: any) => {

      if (x.items) {
        this.allTimeArtists = [...x.items];
      }

    });

    this.infoSvc.fetchAllTimeTracks().subscribe((x: any) => {

      if (x.items) {
        this.allTimeTracks = [...x.items];
      }

    });

    this.infoSvc.fetchCurrentTracks().subscribe((x: any) => {
      if (x.items) {
        this.currentTracks = [...x.items];
      }
    });

    this.infoSvc.fetchCurrentArtists().subscribe((x: any) => {
      if (x.items) {
        this.currentTracks = [...x.items];
      }
    });
  }

  ngAfterViewInit(): void {
    this.intersectionObserverService.init(this.element.nativeElement, {
      threshold: 0.20
    });
    this.intersectionObserverSubs = this.intersectionObserverService
      .getSubject()
      .subscribe(el => {
        if (el.isIntersecting) {
          console.log('is intersecting artists');
          this.updateAppBackgroundColor();
          this.showNav = true;
        } else {
          this.showNav = false;
        }
      });
  }
}
