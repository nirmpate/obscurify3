import { Component, OnInit } from '@angular/core';
import { ScullyRoutesService, ScullyRoute } from '@scullyio/ng-lib';
import { ObscurityFuncs } from 'src/app/utilities/obscurityFuncs';
import { Observable } from 'rxjs';
import { SeoService } from '../services/metaData';

@Component({
  selector: 'app-blog-home',
  templateUrl: './blog-home.component.html',
  styleUrls: ['./blog-home.component.scss']
})
export class BlogHomeComponent implements OnInit {
    links$: Observable<ScullyRoute[]> = this.scully.available$;
    featuredThreePosts: any[] = [];
    remainingPosts: any[] = [];

    constructor(
        private scully: ScullyRoutesService, 
        private obscurifyFunc: ObscurityFuncs,
        private seoService: SeoService
    ) { }

    ngOnInit(): void {
        this.links$.subscribe((links) => {
            const allPosts = this.obscurifyFunc.sortBlogPosts(links);
            this.featuredThreePosts = allPosts.splice(0, 3);
            this.remainingPosts = allPosts;
        });

        this.seoService.setMetaTags();
    }

}
