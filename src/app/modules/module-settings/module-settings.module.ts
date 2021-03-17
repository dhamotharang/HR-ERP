import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModuleSettingsRoutingModule } from './module-settings-routing.module';
import { ModuleSettingsComponent } from './module-settings.component';
import { ComponentsModule } from 'app/components/components.module';
import { ThemeModule } from 'app/@theme/theme.module';
import { DepartmentListComponent } from './pages/department-list/department-list.component';
import { GetAllDepartmentsServiceProxy } from 'app/_services/service-proxies';
import { ApiService } from './services/api.service';
import { PageService } from './services/page.service';
import { BaseComponent } from './base/base.component';
import { AlertserviceService } from 'app/_services/alertservice.service';
import { ConfirmBoxService } from 'app/_services/confirm-box.service';


@NgModule({
  declarations: [
    DepartmentListComponent,
    ModuleSettingsComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    ModuleSettingsRoutingModule,
    ThemeModule,
  ],
  providers: [
    ApiService,
    PageService,
    GetAllDepartmentsServiceProxy,
    AlertserviceService,
    ConfirmBoxService,
  ]
})
export class ModuleSettingsModule { }
