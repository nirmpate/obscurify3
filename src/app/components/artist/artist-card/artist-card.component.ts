import { Component, OnInit, HostListener, Input } from '@angular/core';
import { BrowserCheck } from 'src/app/services/browserCheck';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-artist-card',
  templateUrl: './artist-card.component.html',
  styleUrls: ['./artist-card.component.scss']
})
export class ArtistCardComponent implements OnInit {

  @Input() artist;
  @Input() i;
  public activeView = false;

  @HostListener('touchend', ['$event.target'])
  onClick(btn) {
    if (this.browserCheck.isDevice) {
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





  constructor(
    public browserCheck: BrowserCheck,
    public sanitizer: DomSanitizer) { }

  ngOnInit() {

  }

}
