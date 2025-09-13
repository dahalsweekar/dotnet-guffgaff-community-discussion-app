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

  constructor(private oauthService: OAuthService, private userService: UserService) {
    this.configureOAuth();
  }

  private configureOAuth(): void {
    this.oauthService.configure(authConfig);
    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      if (this.oauthService.hasValidAccessToken()) {
        console.log('Access Token:', this.oauthService.getAccessToken());
        console.log('ID Token:', this.oauthService.getIdToken());
        console.log('User Info:', this.oauthService.getIdentityClaims());
      } else {
        console.log('Not logged in');
      }
    });
    this.oauthService.setupAutomaticSilentRefresh();
  }

  public getIdentity(): void {
    const claims: any = this.identityClaims;
    if (claims) {
      this.userProfile = {
        userId: claims.name,
        email: claims.email,
        picture: claims.picture,
        ...claims
      };
    }
  }

  public get user(): UserModel | null {
    return this.userProfile;
  }

  public login(): void {
      this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      if (!this.oauthService.hasValidAccessToken()) {
          this.oauthService.initCodeFlow();
      }
    });
  }

  public logout(): void {
    this.oauthService.logOut();
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
