// auth.service.ts
import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from './auth.config';

import { UserModel } from '../models/userVM';

import { UserService } from '../services/user.services';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

    private userProfile: UserModel | null = null;
    private loginProcessed = false;

  constructor(private oauthService: OAuthService, private userService: UserService) {
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
      email: claim.email,
      userId: claim.name,
      picture: claim.picture
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
}
