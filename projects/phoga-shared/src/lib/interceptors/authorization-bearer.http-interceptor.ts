import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, from, map, switchMap } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthorizationBearerInterceptor implements HttpInterceptor {
  private readonly AdminUrlFragment = '/restricted';

  constructor(private readonly authenticationService: AuthenticationService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const isAdminRoute = req.url?.includes(this.AdminUrlFragment);
    if (!isAdminRoute) {
      return next.handle(req);
    }

    const accessToken$ = from(this.authenticationService.getAccessToken());
    return accessToken$.pipe(
      map((accessToken) => this.getReqWithAuthBearer(req, accessToken)),
      switchMap((reqWithAuthBearer) => next.handle(reqWithAuthBearer))
    );
  }

  private readonly getReqWithAuthBearer = (
    req: HttpRequest<any>,
    accessToken: string
  ): HttpRequest<any> => {
    const headers = req.headers.append(
      'Authorization',
      `Bearer ${accessToken}`
    );
    const authReq = req.clone({ headers });
    return authReq;
  };
}
