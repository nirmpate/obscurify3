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
  public allTimeTopDecade: string;
  public currentBreakdown: any = [];
  public currentTopDecade: string;

  constructor() { }

  ngOnInit(): void {
    this.allTimeBreakdown = this.calculateBreakdown(this.allTimeTracks);
    this.currentBreakdown = this.calculateBreakdown(this.currentTracks);
    this.allTimeTopDecade = this.findTopDecade(this.allTimeBreakdown);
    this.currentTopDecade = this.findTopDecade(this.currentBreakdown);
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

  private findTopDecade = function(breakdown) {
    let topDecade = "";
    let highestCount = 0;
    for(let decade of breakdown) {
      if (decade.tracks.length > highestCount) {
        highestCount = decade.tracks.length;
        topDecade = decade.decade;
      }
    }
    return topDecade;
  }

}
