import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from './auth.config';

import { HttpClient } from "@angular/common/http";
import { Inject, PLATFORM_ID } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";

import { UserModel } from '../models/userVM';

import { UserService } from '../services/user.services';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

    private userProfile: UserModel | null = null;
    private loginProcessed = false;

    private loginApi: string = '/api/login'

  constructor(private oauthService: OAuthService, private userService: UserService, private http: HttpClient, private router: Router, @Inject(PLATFORM_ID) private platformId: any) {
    this.configureOAuth();
  }

  private async configureOAuth() {
    this.oauthService.configure(authConfig);
    await this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      if (this.oauthService.hasValidAccessToken()) {
        this.loginProcessed = true;
      } else {
        this.loginProcessed = false;
      }
    });
    this.oauthService.setupAutomaticSilentRefresh();
  }

  public login(): void {
      this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      if (!this.oauthService.hasValidAccessToken()) {
          this.oauthService.initCodeFlow();
          this.loginProcessed = true;
      }
    });
  }

  public logout(): void {
    this.oauthService.logOut();
  }

  get whenLoginProcessed(): Promise<void> {
    return new Promise(resolve => {
      const check = () => {
        if (this.loginProcessed) resolve();
        else setTimeout(check, 50);
      };
      check();
    });
  }
  
  public get user(): UserModel | null {
    var claim = this.identityClaims;
    this.userProfile = {
      Email: claim.email,
      Name: claim.name,
      Picture: claim.picture
    };
    return this.userProfile;
  }

  public get isLoggedIn(): boolean {
    return this.oauthService.hasValidAccessToken();
  }

  public get identityClaims(): any {
    return this.oauthService.getIdentityClaims();
  }

  public get accessToken(): string {
    return this.oauthService.getAccessToken();
  }

  localLoginfn(user: any): Observable<any>{
    return this.http.post(this.loginApi, user);
  }
}
