import { Component, OnInit, HostListener } from '@angular/core';
import BrowserCheck from 'src/app/services/browserCheck';

@Component({
  selector: 'app-artist-card',
  templateUrl: './artist-card.component.html',
  styleUrls: ['./artist-card.component.scss']
})
export class ArtistCardComponent implements OnInit {

  public activeView = false;

  @HostListener('click', ['$event.target'])
  onClick(btn) {
    if (!this.browserCheck.checkIfBrowser && this.browserCheck.isDevice) {
      this.activeView = !this.activeView;
    }
  }

  @HostListener('mouseenter', ['$event.target'])
  onMouseEnter(btn) {
    if (this.browserCheck.checkIfBrowser && !this.browserCheck.isDevice) {
      this.activeView = true;
    }
  }
  @HostListener('mouseleave', ['$event.target'])
  onMouseLeave(btn) {
    if (this.browserCheck.checkIfBrowser && !this.browserCheck.isDevice) {
      this.activeView = false;
    }
  }


  constructor(public browserCheck: BrowserCheck) { }

  ngOnInit() {

  }

}
