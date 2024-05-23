import { Component } from '@angular/core';
import { GalleryComponent } from 'phoga-shared';

@Component({
  selector: 'app-edit-gallery-page',
  standalone: true,
  imports: [GalleryComponent],
  templateUrl: './edit-gallery-page.component.html',
})
export class EditGalleryPageComponent {}
