import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-year-breakdown',
  templateUrl: './year-breakdown.component.html',
  styleUrls: ['./year-breakdown.component.scss']
})
export class YearBreakdownComponent implements OnInit {

  @Input() allTimeTracks: any;
  @Input() currentTracks: any;

  public allTimeBreakdown: any = [];
  public currentBreakdown: any = [];

  constructor() { }

  ngOnInit(): void {
    this.allTimeBreakdown = this.calculateBreakdown(this.allTimeTracks);
    this.currentBreakdown = this.calculateBreakdown(this.currentTracks);
  }

  private calculateBreakdown = function(tracks) {
    let breakdown = {};
    tracks.map(track => {
      if (track.album && track.album.release_date) {
        const year = parseInt(track.album.release_date.substring(0,4));
        const decade = Math.floor(year / 10) * 10;
        if (breakdown[decade]) {
          breakdown[decade].push(track);
        } else {
          breakdown[decade] = [track];
        }
      }
    });
    let breakdownList = [];
    for (const property in breakdown) {
      breakdownList.push({
        "decade": property,
        "tracks": breakdown[property]
      });
    }
    console.log(breakdownList);
    return breakdownList;
  }

}
