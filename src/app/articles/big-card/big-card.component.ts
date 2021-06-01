import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-big-card',
  templateUrl: './big-card.component.html',
  styleUrls: ['./big-card.component.scss']
})
export class BigCardComponent implements OnInit {

  @Input() post;

  constructor(public router: Router) { }

  ngOnInit(): void {
  }

  routeToPost(route) {
    this.router.navigateByUrl(route);
  }

}
