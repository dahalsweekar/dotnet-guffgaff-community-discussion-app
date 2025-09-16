import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  redirectUri: window.location.origin + '/create-profile',
  clientId: '570568481433-a65s6poh9cf15127u07h16uokqahsug1.apps.googleusercontent.com',
  dummyClientSecret: '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',
  responseType: 'code',
  scope: 'openid profile email',
  showDebugInformation: true,
  strictDiscoveryDocumentValidation: false,
  useSilentRefresh: true
};
