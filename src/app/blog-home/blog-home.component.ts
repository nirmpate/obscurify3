import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-blog-home',
  templateUrl: './blog-home.component.html',
  styleUrls: ['./blog-home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BlogHomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
