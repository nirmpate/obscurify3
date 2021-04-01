import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-decade-card',
  templateUrl: './decade-card.component.html',
  styleUrls: ['./decade-card.component.scss']
})
export class DecadeCardComponent implements OnInit, AfterViewInit {

  @Input() decadeConfig;

  constructor(public sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    console.log(this.decadeConfig)
    this.decadeConfig.combinedList = [];
    while (this.decadeConfig.combinedList.length <= 8 && (this.decadeConfig.current.length > 0 || this.decadeConfig.allTime.length > 0)) {
      if (this.decadeConfig.current.length > 0) {
        this.decadeConfig.combinedList.push(this.decadeConfig.current.shift());
      }
      if (this.decadeConfig.allTime.length > 0) {
        this.decadeConfig.combinedList.push(this.decadeConfig.allTime.shift());
      }
    }
  }

  ngAfterViewInit(): void {

  }
}
