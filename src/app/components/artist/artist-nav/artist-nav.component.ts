import { Component, OnInit, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
@Component({
  selector: 'app-artist-nav',
  templateUrl: './artist-nav.component.html',
  styleUrls: ['./artist-nav.component.scss']
})

export class ArtistNavComponent implements OnInit {

  @Input() navState;
  @Output() updateHistory: EventEmitter<any> = new EventEmitter();
  @Output() createPlaylist: EventEmitter<any> = new EventEmitter();

  constructor() { }

  public historyList = [];
  public selectedHistory = { name: 'Current', value: 'songs' };

  ngOnInit() {
    console.log(this.navState);
    this.historyList = [...this.navState.historyList];
    this.selectedHistory = this.historyList[0];
  }

  getRadioValue(data) {
    const navState = {
      listType: this.navState.listType,
      selectedHistory: this.selectedHistory
    };
    this.updateHistory.next(navState);
  }

  updateArtistTrack(type) {
    const navState = {
      listType: type,
      selectedHistory: this.selectedHistory,
      historyList: this.navState.historyList
    };
    this.updateHistory.next(navState);
  }

  emitCreatePlaylist() {
    this.createPlaylist.next(true);
  }

}
