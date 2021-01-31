import { ScullyRoutesService, ScullyRoute } from '@scullyio/ng-lib';
import { Observable, Subscription } from 'rxjs';
import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { ActivatedRoute, Router, ROUTES, ActivatedRouteSnapshot } from '@angular/router';
import { ObscurityFuncs } from 'src/app/utilities/obscurityFuncs';
import { SeoService } from '../services/metaData';
import { MatSnackBar } from '@angular/material/snack-bar';

declare var ng: any;

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
  preserveWhitespaces: true,
  encapsulation: ViewEncapsulation.Emulated

})
export class BlogComponent implements OnInit {

  @ViewChild('tweetContainer') tweetContainer;

  constructor(private scully: ScullyRoutesService, private seoService: SeoService, private obscurifyFunc: ObscurityFuncs, private msb: MatSnackBar) {}

  links$: Observable<ScullyRoute[]> = this.scully.available$;
  blogPosts: any[] = [];
  filteredPosts: any[] = [];
  post: ScullyRoute;
  sub: Subscription;
  location: string
  get locationEncoded() {
    return 'www.google.com'
  }

  ngOnInit() {

    if (window && window.location) {
      this.location = window.location.href;
    }

    this.sub = this.scully.getCurrent().subscribe( temp => {
      this.post = temp;
      this.filterPosts();
      this.location = window.location.href;
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
    this.filteredPosts = this.obscurifyFunc.sortBlogPosts(posts);
  }

  twitterShare() {
    window.open(`https://twitter.com/intent/tweet?text=${this.post.title}&url=${this.location}&via=obscurifymusic`, '_blank','toolbar=no,menubar=no,width=600,height=600');
  }

  facebookShare() {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${this.locationEncoded}`, '_blank','toolbar=no,menubar=no,width=600,height=600');
  }

  openSnackBarClipBoard() {
    this.msb.open('Copied to Clipboard', '' , { duration: 5000, panelClass: 'panel-success', verticalPosition: 'top'});
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
