import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { FlexLayoutModule } from '@angular/flex-layout';


@NgModule({
  declarations: [FooterComponent],
  imports: [
    FlexLayoutModule,
    CommonModule
  ],
  exports: [FooterComponent]
})
export class GlobalModule { }
