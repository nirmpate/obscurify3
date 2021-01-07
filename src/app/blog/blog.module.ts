import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ScullyLibModule} from '@scullyio/ng-lib';
import {BlogRoutingModule} from './blog-routing.module';
import {BlogComponent} from './blog.component';
import {GlobalModule} from '../global/global.module';

@NgModule({
  declarations: [BlogComponent],
  imports: [CommonModule, BlogRoutingModule, ScullyLibModule, GlobalModule],
})
export class BlogModule {}
