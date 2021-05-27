import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpotlightComponent } from './spotlight/spotlight.component';
import { BigCardComponent } from './big-card/big-card.component';
import { SmallCardComponent } from './small-card/small-card.component';
import { FlexLayoutModule, FlexModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [SpotlightComponent, BigCardComponent, SmallCardComponent],
  imports: [
    CommonModule,
    FlexModule,
    FlexLayoutModule,
    RouterModule,
    MatButtonModule
  ],
  exports: [SpotlightComponent, BigCardComponent, SmallCardComponent]
})
export class ArticlesModule { }
