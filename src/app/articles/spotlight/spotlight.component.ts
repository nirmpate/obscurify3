import { ScullyRoutesService, ScullyRoute } from '@scullyio/ng-lib';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-spotlight',
  templateUrl: './spotlight.component.html',
  styleUrls: ['./spotlight.component.scss']
})
export class SpotlightComponent implements OnInit {
    links$: Observable<ScullyRoute[]> = this.scully.available$;
    blogPosts: any[] = [];

    ngOnInit() {
      // debug current pages
      this.links$.subscribe((links) => {
        console.log(links);
        for (let link of links) {
            if (link.title) this.blogPosts.push(link);
        }
      });
    }

  constructor(private scully: ScullyRoutesService) { }


}
