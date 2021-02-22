import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from 'app/components/components.module';
import { LeaveRoutingModule } from './leave.routing.module';
import { LeavePlanComponent } from './leave-plan/leave-plan.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [LeavePlanComponent, ],
  imports: [
    CommonModule,
    ComponentsModule, LeaveRoutingModule,
    FormsModule,
  ]
})
export class LeaveModule { }