import { Component, OnInit, Input, HostListener } from '@angular/core';
import { BrowserCheck } from 'src/app/services/browserCheck';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-track-card',
  templateUrl: './track-card.component.html',
  styleUrls: ['./track-card.component.scss']
})
export class TrackCardComponent implements OnInit {

  @Input() track: any;
  @Input() i: any;
  public activeView = false;

  @HostListener('click', ['$event.target'])
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
