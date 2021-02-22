import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';

import {
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbIconModule,
  NbInputModule,
  NbTabsetModule,
  NbActionsModule,
  NbDatepickerModule,
  NbRadioModule,
  NbSelectModule,
  NbUserModule,
  NbPopoverModule,
  NbDialogModule
} from '@nebular/theme';
import { FormsModule as ngFormsModule } from '@angular/forms';
import { ComponentsModule } from 'app/components/components.module';
import { ThemeModule } from '../../@theme/theme.module';

import { EmployeemoduleRoutingModule } from './employeemodule-routing.module';
import { HiringchecklistComponent } from './hiringchecklist/hiringchecklist.component';
import { EmployeeonboardingdashboardComponent } from './employeeonboardingdashboard/employeeonboardingdashboard.component';
import { OnboardingemployeesComponent } from './onboardingemployees/onboardingemployees.component';
import { EmployeemoduleComponent } from './employeemodule.component';
import { EmployeepersonalinformationComponent } from './employeepersonalinformation/employeepersonalinformation.component';




@NgModule({
  declarations: [HiringchecklistComponent,
    EmployeeonboardingdashboardComponent,
    OnboardingemployeesComponent,
    EmployeemoduleComponent,
    EmployeepersonalinformationComponent
  ],
  imports: [
    CommonModule,
    EmployeemoduleRoutingModule,
    ThemeModule,
    ngFormsModule,
    NbButtonModule,
    NbCardModule,
    NbCheckboxModule,
    NbInputModule,
    NbIconModule,
    ComponentsModule,
    NbActionsModule,
    NbDatepickerModule,
    NbRadioModule,
    NbSelectModule,
    NbUserModule,
    NbTabsetModule,
    NbPopoverModule,
    NbDialogModule,    
  ],

})
export class EmployeemoduleModule { }
