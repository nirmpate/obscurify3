import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [FooterComponent],
  imports: [
    RouterModule,
    FlexLayoutModule,
    CommonModule
  ],
  exports: [FooterComponent]
})
export class GlobalModule { }
