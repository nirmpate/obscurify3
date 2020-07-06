import { Component, OnInit, Input, Output, Inject, Optional, OnChanges, SimpleChanges } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
@Component({
  selector: 'app-artist-nav',
  templateUrl: './artist-nav.component.html',
  styleUrls: ['./artist-nav.component.scss'],
})

export class ArtistNavComponent implements OnChanges {

  @Input() navState;
  @Output() updateHistory: EventEmitter<any> = new EventEmitter();
  @Output() createPlaylist: EventEmitter<any> = new EventEmitter();
  @Output() dismissBottomSheet: EventEmitter<any> = new EventEmitter();

  constructor(@Optional() @Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {

   }

  public historyList = [];
  public navOpen;
  public selectedHistory = { name: 'Current', value: 'songs' };

  ngOnChanges(changes: SimpleChanges) {
    console.log('changes:', changes);
    if (changes.navState) {
      this.navState = {...changes.navState.currentValue };
      this.historyList = [...changes.navState.currentValue.historyList];
    }
    if (changes.navState.firstChange) {
      this.selectedHistory = changes.navState.currentValue.historyList[0];
    }
  }

  closeBottomSheet() {
    this.dismissBottomSheet.emit(true);
  }

  getRadioValue(data) {
    const navState = {
      listType: this.navState.listType,
      selectedHistory: this.selectedHistory,
      historyList: this.navState.historyList

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
