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
import { CacheHttpInterceptor } from 'phoga-shared';
import { environment } from '../environments/environment';

const cache = new CacheHttpInterceptor(environment);

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(HttpClientModule),
    {
      provide: HTTP_INTERCEPTORS,
      useValue: cache,
      multi: true,
    },
    provideRouter(routes),
    provideHttpClient(),

    provideAnimations(),
    provideAnimationsAsync(),
  ],
};
