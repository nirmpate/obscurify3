import { Component, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-decade-card',
  templateUrl: './decade-card.component.html',
  styleUrls: ['./decade-card.component.scss']
})
export class DecadeCardComponent implements OnInit {

  @Input() decadeConfig;
  @ViewChild('trackGroup') trackGroup;
  constructor() { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    if (this.decadeConfig.current.length > 0) {
      this.trackGroup.value = 'current';
    } else {
      this.trackGroup.value = 'allTime';
    }
  }
}
