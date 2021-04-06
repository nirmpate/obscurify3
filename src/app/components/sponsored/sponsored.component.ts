import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-sponsored',
  templateUrl: './sponsored.component.html',
  styleUrls: ['./sponsored.component.scss']
})
export class SponsoredComponent implements OnInit {
  @Input() allTimeTracks;

  constructor() { }

  ngOnInit(): void {
  }

}
