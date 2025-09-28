import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class UserService{

    private saveUserCredentialsApi: string = '/api/saveusercredentials'
    private getUserCredentialsApi: string = '/api/getusercredentials'
    private checkNotificationsApi: string = '/api/checknotifications';
    private updateNotificationStatusApi: string = '/api/updatenotificationstatus';
    private validateUserNameApi: string = '/api/validateusername';
    private sendEmailApi = '/api/sendemail'
    private verifyotpApi = '/api/verifyotp'
    private SaveNewPasswordApi = '/api/savenewpassword'

    constructor(private http: HttpClient, private router: Router, @Inject(PLATFORM_ID) private platformId: any){

    }

    saveUserCredentialsfn(user: any): Observable<any> {
        return this.http.post(this.saveUserCredentialsApi, user);
    }

    getUserCredentialsfn(user: any): Observable<any>{
        return this.http.post(this.getUserCredentialsApi, user);
    }

    checkNotificationsfn(user: any): Observable<any>{
        return this.http.post(this.checkNotificationsApi, user);
    }

    updateNotificationStatusfn(notice: any): Observable<any>{
        return this.http.post(this.updateNotificationStatusApi, notice);
    }

    validateUserNamefn(user: any): Observable<any>{
        return this.http.post(this.validateUserNameApi, user);
    }

      sendEmailfn(emailPackage: any): Observable<any>{
        return this.http.post(this.sendEmailApi, emailPackage);
    }
    verifyOTPfn(otp: any): Observable<any>{
        return this.http.post(this.verifyotpApi, otp);
    }
    saveNewPasswordfn(userDetail: any): Observable<any>{
        return this.http.post(this.SaveNewPasswordApi, userDetail);
    }
}