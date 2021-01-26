import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ScullyRoutesService, ScullyRoute } from '@scullyio/ng-lib';
import { ObscurityFuncs } from 'src/app/utilities/obscurityFuncs';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-blog-home',
  templateUrl: './blog-home.component.html',
  styleUrls: ['./blog-home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BlogHomeComponent implements OnInit {
    links$: Observable<ScullyRoute[]> = this.scully.available$;
    featuredThreePosts: any[] = [];
    remainingPosts: any[] = [];

    constructor(private scully: ScullyRoutesService, private obscurifyFunc: ObscurityFuncs) { }

    ngOnInit(): void {
        this.links$.subscribe((links) => {
            const allPosts = this.obscurifyFunc.sortBlogPosts(links);
            this.featuredThreePosts = allPosts.splice(0, 3);
            this.remainingPosts = allPosts;
        });
    }

}
