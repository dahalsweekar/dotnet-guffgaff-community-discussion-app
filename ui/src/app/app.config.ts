import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection, importProvidersFrom  } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import {
  OAuthModule,
  OAuthStorage,
  OAuthService,
  UrlHelperService,
  OAuthLogger,
  DateTimeProvider
} from 'angular-oauth2-oidc';

import { CookieService } from 'ngx-cookie-service';
import { StorageService } from './services/storage.services';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(),
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
