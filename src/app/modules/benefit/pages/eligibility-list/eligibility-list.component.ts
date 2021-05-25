import { Component, OnInit } from "@angular/core";
import { ColumnTypes } from "app/components/tablecomponent/models";
import { MainBaseComponent } from "app/components/main-base/main-base.component";
import {
  AddUpdateBenefitEligibilityServiceProxy,
  DeleteBenefitEligibilityServiceProxy,
  ManageBenefitEligibilityDTO,
  FetchAllEligibilitiesServiceProxy,
  BenefitEligibilityDTO, DataServiceProxy,
  CommonServiceProxy, Position,
  FetchBenefitEligibilityServiceProxy,IDTextViewModel,
} from "../../../../_services/service-proxies";
import { AlertserviceService } from "app/_services/alertservice.service";
import { Transfer } from "@flowjs/ngx-flow";
import { Router, ActivatedRoute } from "@angular/router";
import {
  ACTIONS,
  TableAction,
  TableActionEvent,
} from "app/components/tablecomponent/models";
import { IStatus, MyColor } from "app/components/status/models";

export class eligibilityWithStatus extends BenefitEligibilityDTO implements IStatus {
  eligib: BenefitEligibilityDTO;

  constructor(eligib: BenefitEligibilityDTO) {
    super(eligib);
    this.eligib = eligib;

  }

  getStatusLabel() {
    if (this.eligib.status === 1) return 'Pending';
    if (this.eligib.status === 2) return 'Approved';
    if (this.eligib.status === 3) return 'Rejected';

  }
  getStatusColor() {
    if (this.eligib.status === 1) return new MyColor(242, 153, 74);
    if (this.eligib.status ===2) return new MyColor(0, 153, 74);
    if (this.eligib.status=== 3) return new MyColor(242, 0, 74);
    return new MyColor(253, 238, 238);
  }
}
enum TABS {
  OPEN,
  CLOSED,
}
enum TOP_ACTIONS {
  CREATE_NEW,
}

enum TABLE_ACTION {
  VIEW = "1",
  DELETE = "2",
  EDIT = "3",
}

@Component({
  selector: "ngx-eligibility-list",
  templateUrl: "./eligibility-list.component.html",
  styleUrls: ["./eligibility-list.component.scss"],
})
export class EligibilityListComponent extends MainBaseComponent {
  status?: number = 2;
  pageSize?: number = 1000;
  pageNumber?: number = 1;
  showPlan: boolean = false;
  submitbtnPressed: boolean = false;
  selectionHeader: string = "Select Employee";
  addbtnText: string = "Add Employee";
  eligibility = new ManageBenefitEligibilityDTO().clone();
  Eligibility = [];
  loading: boolean = false;
  totalItems = 0;
  currentPage = 1;
  Benefit: IDTextViewModel[] = [];
  Position: Position[] =[];

  // Eligibilty = new ManageBenefitEligibilityDTO().clone();
  topActionButtons = [
    { name: "CREATE_NEW", label: "Create new", icon: "plus", outline: false },
  ];
  TOP_ACTIONS = TOP_ACTIONS;
  TABS = TABS;
  selectedTab = TABS.OPEN;
  data = [];
  tableColumns = [
    { name: "name", title: "Name",type: ColumnTypes.Text },
    { name: "dateCreated", title: "Date Created",type: ColumnTypes.Date },
    { name: "generatedBy", title: "Generated By",type: ColumnTypes.Text },
    { name: "status", title: "Status",type: ColumnTypes.Status },
  ];

  tableActions: TableAction[] = [
    { name: TABLE_ACTION.VIEW, label: "View" },
    { name: TABLE_ACTION.EDIT, label: "UpdateList" },
    { name: TABLE_ACTION.DELETE, label: "Delete" },
  ];

  constructor(
    private alertservice: AlertserviceService,
    private AddUpdateBenefitEligibilityServiceProxy: AddUpdateBenefitEligibilityServiceProxy,
    private router: Router,
    private FetchAllEligibilitiesServiceProxy: FetchAllEligibilitiesServiceProxy,
    private DeleteBenefitEligibilityServiceProxy: DeleteBenefitEligibilityServiceProxy,
    private FetchBenefitEligibilityServiceProxy: FetchBenefitEligibilityServiceProxy,
    private  DataServiceProxy: DataServiceProxy,private CommonServiceProxy:CommonServiceProxy
  ) {
    super();
  }

