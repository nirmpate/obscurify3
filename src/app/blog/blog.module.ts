import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ScullyLibModule} from '@scullyio/ng-lib';
import {BlogRoutingModule} from './blog-routing.module';
import {BlogComponent} from './blog.component';
import {GlobalModule} from '../global/global.module';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ArticlesModule } from '../articles/articles.module';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [BlogComponent],
  imports: [ArticlesModule, CommonModule, BlogRoutingModule, ScullyLibModule, GlobalModule, RouterModule, FlexLayoutModule, ClipboardModule, MatSnackBarModule],
})
export class BlogModule {}
