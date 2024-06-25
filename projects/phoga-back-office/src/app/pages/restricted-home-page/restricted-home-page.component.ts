import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-restricted-home-page',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './restricted-home-page.component.html',
})
export class RestrictedHomePageComponent {}
