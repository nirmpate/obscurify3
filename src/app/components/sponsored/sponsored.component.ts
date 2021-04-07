import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-sponsored',
  templateUrl: './sponsored.component.html',
  styleUrls: ['./sponsored.component.scss']
})
export class SponsoredComponent implements OnInit {
  @Input() allTimeTracks;

  private href: string;
  private timer: any;
  private trackName: string;
  private trackNameIndex: number = 0;
  private trackTitlesToDisplay: any[];

  constructor() { }

  ngOnInit(): void {
    this.href = `https://spotiparel.com?utm_source=obscurify&utm_medium=banner&ref_tracks=${this.allTimeTracks.slice(0,6).map(track => track.id).join()}`;
    this.timer = setInterval(() => {this.onInterval()}, 5000);
    this.trackTitlesToDisplay = this.allTimeTracks.map(track => track.name).filter(track => track.length < 20);
    console.log(this.trackTitlesToDisplay)
    if (this.trackTitlesToDisplay.length == 0) {
      this.trackTitlesToDisplay = this.allTimeTracks.map(track => track.name);
    }
    this.trackName = this.trackTitlesToDisplay[0];
  }

  ngOnDestroy(): void {
    window.clearInterval(this.timer);
  }

  onInterval() {
    if (this.trackNameIndex < 20 && this.trackNameIndex < this.trackTitlesToDisplay.length - 1) {
      this.trackNameIndex += 1;
    } else {
      this.trackNameIndex = 0;
    }
    this.trackName = this.trackTitlesToDisplay[this.trackNameIndex];

  }
  

}

