import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthorizationBearerInterceptor implements HttpInterceptor {
  private accessToken$: BehaviorSubject<string>;

  private readonly AdminUrlFragment = '/restricted';

  constructor(private readonly authenticationService: AuthenticationService) {
    this.accessToken$ = this.authenticationService.accessToken$;
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const isAdminRoute = req.url?.includes(this.AdminUrlFragment);
    if (!isAdminRoute) {
      return next.handle(req);
    }
    const accessToken = this.accessToken$.getValue();
    const headers = req.headers.append(
      'Authorization',
      `Bearer ${accessToken}`
    );
    const authReq = req.clone({ headers });
    return next.handle(authReq);
  }
}
