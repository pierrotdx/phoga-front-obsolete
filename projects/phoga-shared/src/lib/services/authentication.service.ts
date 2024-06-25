import { Injectable } from '@angular/core';
import { AuthService, User } from '@auth0/auth0-angular';
import {
  BehaviorSubject,
  ReplaySubject,
  combineLatest,
  filter,
  map,
  switchMap,
  tap,
} from 'rxjs';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  public readonly accessToken$ = new BehaviorSubject<string>('');
  public readonly isAuthenticated$ = new ReplaySubject<boolean>();
  public readonly user$ = new ReplaySubject<User | null | undefined>();

  constructor(private readonly authService: AuthService) {
    this.initIsAuthenticated();
    this.initUser();
  }

  private readonly initIsAuthenticated = async () => {
    const isAuthenticated$ = combineLatest([
      this.authService.isAuthenticated$,
      this.waitFinishLoading(),
    ]);
    isAuthenticated$.subscribe(([isAuthenticated]) => {
      this.isAuthenticated$.next(isAuthenticated);
    });
    // artificially triggering emission to init value
    await firstValueFrom(isAuthenticated$);
  };

  private readonly initUser = async () => {
    const user$ = combineLatest([
      this.authService.user$,
      this.waitFinishLoading(),
    ]);
    user$.subscribe(([user, finishedLoading]) => {
      this.user$.next(user);
    });
    // artificially triggering emission to init value
    await firstValueFrom(user$);
  };

  public readonly loginWithRedirect = async () => {
    await firstValueFrom(this.authService.loginWithRedirect());
  };

  public readonly logout = async () => {
    const logout$ = this.authService.logout();
    await firstValueFrom(
      logout$.pipe(
        switchMap(this.waitFinishLoading),
        tap(this.resetAccessToken)
      )
    );
  };

  public readonly getAccessToken = async () => {
    const currentToken = await firstValueFrom(this.accessToken$);
    if (currentToken) {
      return currentToken;
    }
    await this.setAccessToken();
    const newToken = await firstValueFrom(this.accessToken$);
    return newToken;
  };

  private readonly waitFinishLoading = () =>
    this.authService.isLoading$.pipe(
      filter((isLoading) => !isLoading),
      map((isLoading) => !isLoading)
    );

  private readonly setAccessToken = async (isAuthenticated?: boolean) => {
    const isLoggedIn =
      typeof isAuthenticated === 'boolean'
        ? isAuthenticated
        : await firstValueFrom(this.isAuthenticated$);
    if (!isLoggedIn) {
      await this.loginWithRedirect();
      return;
    }
    const accessToken = await firstValueFrom(
      this.authService.getAccessTokenSilently()
    );
    this.accessToken$.next(accessToken);
  };

  private readonly resetAccessToken = () => {
    this.accessToken$.next('');
  };
}
