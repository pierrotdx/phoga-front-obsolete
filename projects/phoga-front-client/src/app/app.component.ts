import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SearchPageComponent } from './pages';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SearchPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'phoga-front-client';
  constructor() {}
}
