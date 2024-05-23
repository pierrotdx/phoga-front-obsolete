import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header-navigation',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, RouterLink, RouterLinkActive],
  templateUrl: './header-navigation.component.html',
})
export class HeaderNavigationComponent {}
