import { Component, Input, OnInit, Output } from '@angular/core';
import { ACTIONS, ColumnTypes, TableActionEvent, TableColumn } from 'app/components/tablecomponent/models';
import { MainBaseComponent } from 'app/components/main-base/main-base.component';
import { AddUpdateDisciplineManagementServiceProxy, DisciplineManagementDTO, DisciplineTemplateDTO, FetchDisciplineLogByIdServiceProxy, FetchDisciplineLogServiceProxy, FetchEmployeeByIdServiceProxy } from 'app/_services/service-proxies';
import { ActivatedRoute, Router } from '@angular/router';
import { IStatus, MyColor } from 'app/components/status/models';
import { AuthenticationService } from 'app/_services/authentication.service';
import { AlertserviceService } from 'app/_services/alertservice.service';


enum TOP_ACTIONS { DISCIPLINE, }
export class logWithStatus extends DisciplineManagementDTO implements IStatus {
  mgtLog: DisciplineManagementDTO;

  constructor(mgtLog: DisciplineManagementDTO) {
    super(mgtLog);
    this.mgtLog = mgtLog;

  }

  getStatusLabel() {
    if (this.mgtLog.status === 1) return 'Open';
    if (this.mgtLog.status === 2) return 'Closed';
    if (this.mgtLog.status === 3) return 'Rejected';

  }
  getStatusColor() {
    if (this.mgtLog.status === 1) return new MyColor(242, 153, 74);
    if (this.mgtLog.status ===2) return new MyColor(0, 153, 74);
    if (this.mgtLog.status === 3) return new MyColor(242, 0, 74);
    return new MyColor(253, 238, 238);
  }
}


@Component({
  selector: 'ngx-disciplinary-management-log',
  templateUrl: './disciplinary-management-log.component.html',
  styleUrls: ['./disciplinary-management-log.component.scss']
})
export class DisciplinaryManagementLogComponent extends MainBaseComponent {
  topActionButtons = [
    { name: 'DISCIPLINE', label: 'Discipline', icon: '', outline: false },
  ];
  TOP_ACTIONS = TOP_ACTIONS;
  tableColumns = [
    { name: 'employeeName', title: 'Recipient' ,type: ColumnTypes.Text},
    { name: 'employeeDepartmentName', title: 'Department' ,type: ColumnTypes.Text},
    { name: 'subject', title: 'Subject',type: ColumnTypes.Text },
    { name: 'disciplinaryTypeName', title: 'Discipline Type',type: ColumnTypes.Text },
    { name: 'dateSent', title: 'Date Sent',type: ColumnTypes.Date },
    { name: 'status', title: 'Status' ,type: ColumnTypes.Status}
  ];
  tableActions = [
    { name: ACTIONS.VIEW, label: 'View' },
  ];
  totalItems = 0;
  currentPage = 1;
  pageName = "Disciplinary Management"
  IsReward: boolean = false;
  filter = {
    iD:  undefined,
    disciplinaryTypeId: undefined,
    employeeId: 0,
    pageSize: 10,
    pageNumber: 1
  }
  DisciplineManagementList = [];
  isUser: boolean = false;
  showtypeDetails: boolean = false;
  viewDisciplineManagementDTO = new DisciplineManagementDTO().clone();
  loadingSingleDisciplin: boolean = false;
  responseToggle: boolean = false;
  constructor(private acitivatedroute: ActivatedRoute,
    private router: Router,
    private alertService: AlertserviceService,
    private FetchDisciplineLogService: FetchDisciplineLogServiceProxy,
    private authService: AuthenticationService, private FetchDisciplineLogByIdService: FetchDisciplineLogByIdServiceProxy,
    private AddUpdateDisciplineManagementService: AddUpdateDisciplineManagementServiceProxy,
    private FetchEmployeeByIdService: FetchEmployeeByIdServiceProxy,) {
    super();
  }

  async processResponse() {
    if (this.viewDisciplineManagementDTO.employeeId) {      
      this.loadingSingleDisciplin = true;
      var empData = await this.FetchEmployeeByIdService.getEmployeeById(this.viewDisciplineManagementDTO.employeeId).toPromise();
      if (!empData.hasError) {
        delete empData.result.dateCreated;
        delete empData.result.employmentHistories;
        this.viewDisciplineManagementDTO.recipientsEmployee = JSON.stringify(empData.result);
           }
      this.viewDisciplineManagementDTO.isReward = this.IsReward;
      this.AddUpdateDisciplineManagementService.addUpdateDisciplineManagement(this.viewDisciplineManagementDTO).subscribe(data => {
        this.loadingSingleDisciplin = false;
        if (!data.hasError) {       
     
          this.alertService.openModalAlert(this.alertService.ALERT_TYPES.SUCCESS, data.message, "ok");
        } else {
          this.alertService.openModalAlert(this.alertService.ALERT_TYPES.FAILED, data.message, "ok");
        }
      })
    } else {
      this.alertService.openModalAlert(this.alertService.ALERT_TYPES.FAILED, "Please select Recipient", "ok");
    }
  }



 async tableActionClicked(event: TableActionEvent) {
   if (event.name == ACTIONS.VIEW) {
     this.viewDisciplineManagementDTO = new DisciplineManagementDTO().clone();
    this.showtypeDetails = true;
      this.loadingSingleDisciplin = true;
      var data = await this.FetchDisciplineLogByIdService.fetchDisciplineLogById(event.data.id).toPromise();
      
      if (!data.hasError) {
     
        this.viewDisciplineManagementDTO = data.result;
        this.loadingSingleDisciplin = false;
      } else {
        this.showtypeDetails = false;
        this.loadingSingleDisciplin = false;
        this.alertService.openModalAlert(this.alertService.ALERT_TYPES.FAILED, data.message, "OK");
      }
    }

  }
  filterUpdated(filter: any) {
    this.filter = { ...this.filter, ...filter };
    this.getallLog();
  }
  get showEmpty(){
    return this.DisciplineManagementList.length === 0;
  }
  getallLog() {
    this.loading = true;
    this.FetchDisciplineLogService.fetchDisciplineLog(this.filter.iD, this.filter.disciplinaryTypeId,this.IsReward,this.filter.employeeId, this.filter.pageSize, this.filter.pageNumber).subscribe(data => {
      this.loading = false; 
      if (!data.hasError) {        
        var rs = data.result.map(x=>new logWithStatus(x))
        this.DisciplineManagementList = rs;
        this.totalItems = data.totalRecord;
      }
    })
  }
  AddNewDiscipline() {
    var param = this.IsReward ? "reward" : "discipline";
    this.router.navigate(['/discipline/create/' + param]);
  }
  ngOnInit() {

    this.acitivatedroute.params.subscribe(data => {
      //    console.log(data);
          if (data.type) {
            var typ = data.type;
            this.IsReward = typ == "reward" ? true : false;
            this.pageName= typ == "reward" ? "Reward Management" : "Disciplinary Management";
      }
      if (data.user) {    
        this.isUser = true;
        this.authService.getuser().then(userDetails => {
          if (userDetails) {
            var user = userDetails[0];
            if (user) {
              this.pageName= data.type == "reward" ? "My Reward" : "My Discipline";
              this.filter.employeeId = user.employee_id;
              console.log(this.filter.employeeId)
              this.getallLog();
            }
          }
          
        });
      } else {
        this.getallLog();
      }
      
    });
  
  }

}
