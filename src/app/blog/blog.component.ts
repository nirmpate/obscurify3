import { ScullyRoutesService, ScullyRoute } from '@scullyio/ng-lib';
import { Observable, Subscription } from 'rxjs';
import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router, ROUTES} from '@angular/router';

declare var ng: any;

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
  preserveWhitespaces: true,
  encapsulation: ViewEncapsulation.Emulated

})
export class BlogComponent implements OnInit {

  constructor(private scully: ScullyRoutesService) {}

  links$: Observable<ScullyRoute[]> = this.scully.available$;
  blogPosts: any[] = [];
  post: ScullyRoute;
  sub: Subscription;


  ngOnInit() {
    this.sub = this.scully.getCurrent().subscribe( temp => this.post = temp);

    // debug current pages
    this.links$.subscribe((links) => {
      console.log(links);
      for (let link of links) {
          if (link.title) this.blogPosts.push(link);
      }
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
