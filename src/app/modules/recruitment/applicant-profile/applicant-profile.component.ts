import { Transfer } from '@flowjs/ngx-flow';
import { UploadDocumentServiceProxy, DataServiceProxy, IDTextViewModel, State, CommonServiceProxy } from 'app/_services/service-proxies';
import { ActivatedRoute } from '@angular/router';
import { JobApplicantScheduleInterview, JobScheduleInterview, RecruitmentJobApplicationServiceProxy, RecuritmentJobApplicantServiceProxy, JobApplicantDto, JobPerferenceServiceProxy, ManageJobPreferenceDto, JobApplicantReference, JobApplicantWorkExperience, JobApplicantEducation, Country, Qualification } from './../../../_services/service-proxies';
import { AlertserviceService } from './../../../_services/alertservice.service';
import { Component, OnInit } from '@angular/core';
import { NbIconLibraries } from '@nebular/theme';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-applicant-profile',
  templateUrl: './applicant-profile.component.html',
  styleUrls: ['./applicant-profile.component.scss']
})
export class ApplicantProfileComponent implements OnInit {

  // recruitmentAction = [
  //   {id: 0, label:'Interviewed'},
  //   {id: 1, label:'Shortlisted'},
  //   {id: 2, label:'Offer'},
  //   {id: 3, label:'Hired'},
  // ]
  pageTitle: string = 'Profile';
  title: string = 'Set up your account';
  src: string = 'assets/icons/camera.jpg';
  selectedPanel: string = '';
  showModulesModal = false;
  modalPosition = 'Center';
  reference = '';
  beginSetup = true;
  updateProfile: boolean = false;
  newWork: boolean = false;
  jobInterview: JobApplicantScheduleInterview = new JobApplicantScheduleInterview();
  profileData: JobApplicantDto = new JobApplicantDto().clone();
  isApplicant: boolean = false;
  isInterviewer: boolean = true;
  isAdmin: boolean = false;
  applicantId: number = 0;
  skills: [] = [];
  addReferences: boolean = false;
  addSkiils: boolean = false;
  addEducation: boolean = false;
  preferenceModel: ManageJobPreferenceDto = new ManageJobPreferenceDto();
  addJobPreference: boolean = false;
  btnprocessing: boolean = false;
  tempRef:string;
  allCountries: Country [] = [];
  Entity: IDTextViewModel[] = [];
  entityId:number = 0;
  recruitmentAction: IDTextViewModel[] = [];
  referenceModel: JobApplicantReference = new JobApplicantReference();
  workExperienceModel: JobApplicantWorkExperience = new JobApplicantWorkExperience();
  educationModel: JobApplicantEducation = new JobApplicantEducation();
  allStates: State [] = [];
  qualificationData: Qualification [] = [];

  constructor(iconsLibrary: NbIconLibraries, private alertMe: AlertserviceService, private route: ActivatedRoute,
    private router: Router, private ineterview: RecruitmentJobApplicationServiceProxy, private preference: JobPerferenceServiceProxy,
     private profile: RecuritmentJobApplicantServiceProxy, private UploadDocumentService: UploadDocumentServiceProxy,
     private DataService: DataServiceProxy, private commonService: CommonServiceProxy ) {
    iconsLibrary.registerFontPack('ion', { iconClassPrefix: 'ion' });
    iconsLibrary.registerFontPack('fa', { packClass: 'fa', iconClassPrefix: 'fa' });
    iconsLibrary.registerFontPack('far', { packClass: 'far', iconClassPrefix: 'fa' });
  }
  ngOnInit(): void {
    this.applicantId = Number(this.route.snapshot.paramMap.get("id"));
    this.tempRef = `ref-${Math.ceil(Math.random() * 10e13)}`;
    this.getCountries();
    this.fetchCountries();
    this.getEntity();
    this.fetchQualifications();
    this.fetchRecActions();
    
  }

  scheduleInterview(){
    this.ineterview.addUpdateScheduleJobInterviews(this.jobInterview).subscribe(data => {
      if(!data.hasError){
        this.alertMe.openModalAlert(this.alertMe.ALERT_TYPES, data.message, 'Dismiss').subscribe(res => {
          this.router.navigateByUrl('')
        })
      }
    });

  }

  updateWorkExperience(){

  }

  openScorecard(){
    this.router.navigateByUrl('/interviewers/evaluation');
  }

  async getEntity() {
    const data = await this.DataService.docEntityTypes().toPromise()
    if (!data.hasError) {
      this.Entity = data.result
      console.log('doc', this.Entity)
    }
    else {
      return data.hasError[0]
    }
  }
  selectedFile(files: Transfer, title) {
     const refNumber =  this.tempRef
    console.log('temp ref', this.tempRef)
    if (this.Entity.length > 0) {
      let srchR = this.Entity.find(f => f.text == "Apllicant Document");
      this.entityId = srchR.id;
    }

    this.UploadDocumentService.uploadDocs(0, title, 0, this.entityId, false, refNumber, files.flowFile.file[0])
      .subscribe(data => {
      if (!data.hasError) {
        console.log('ref',this.tempRef)
        if (!data.hasError) {
          this.alertMe.openModalAlert(this.alertMe.ALERT_TYPES.SUCCESS, data.message, 'OK');

        } else {
          this.alertMe.openModalAlert(this.alertMe.ALERT_TYPES.FAILED, data.message, 'OK')
        }
      }
    });
  }

  async fetchQualifications(){
    const data = await this.commonService.getQualifications().toPromise();
    if(!data.hasError){
      this.qualificationData = data.result;
      console.log('qualification:', this.qualificationData)
    }
  }

  fetchProfile(){
    this.profile.getApplicantById(this.applicantId).subscribe(data => {
      if(!data.hasError){
        this.profileData = data.result;
      }
    })
  }

  async fetchRecActions(){
    const data = await this.DataService.getRecruitmentAction().toPromise();
    if(!data.hasError){
      this.recruitmentAction = data.result;
    }
  }

  async fetchCountries(){
    const data = await this.DataService.getCountries().toPromise();
    if(!data.hasError){
      this.allCountries = data.result;
    }
  }

  toggleNewWork(){
    this.newWork = !this.newWork
  }

  toggleSkills(){
    this.addSkiils = !this.addSkiils

  }

  addPreference(){
    this.preference.addUpdateJobPreference(this.preferenceModel).subscribe(data => {
      if(!data.hasError){
        this.alertMe.openModalAlert(this.alertMe.ALERT_TYPES.SUCCESS, 'Preference Media', 'Dismiss')
      }
    })
  }

  toggleEducation(){
    this.addEducation = !this.addEducation;
  }

  toggleReferences(){
    this.addReferences = !this.addReferences

  }

  addNewWork(){
    this.newWork = !this.newWork;
  }

  updateMyProfile(){
    this.btnprocessing = true;
    this.updateProfile = !this.updateProfile;
    this.profile.completeApplicantProfile(this.profileData).subscribe(data => {
      this.btnprocessing = false;
      if(!data.hasError && data.result.isSuccessful == true){
        this.alertMe.openModalAlert(this.alertMe.ALERT_TYPES, data.message, 'Dismiss')
      }
    })

  }

  updateReferences(){

  }

  updateSkills(){
    // this.profileData.skills =
  }

 async getCountries(){
  // const data = await this.
  }


}
