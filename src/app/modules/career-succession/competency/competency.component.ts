import { title } from 'process';
import { GradeLevelServiceProxy, GradeLevelDTO, Sector, Qualification } from './../../../_services/service-proxies';
import { Department, GetAllDepartmentsServiceProxy, DepartmentDTO, CommonServiceProxy, JobRole, DataServiceProxy, Certification, Skill } from 'app/_services/service-proxies';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-competency',
  templateUrl: './competency.component.html',
  styleUrls: ['./competency.component.scss']
})
export class CompetencyComponent implements OnInit {

  myPlanHeader: string = 'Create Competency';
  myPlanDesc: string = 'Click the button below to add a competency';

  myButton: string = 'Create New';
  scoreCardClick: boolean = false;
  newRole: boolean = false;
  myPanel: string = '';
  selectedCase: string = 'Role';
  selectedPanel: any = { title: 'Role', label: 'Role', status: 'Active'};
  competencyChecklist = [
    { title: 'Role', label: 'Role', status: 'Active' },
    { title: 'Position', label: 'Position', status: 'Inactive' }
  ];

  requirementList = [
    { title: 'Skill', label: 'Skills'},
    { title: 'training', label: 'Training'},
    { title: 'qualfication', label: 'Qualfication'},
    { title: 'certification', label: 'Certification'},
    { title: 'experience', label: 'Experience'},

  ];

  allDepartments: DepartmentDTO [] = [];
  allJobRoles: JobRole [] = [];
  allGradeLevels: GradeLevelDTO [] = [];
  skillData: Skill [] = [];
  certificationData: Certification [] = [];
  qualificationData: Qualification [] = [];
  requirement: string = 'Skills';

  constructor(private department: GetAllDepartmentsServiceProxy, private commonService: CommonServiceProxy,
    private levels: GradeLevelServiceProxy, private dataService: DataServiceProxy) { }

  ngOnInit(): void {
    this.fetchAllDepartments();
    this.fetchAllJobRoles();
    this.fetchAllLevels();
    this.fetchCertifications();
    this.fetchQualifications();
    this.fetchSkills();
  }

  toggleRequirement(e){
    this.requirement = e;
  }

  createCompetency(){

  }

  async fetchSkills(){
    const data = await this.commonService.getSkills().toPromise();
    if(!data.hasError){
      this.skillData = data.result;
      console.log('Skills:', this.skillData);
    }
  }

  addCertification(){

  }

  async fetchCertifications(){
    const data = await this.commonService.getCertifications().toPromise();
    if(!data.hasError){
      this.certificationData = data.result;
      console.log('Certifications:', this.certificationData)
    }
  }

  addQualification(){

  }

  async fetchQualifications(){
    const data = await this.commonService.getQualifications().toPromise();
    if(!data.hasError){
      this.qualificationData = data.result;
      console.log('qualification:', this.qualificationData)
    }
  }

  selectPanel(rolelist, i) {
    this.selectedPanel = rolelist;

    this.competencyChecklist.forEach(value => {
      value.status = 'Inactive';
    });
    this.competencyChecklist[i].status = 'Active';
    this.selectedCase = this.competencyChecklist[i].title;

  }

  async fetchAllDepartments(){
    const data = await this.department.getAllDepartments(10,1).toPromise();
    if(!data.hasError){
      this.allDepartments = data.result;
    }
  }

  async fetchAllLevels(){
    const data = await this.levels.getAllGradeLevel(10,1,1,1).toPromise();
    if(!data.hasError){
      this.allGradeLevels = data.result;
    }
  }

  async fetchAllJobRoles(){
    const data = await this.commonService.getJobRoles().toPromise();
    if(!data.hasError){
      this.allJobRoles = data.result;
      console.log('Yo boss', this.allJobRoles)
    }
  }

  toggleScoreCard(event) {
    this.scoreCardClick = !this.scoreCardClick;
  }

  addRole(){

  }

  addCadre(){

  }

}
