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
    allPosts: any[];

    constructor(
        private scully: ScullyRoutesService, 
        private obscurifyFunc: ObscurityFuncs,
        private seoService: SeoService
    ) { }

    ngOnInit(): void {
        this.links$.subscribe((links) => {
            this.allPosts = this.obscurifyFunc.sortBlogPosts(links);
        });

        this.seoService.setMetaTags();
    }

}
