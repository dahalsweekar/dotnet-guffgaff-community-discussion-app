import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, importProvidersFrom  } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { loadingInterceptorFn } from './intercepter/loading.intercepter';
import {
  OAuthModule,
  OAuthStorage,
} from 'angular-oauth2-oidc';

import { CookieService } from 'ngx-cookie-service';
import { StorageService } from './services/storage.services';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withHashLocation()),
    provideHttpClient(withInterceptors([
        loadingInterceptorFn
      ])),
    importProvidersFrom(
      OAuthModule.forRoot()
    ),
    CookieService,                    
    {
      provide: OAuthStorage,         
      useClass: StorageService
    }
  ]
};
