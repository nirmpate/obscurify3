import { ScullyRoutesService, ScullyRoute } from '@scullyio/ng-lib';
import { Observable, Subscription } from 'rxjs';
import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router, ROUTES} from '@angular/router';
import { ObscurityFuncs } from 'src/app/utilities/obscurityFuncs';
import { SeoService } from '../services/metaData';

declare var ng: any;

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
  preserveWhitespaces: true,
  encapsulation: ViewEncapsulation.Emulated

})
export class BlogComponent implements OnInit {

  constructor(private scully: ScullyRoutesService, private seoService: SeoService, private obscurifyFunc: ObscurityFuncs) {}

  links$: Observable<ScullyRoute[]> = this.scully.available$;
  blogPosts: any[] = [];
  filteredPosts: any[] = [];
  post: ScullyRoute;
  sub: Subscription;


  ngOnInit() {
    this.sub = this.scully.getCurrent().subscribe( temp => {
      this.post = temp;
      this.filterPosts();
      this.seoService.setMetaTags({
        title: `Obscurify Music | ${this.post.title}`,
        description: this.post.description,
        image: this.post.img
      });
    });

    // debug current pages
    this.links$.subscribe((links) => {
      for (const link of links) {
          if (link.published) {
            this.blogPosts.push(link);
            this.filterPosts();
          }
      }
    });
  }

  filterPosts() {
    const posts = this.blogPosts.filter((post) => post !== this.post);
    this.filterPosts = this.obscurifyFunc.sortBlogPosts(posts);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
