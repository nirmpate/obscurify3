import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-decade-card',
  templateUrl: './decade-card.component.html',
  styleUrls: ['./decade-card.component.scss']
})
export class DecadeCardComponent implements OnInit, AfterViewInit {

  @Input() decadeConfig;
  @ViewChild('trackGroup') trackGroup;

  constructor(public sanitizer: DomSanitizer) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {

    if (this.decadeConfig.current.length > 0) {
      this.trackGroup.value = 'current';
    } else {
      this.trackGroup.value = 'allTime';
    }
  }
}
