import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {BlogHomeComponent} from '../blog-home/blog-home.component';
import {BlogComponent} from './blog.component';

const routes: Routes = [
  {
    path: ':slug',
    component: BlogComponent,
  },
  {
    path: '**',
    component: BlogHomeComponent,
  },
  {
    path: '',
    component: BlogHomeComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlogRoutingModule {}
