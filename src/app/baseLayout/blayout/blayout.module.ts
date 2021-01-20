import { NgModule } from '@angular/core';
import { NbMenuModule } from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { CommonModule } from '@angular/common';
import { BlayoutComponent } from './blayout.component';
import { BlayoutRoutingModule } from './blayout-routing.module';


@NgModule({
  declarations: [BlayoutComponent],
  imports: [
    BlayoutRoutingModule,
    ThemeModule,
    NbMenuModule,
    CommonModule
  ]
})
export class BlayoutModule { }
