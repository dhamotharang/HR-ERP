import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'app/components/base/base.component';
import { FormConfig, FORM_TYPES } from 'app/components/custom-form/custom-form.component';
import { ChoiceName } from 'app/components/multi-select/multi-select.component';
import { ColumnTypes, TableAction, TableActionEvent, TableColumn } from 'app/components/tablecomponent/models';
import { AssetBaseComponent } from 'app/modules/asset-management/pages/asset-category/asset-category.component';
import { AlertserviceService } from 'app/_services/alertservice.service';
import { ConfirmBoxService } from 'app/_services/confirm-box.service';
import { ExpenseProjectActivityService, MyExpenseProjectActivity } from '../services/expense-group.service';
import { MyExpenseRequest, ExpenseRequestService } from '../services/expense-request.service';
import { GetExpenseProjectServiceProxy, GetExpenseTypesServiceProxy } from 'app/_services/service-proxies';


enum TABS { ALL__REQUESTS, APPROVED, PENDING, DECLINED, }
enum TOP_ACTIONS { CREATE_NEW, }
enum ACTIONS {EDIT = '1', DELETE = '2'}


@Component({
  selector: 'ngx-expense-request',
  templateUrl: './expense-request.component.html',
  styleUrls: ['./expense-request.component.scss']
})
export class ExpenseRequestComponent extends AssetBaseComponent<any, any>{
  constructor(
    protected api: ExpenseRequestService,
    protected confirmBoxService: ConfirmBoxService,
    protected alertService: AlertserviceService,
    private activatedRoute: ActivatedRoute,
  ) {
    super(confirmBoxService);
  }
  objectName = 'Expense Request';
  getTableColumns(): TableColumn[] {
    return [
      { name: 'date', title: 'REF ID' },
      { name: 'date', title: 'Employee' },
      { name: 'date', title: 'Project' },
      { name: 'date', title: 'Type' },
      { name: 'date', title: 'Amount' }
    ];
  }
  formConfig = {
    fields: [
      // {name: 'name', label: 'Name', type: FORM_TYPES.text},
      // {name: 'actionTitle', label: 'Title', type: FORM_TYPES.text},
      // {name: 'code', label: 'Code', type: FORM_TYPES.text},
      // {name: 'referenceId', label: 'Reference ID', type: FORM_TYPES.text},
      // {name: 'ban', label: 'BAN', type: FORM_TYPES.checkbox},
      // {name: 'closedEnded', label: 'Close Ended', type: FORM_TYPES.checkbox},
      // {name: 'range', label: 'Range', type: FORM_TYPES.date_range},
      // {name: 'description', label: 'Description', type: FORM_TYPES.wysiwyg},
    ]
  };
  getFormConfig(): FormConfig {
    return {
      fields: [
        {name: 'name', label: 'Name', type: FORM_TYPES.text},
        {name: 'actionTitle', label: 'Title', type: FORM_TYPES.text},
        {name: 'code', label: 'Code', type: FORM_TYPES.text},
        {name: 'referenceId', label: 'Reference ID', type: FORM_TYPES.text},
        {name: 'ban', label: 'BAN', type: FORM_TYPES.text},
        {name: 'closedEnded', label: 'Close Ended', type: FORM_TYPES.checkbox},
        {name: 'range', label: 'Range', type: FORM_TYPES.date_range},
        {name: 'description', label: 'Description', type: FORM_TYPES.wysiwyg},
      ]
    };
  }
  filter = {};
  getNewEditingData(): MyExpenseRequest {
    return new MyExpenseRequest();
  }

  projects = [];
  types = [];
}