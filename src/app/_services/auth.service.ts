import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { User } from '../_models/user';
import { customConfig } from '../custumConfig';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {
  Urlbase: string = customConfig.baseUrl;
  main_id = 0;
  user: User = {};
  authstatus: boolean = false;
  constructor(public authServ: AuthenticationService,
    public http: HttpClient, public navCtrl: Router) { }

  public async isAuthenticated() {
    return new Promise((resolve, reject) => {
      this.authServ.getuser().then(async (users: any[]) => {
        if (users.length > 0) {
          //  console.log(users[0]);
          this.user = users[0];
          // console.log(this.user)
          if (this.user) {
            const auStatus = true;
            resolve(true);
            this.authstatus = auStatus;
          } else {
            this.authServ.clearusers();
            resolve(false);
          }
        } else {
          this.authServ.clearusers();
          resolve(false);
        }
      });
    });

  }

  logout() {
    this.authServ.clearusers();
    this.navCtrl.navigate(['login']);
  }

  login(rememberMe: boolean, email: string, password: string) {
    const endPoint: string = '/api/Account/Login';
    const payload = new HttpParams()
      .set('email', email)
      .set('password', password)
      .set('rememberMe', String(rememberMe));
    return this.http.post(this.Urlbase + endPoint, payload)
      .pipe(catchError(this.handleError<any>('login')));
  }

  socialMediaLogin() {
  }

  register(registrationData) {
    const endPoint: string = '/api/Account/Register';
    return this.http.post(this.Urlbase + endPoint, registrationData)
      .pipe(catchError(this.handleError<any>('userRegistration')));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      return of(error);
    };
  }
}
