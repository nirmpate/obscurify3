import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class SeoService {

  constructor(
    private title: Title,
    private meta: Meta,
    private router: Router
  ) {}

  setMetaTags(config?: any) {
    config = {
      title: `Obscurify Music`,
      description: `Obscurify Music finds out about your music tastes and scored
      you on how obscure your Spotify music is compared to other Obscurify Users.`,
      image: `https://www.obscurifymusic.com/assets/icons/icon-72x72.png`,
      url: `https://www.obscurifymusic.com/${this.router.url}`,
      ...config
    };

    // Set title
    this.title.setTitle(config.title);

    // Google
    this.meta.updateTag({ name: 'Description', content: config.description });

    // Twitter
    this.meta.updateTag({ name: 'twitter:card', content: 'summary' });
    this.meta.updateTag({ name: 'twitter:site', content: `@obscurifymusic` });
    this.meta.updateTag({ name: 'twitter:title', content: config.title });
    this.meta.updateTag({ name: 'twitter:description', content: config.description });
    this.meta.updateTag({ name: 'twitter:image', content: config.image });
    this.meta.updateTag({name: 'og:image', content: config.image });
  }
}
