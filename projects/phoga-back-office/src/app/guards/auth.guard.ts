import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthenticationService } from 'phoga-shared';
import { firstValueFrom } from 'rxjs';

export const authGuard =
  (): CanActivateFn =>
  async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const isAuthenticated = await firstValueFrom(
      inject(AuthenticationService).isAuthenticated$
    );
    if (isAuthenticated) {
      return true;
    }
    console.error('access refused: not authenticated');
    return false;
  };
