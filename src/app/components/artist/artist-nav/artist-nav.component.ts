import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-artist-nav',
  templateUrl: './artist-nav.component.html',
  styleUrls: ['./artist-nav.component.scss']
})
export class ArtistNavComponent implements OnInit {

  constructor() { }

  public historyList = [
    'asdf',
    'adsf',
    'asdf',
    'asdfasdf'
  ];

  ngOnInit() {
  }

}
