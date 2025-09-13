import { Injectable } from '@angular/core';
import { OAuthStorage } from 'angular-oauth2-oidc';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class StorageService implements OAuthStorage {
  constructor(private cookieService: CookieService) {}

  getItem(key: string): string | null {
    const value = this.cookieService.get(key);
    return value || null;
  }

  setItem(key: string, value: string): void {
    this.cookieService.set(key, value, {
      path: '/',
      sameSite: 'Lax',
      secure: false
    });
  }

  removeItem(key: string): void {
    this.cookieService.delete(key, '/');
  }
}
