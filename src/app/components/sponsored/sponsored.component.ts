import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-sponsored',
  templateUrl: './sponsored.component.html',
  styleUrls: ['./sponsored.component.scss']
})
export class SponsoredComponent implements OnInit {
  @Input() allTimeTracks;

  private href: string;

  constructor() { }

  ngOnInit(): void {
    this.href = `https://spotiparel.com?utm_source=obscurify&utm_medium=banner&ref_tracks=${this.allTimeTracks.slice(0,6).map(track => track.id).join()}`
  }

}
