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

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(
      OAuthModule.forRoot({
        resourceServer: {
          allowedUrls: ['http://localhost:4200'],
          sendAccessToken: true
        }
      })
    ),
    OAuthService,
    UrlHelperService,
    { provide: OAuthStorage, useValue: localStorage },
    { provide: OAuthLogger, useValue: console },
    {provide: DateTimeProvider, useValue: console}
  ]
};
