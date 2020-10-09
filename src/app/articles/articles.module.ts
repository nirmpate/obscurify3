import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpotlightComponent } from './spotlight/spotlight.component';
import { BigCardComponent } from './big-card/big-card.component';
import { SmallCardComponent } from './small-card/small-card.component';



@NgModule({
  declarations: [SpotlightComponent, BigCardComponent, SmallCardComponent],
  imports: [
    CommonModule
  ],
  exports: [SpotlightComponent, BigCardComponent, SmallCardComponent]
})
export class ArticlesModule { }
