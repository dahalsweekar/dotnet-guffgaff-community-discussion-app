// auth.service.ts
import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from './auth.config';

import { UserModel } from '../models/userVM';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

    private userProfile: UserModel | null = null;

  constructor(private oauthService: OAuthService) {
    this.configureOAuth();
  }

  private configureOAuth(): void {
    this.oauthService.configure(authConfig);
    this.oauthService.setupAutomaticSilentRefresh(); // Optional: Silent refresh
  }

  public getIdentity(): UserModel | null {
    const claims: any = this.identityClaims;
    if (claims) {
      this.userProfile = {
        userId: claims.name,
        email: claims.email,
        picture: claims.picture,
        ...claims
      };
    }
    return this.userProfile;
  }

  public get user(): UserModel | null {
    return this.userProfile;
  }

  public login(): void {
    debugger;
    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
        if (!this.oauthService.hasValidAccessToken()) {
        this.oauthService.initCodeFlow(); // Initiates the redirect to the IdP
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
