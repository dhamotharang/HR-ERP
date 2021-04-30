import { Router } from '@angular/router';
import { TableAction, TableActionEvent } from 'app/components/tablecomponent/models';
import { NgForm } from '@angular/forms';
import { AlertserviceService } from './../../../_services/alertservice.service';
import { TableColumn } from './../../../components/tablecomponent/models';
import { LoanRequestDTOs, AddUpdateLoanTypeServiceProxy, NewLoanRequestDTO, IdNameObj, UpdateLoadRequestDTO, GetLoanRequestsServiceProxy, GetLoanSummaryServiceProxy, UpdateLoanRequestServiceProxy, FetchLoanTypeByIdServiceProxy, LoanType, GetInterestRateServiceProxy, InterestRate, GetLoanTypesServiceProxy, LoanTypeDTO, IVwUserObj } from './../../../_services/service-proxies';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'app/_services/authentication.service';

enum TABLE_ACTION {
  VIEW = '1',
  EDIT = '3'
}
@Component({
  selector: 'ngx-loan-request',
  templateUrl: './loan-request.component.html',
  styleUrls: ['./loan-request.component.scss']
})
export class LoanRequestComponent implements OnInit {

  tableActions: TableAction[] = [
    {name: TABLE_ACTION.VIEW, label: 'View'},
    {name: TABLE_ACTION.EDIT, label: 'Edit'},

  ]

  myHeader: string = 'You have no Loan Request';
  myDescription: string = 'Click to make a loan request';
  button: string = 'Click to request';
  pageNo: number = 1;

  tempRef: any = '';

  allowmultipleselection: boolean = false;
  selectionHeader: string = "Select Employee";
  addbtnText: string = "Add Employee";

  loanModel: NewLoanRequestDTO = new NewLoanRequestDTO;
  loanRequest: NewLoanRequestDTO = new NewLoanRequestDTO;

  selectedCase: string = 'request';
  selectedPanel: any = { title: 'request', label: 'Loan Request', status: 'Active'};
  requestChecklist = [
    { title: 'request', label: 'Loan Request', status: 'Active' },
    { title: 'documents', label: 'Related Documents', status: 'Inactive' },
    { title: 'guarantor', label: 'Guarantor List', status: 'Inactive' }
  ];

  loanRequestTable: TableColumn [] = [
    {name: 'refNo', title: 'Ref No.'},
    {name: 'employeeNo', title: 'Employee No.'},
    {name: 'employeeName', title: 'Employee Name'},
    {name: ' amount', title: 'Loan Amount'},
    {name: ' requestedAmount', title: 'Requested Amount'},
    {name: ' loanTypeName', title: 'Loan Type'},

  ];

  tableActionClicked(event: TableActionEvent){
     if(event.name==TABLE_ACTION.VIEW){
      this.router.navigateByUrl('process-loan' + event.data.id)
       }

       else if(event.name==TABLE_ACTION.EDIT){
        this.router.navigateByUrl('update-loan' + event.data.id)
         }
  }

  allLoansData: LoanRequestDTOs [] = [];
  loanSummary: IdNameObj [] = [];
  updateLoanPayment: UpdateLoadRequestDTO = new UpdateLoadRequestDTO;
  viewLoanModal: boolean = false;
  loanForm: NgForm;
  allLoanTypes: LoanTypeDTO [] = [];
  allInterestRates: InterestRate [] = [];
  loansCounter: number = 1;
  loading: boolean = true;
  allloanTypes: LoanType [] = [];
  dataCounter: number = 0;
  user: IVwUserObj;

  constructor(private alertMe: AlertserviceService, private loanService: AddUpdateLoanTypeServiceProxy,
     private getLoans: GetLoanRequestsServiceProxy, private loanSummaryService: GetLoanSummaryServiceProxy,
     private updateService: UpdateLoanRequestServiceProxy, private loanType: FetchLoanTypeByIdServiceProxy,
     private interestService: GetInterestRateServiceProxy, public authServ: AuthenticationService,
     private router: Router, private loanTypeService: GetLoanTypesServiceProxy) { }

  ngOnInit(): void {
    this.tempRef = `ref-${Math.ceil(Math.random() * 10e13)}`;
    this.getInterestRate();
    this.fetchAllLoanTypes();
    this.getAllLoans();

  }

  selectPanel(rolelist, i) {
    this.selectedPanel = rolelist;

    this.requestChecklist.forEach(value => {
      value.status = 'Inactive';
    });
    this.requestChecklist[i].status = 'Active';
    this.selectedCase = this.requestChecklist[i].title;

  }

  gotoNext(){
    this.pageNo = 2;
  }

  uploadFile(){
    this.loanModel.tempRef = this.tempRef;
  }

  addGuarantor(){

  }

  async makeLoanRequest(){
  this.loanModel.loggedForEmployeeId = this.user.employee_number;
  const data = await this.loanService.addUpdateLoanRequest(this.loanModel).toPromise();
  if(!data.hasError){
    this.alertMe.openModalAlert(this.alertMe.ALERT_TYPES.SUCCESS, 'Request Created', 'Dismiss');
    this.loanForm.resetForm();
  }
  else{
    this.alertMe.openModalAlert(this.alertMe.ALERT_TYPES.FAILED, 'Failure', 'Dismiss')
  }
  }

  async getAllLoans(){
    const data = await this.getLoans.getLoanRequests(null,null,1,'',10,1).toPromise();
    console.log('My data',data);
    if(!data.hasError){
      this.allLoansData = data.result;
      this.loansCounter = data.totalRecord;
      console.log('my counter', )
      if(this.loansCounter < 1) this.loading = false;

    }
  }

  async getLoanSummary(){
    const data = await this.loanSummaryService.getLoanSummary(0).toPromise();
    if(!data.hasError){
      this.loanSummary = data.result;
    }
  }

  async updateLoan(){
    const data = await this.updateService.updateLoanRequest(this.updateLoanPayment).toPromise();
    if(!data.hasError){
      this.alertMe.openModalAlert('Success', 'Loan Updated!', 'Dismiss')
    }
  }

  // async getLoanTypes(){
  //   const data = await this.loanType.fetchLoanTypeById(0,1).toPromise();
  //   if(!data.hasError){
  //     this.allLoanTypes = data.result;
  //     console.log('Here are the types', this.allLoanTypes)
  //   }
  // }

  async fetchAllLoanTypes(){
    const data = await this.loanTypeService.getLoanTypes().toPromise();
    if(!data.hasError){
      this.allloanTypes = data.result;
      this.dataCounter = data.totalRecord;
      console.log(this.dataCounter, this.allloanTypes)
  }

}

  async getInterestRate(){
    const data = await this.interestService.getInterestRate().toPromise();
    if(!data.hasError){
      this.allInterestRates = data.result;
    }
  }

  showModal(){
    this.viewLoanModal = !this.viewLoanModal;
  }

  async getLoggedInUser(){
    this.authServ.getuser().then(async (users: IVwUserObj[])=> {
      if (users) {
        if (users.length > 0) {
          this.user = users[0];
  }
  }
  })

  }

  getSelectedEmployee(event,selectType) {
    console.log(event)
     if(selectType == 'employee'){
      this.loanModel.employeeNo = event[0].employeeNumber;
      this.loanModel.employeeName = event[0].firstName +''+ event[0].firstName;
     }
     console.log(selectType, event)
  }

  getGuarantors(event,selectType) {
    console.log(event)
     if(selectType == 'employee')this.loanModel.strGuarantorIds = event[0].employeeNumber;
     console.log(selectType, event)
  }

}
