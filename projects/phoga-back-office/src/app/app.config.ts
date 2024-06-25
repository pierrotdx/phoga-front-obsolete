import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import {
  HTTP_INTERCEPTORS,
  HttpClientModule,
  provideHttpClient,
} from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  AuthenticationService,
  AuthorizationBearerInterceptor,
  CacheHttpInterceptor,
} from 'phoga-shared';
import { environment } from '../environments/environment';
import { provideAuth0 } from '@auth0/auth0-angular';

const cache = new CacheHttpInterceptor(environment);

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(HttpClientModule),
    {
      provide: HTTP_INTERCEPTORS,
      useValue: cache,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthorizationBearerInterceptor,
      multi: true,
      deps: [AuthenticationService],
    },
    provideRouter(routes),
    provideHttpClient(),
    provideAuth0({
      domain: environment.auth0_domain,
      clientId: environment.auth0_clientId,
      authorizationParams: {
        redirect_uri: window.location.origin,
        audience: environment.auth0_audience,
        scope: 'email profile',
      },
      useRefreshTokens: true,
    }),
    provideAnimations(),
    provideAnimationsAsync(),
  ],
};