  tableActionClicked(event: TableActionEvent) {
    if (event.name == TABLE_ACTION.DELETE) {
      this.alertservice
        .openModalAlert(
          this.alertservice.ALERT_TYPES.CONFIRM,
          "Do you want to delete this?",
          "Yes"
        )
        .subscribe((dataAction) => {
          if (dataAction == "closed") {
            this.DeleteBenefitEligibilityServiceProxy.deleteBenefitEligibility(
              event.data.id
            ).subscribe((myData) => {
              if (!myData.hasError && myData.result.isSuccessful == true) {
                this.alertservice
                  .openModalAlert(
                    this.alertservice.ALERT_TYPES.SUCCESS,
                    "Benefit Eligibilty has been deleted",
                    "Success"
                  )
                  .subscribe((delData) => {
                    if (delData)
                      this.router.navigateByUrl("/benefits/eligibility");
                  });
              }
            });
          }
        });
    }

    if (event.name == TABLE_ACTION.VIEW) {
      alert(event.data.id);
      this.router.navigateByUrl("/benefits/eligibilityView/" + event.data.id);
      // this.FetchBenefitEligibilityServiceProxy.getBenefitEligibility(event.data.id).toPromise().then(
      //   res=>
      // )
    }
  }
  getSelectedEmployee(event, selectType) {
    if (selectType == "employee") {
      event.forEach((eve) => {
        var id = eve.id;
        var idString = id.toString();
        this.eligibility.employees = idString;
      });

      console.log("benben", this.eligibility.employees);
    }
  }

  get disability() {
    if (this.eligibility.name && this.eligibility.employees) return true;
    return false;
  }
  pageActionClicked(event) {
    if (event == "CREATE_NEW") {
      this.showPlan = true;
    }
  }
  //Add benefitEligibility
  async Submit() {
    this.submitbtnPressed = true;
    const data =
      await this.AddUpdateBenefitEligibilityServiceProxy.addUpdateBenefitEligibility(
        this.eligibility
      ).toPromise();
    if (!data.hasError) {
      this.alertservice
        .openModalAlert(
          this.alertservice.ALERT_TYPES.SUCCESS,
          data.message,
          "OK"
        )
        .subscribe((datares) => {
          if (datares) {
            this.router.navigateByUrl("/benefits/eligibility");
          }
        });
      this.showPlan = false;
      this.submitbtnPressed = false;
    } else {
      this.alertservice.openModalAlert(
        this.alertservice.ALERT_TYPES.FAILED,
        data.message,
        "OK"
      );
    }
  }

  ngOnInit() {
    this.FetchAllBenefitEligibilities();
    this.getBenefits();
    this.getPosition();
  }

  //fetch all Eligibility
  FetchAllBenefitEligibilities() {
    this.loading = true
    this.FetchAllEligibilitiesServiceProxy.fetchAllBenefitEligibilities(
      this.status,
      this.pageSize,
      this.pageNumber
    )
      .toPromise()
      .then((eligibility) => {
        var res = eligibility.result.map(deply => new eligibilityWithStatus(deply));
        this.Eligibility = res;
        this.totalItems = eligibility.totalRecord;
        this.loading = false;
        console.log("eligibilit", this.Eligibility);
      });
    // if(!data.hasError){
    //   this.Eligibility = data.result
    //   this.tableData= data.result
    //   console.log('eligibilit',this.Eligibility,this.tableData)
    // }
    this.loading = false
  }


  //Benefit Type
  async getBenefits() {
    const data = await this.DataServiceProxy.getBenefitType().toPromise();
    if (!data.hasError) {
      this.Benefit = data.result;
      this.data = data.result;
      console.log(
        "i want see wetin i keep for that benefit variable",
        this.Benefit
      );
    }
  }

  async getPosition(){
    const data = await this.CommonServiceProxy.getPositions().toPromise();
    if(!data.hasError){
     this.Position = data.result;
     console.log('positions',this.Position)
    }
  }
}
