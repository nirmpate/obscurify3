import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatAccordion, MatExpansionPanel } from '@angular/material/expansion';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, Subscription } from 'rxjs';
import IntersectionObserverService from 'src/app/services/intersectionObserver';


@Component({
  selector: 'app-year-breakdown',
  templateUrl: './year-breakdown.component.html',
  styleUrls: ['./year-breakdown.component.scss'],
  providers: [IntersectionObserverService]
})
export class YearBreakdownComponent implements OnInit, AfterViewInit {

  @ViewChild(MatExpansionPanel) matExpansionPanel;
   
  @Input() allTimeTracks: any;
  @Input() currentTracks: any;

  public allTimeBreakdown: any = [];
  public allTimeTopDecade: string;
  public currentBreakdown: any = [];

  public breakDownList: any = [];
  public currentTopDecade: string;
  public intersectionObserverSubs: Subscription;
  public show = false;

  panelOpenState = false;

  constructor(
    public intersectionObserverService: IntersectionObserverService,
    public element: ElementRef,
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.allTimeBreakdown = this.calculateBreakdown(this.allTimeTracks);
    this.currentBreakdown = this.calculateBreakdown(this.currentTracks);
    this.allTimeTopDecade = this.findTopDecade(this.allTimeBreakdown);
    this.currentTopDecade = this.findTopDecade(this.currentBreakdown);
    this.createBreakDownObject(this.allTimeBreakdown, this.currentBreakdown);
  }

  ngAfterViewInit(): void {
    this.intersectionObserverService.init(this.element.nativeElement, {
      threshold: [0.2, 0.5, 1]
    });
    this.intersectionObserverSubs = this.intersectionObserverService
    .getSubject()
    .subscribe(el => {
      if (el.isIntersecting) {
        this.show = true;
      }
    });

    this.matExpansionPanel.open();
  }

  private createBreakDownObject(allTimeBreakdown, currentBreakdown) {
    const keysArray = [];
    allTimeBreakdown.forEach(item => {
      if (!keysArray.includes(item.decade)) {
        keysArray.push(item.decade);
      }
    });
    currentBreakdown.forEach(item => {
      if (!keysArray.includes(item.decade)) {
        keysArray.push(item.decade);
      }
    });

    keysArray.forEach(key => {
      const breakdownConfig = {
        decade: null,
        current: [],
        allTime: [],
        combinedList: []
      };
      breakdownConfig.decade = key;
      const currentTracks = currentBreakdown.find(item => item.decade === key);
      currentTracks ? breakdownConfig.current = currentTracks.tracks : breakdownConfig.current = [];
      const allTimeTracks = allTimeBreakdown.find(item => item.decade === key);
      allTimeTracks ? breakdownConfig.allTime = allTimeTracks.tracks : breakdownConfig.allTime = [];

      breakdownConfig.combinedList = [];
      while (breakdownConfig.combinedList.length <= 6 && (breakdownConfig.current.length > 0 || breakdownConfig.allTime.length > 0)) {
        if (breakdownConfig.current.length > 0) {
          breakdownConfig.combinedList.push(breakdownConfig.current.shift());
        }
        if (breakdownConfig.allTime.length > 0) {
          breakdownConfig.combinedList.push(breakdownConfig.allTime.shift());
        }
      }
      breakdownConfig.combinedList = breakdownConfig.combinedList.sort((a, b) => {
        return parseInt(a.album.release_date.substring(0, 4), 10) - parseInt(b.album.release_date.substring(0, 4), 10);
      })

      this.breakDownList.push(breakdownConfig);
      this.breakDownList = this.breakDownList.sort((a, b) => {
        return parseInt(a.decade, 10) - parseInt(b.decade, 10);
      })
    });
  }

  private calculateBreakdown = (tracks) => {
    const breakdown = {};
    tracks.map(track => {
      if (track.album && track.album.release_date) {
        const year = parseInt(track.album.release_date.substring(0, 4), 10);
        const decade = Math.floor(year / 10) * 10;
        if (breakdown[decade]) {
          breakdown[decade].push(track);
        } else {
          breakdown[decade] = [track];
        }
      }
    });
    const breakdownList = [];
    for (const property in breakdown) {
      if (property) {
        breakdownList.push({
          decade: property,
          tracks: breakdown[property]
        });
      }

    }
    return breakdownList;
  }

  private findTopDecade = (breakdown) => {
    let topDecade = '';
    let highestCount = 0;
    for (const decade of breakdown) {
      if (decade.tracks.length > highestCount) {
        highestCount = decade.tracks.length;
        topDecade = decade.decade;
      }
    }
    return topDecade;
  }

}
