import { ComponentsheaderComponent } from './../components/componentsheader/componentsheader.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModulesRoutingModule } from './modules-routing.module';
import { ModulesComponent } from './modules.component';

import { NbLayoutModule , NbCardModule, NbIconModule, NbSelectModule, NbCalendarModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';

import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxEchartsModule } from 'ngx-echarts';
import { ComponentsModule } from 'app/components/components.module';


@NgModule({
  declarations: [ModulesComponent, DashboardComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    ModulesRoutingModule,
    ThemeModule,
    NbLayoutModule,
    NbCardModule,
    NgxChartsModule,
    NgxEchartsModule,
    NbIconModule,
    NbSelectModule,
    NbCalendarModule
  ]
})
export class ModulesModule { }