import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-applicants-dashboard',
  templateUrl: './applicants-dashboard.component.html',
  styleUrls: ['./applicants-dashboard.component.scss']
})
export class ApplicantsDashboardComponent implements OnInit {

  pageTitle: string = 'Recent Listings';
  constructor() { }

  ngOnInit(): void {
  }

}