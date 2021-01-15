import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { GlobalModule } from '../global/global.module';
import { ArticlesModule } from '../articles/articles.module';


@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    GlobalModule,
    ArticlesModule
  ]
})
export class LoginModule { }
