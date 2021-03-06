import { CommunicationServiceProxy } from 'app/_services/service-proxies';
import { RecruitmentSettingServiceProxy, RecruitmentQuizServiceProxy, RecruitmentJobApplicationServiceProxy } from './../../../_services/service-proxies';
import { AdminDashboardRoutingModule } from './admindashboard-routing.module';
import { FullCalendarModule } from '@fullcalendar/angular';
import { ComponentsModule } from '../../../components/components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NbCardModule, NbThemeModule, NbTabsetModule, NbOptionModule, NbSelectModule, NbCalendarModule, NbRadioComponent, NbRadioModule, NbToggleModule, NbCheckboxModule } from '@nebular/theme';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxEchartsModule } from 'ngx-echarts';
import { JobsComponent } from './jobs/jobs.component';
import { ReportsComponent } from './reports/reports.component';
import { SettingsComponent } from './settings/settings.component';
import { QuizComponent } from './quiz/quiz.component';
import { NewjobComponent } from './newjob/newjob.component';
import { NewquizComponent } from './newquiz/newquiz.component';
import { ApplicantsComponent } from './applicants/applicants.component';



@NgModule({
  declarations: [DashboardComponent,NewjobComponent, JobsComponent, ReportsComponent, SettingsComponent, QuizComponent, NewjobComponent, NewquizComponent, ApplicantsComponent],
  imports: [
    CommonModule,
    AdminDashboardRoutingModule,
    NbCardModule,
    ComponentsModule,
    NbThemeModule,
    NgxChartsModule,
    NgxEchartsModule,
    NbTabsetModule,
    NbOptionModule,
    NbSelectModule,
    FullCalendarModule,
    NbCalendarModule,
    NbRadioModule,
    NbToggleModule,
    NbCheckboxModule,
  ],

  providers: [
    RecruitmentSettingServiceProxy,
    RecruitmentQuizServiceProxy,
    RecruitmentJobApplicationServiceProxy,
    CommunicationServiceProxy,
  ]
})
export class AdminDashboardModule { }
