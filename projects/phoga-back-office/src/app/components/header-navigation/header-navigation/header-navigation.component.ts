import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthenticationService } from 'phoga-shared';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-header-navigation',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, RouterLink, RouterLinkActive],
  templateUrl: './header-navigation.component.html',
})
export class HeaderNavigationComponent {
  public readonly isAuthenticated$ = new ReplaySubject<boolean>();

  constructor(private readonly authenticationService: AuthenticationService) {
    this.isAuthenticated$ = this.authenticationService.isAuthenticated$;
  }

  public readonly login = () => this.authenticationService.loginWithRedirect();

  public readonly logout = async () => this.authenticationService.logout();
}
