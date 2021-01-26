import { ScullyRoutesService, ScullyRoute } from '@scullyio/ng-lib';
import { Observable } from 'rxjs';
import { ObscurityFuncs } from 'src/app/utilities/obscurityFuncs';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-spotlight',
  templateUrl: './spotlight.component.html',
  styleUrls: ['./spotlight.component.scss']
})
export class SpotlightComponent implements OnInit {
    links$: Observable<ScullyRoute[]> = this.scully.available$;
    blogPosts: any[] = [];

    constructor(private scully: ScullyRoutesService, private obscurifyFunc: ObscurityFuncs) { }

    ngOnInit() {
      this.links$.subscribe((links) => {
          this.blogPosts = this.obscurifyFunc.sortBlogPosts(links);
      });
    }

}
