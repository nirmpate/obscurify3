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

  constructor() { }

  ngOnInit(): void {
    this.href = `https://spotiparel.com?utm_source=obscurify&utm_medium=banner&ref_tracks=${this.allTimeTracks.slice(0,6).map(track => track.id).join()}`;
    this.timer = setInterval(() => {this.onInterval()}, 7000 );
    this.trackName = this.allTimeTracks[0].name;
  }

  ngOnDestroy(): void {
    window.clearInterval(this.timer);
  }

  onInterval() {
    if (this.trackNameIndex < 4 && this.trackNameIndex < this.allTimeTracks.length - 1) {
      this.trackNameIndex += 1;
    } else {
      this.trackNameIndex = 0;
    }
    this.trackName = this.allTimeTracks[this.trackNameIndex].name;
  }
  

}

