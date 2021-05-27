import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-small-card',
  templateUrl: './small-card.component.html',
  styleUrls: ['./small-card.component.scss']
})
export class SmallCardComponent implements OnInit {

  @Input() post;

  constructor(public router: Router) { }

  ngOnInit(): void {
  }

  routeToPost(route) {
    this.router.navigateByUrl(route);
  }

}
