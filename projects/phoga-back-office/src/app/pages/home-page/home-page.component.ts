import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from 'phoga-shared';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {
  constructor(public readonly authenticationService: AuthenticationService) {}

  public readonly login = async () =>
    await this.authenticationService.loginWithRedirect();
}
