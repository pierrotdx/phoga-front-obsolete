import { Component } from '@angular/core';
import { EditPhotoFormComponent } from '../../components/edit-photo-form/edit-photo-form.component';
import { PhotosApiAdminService } from '../../services';
import { Photo } from 'phoga-shared';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-edit-photo-page',
  standalone: true,
  imports: [EditPhotoFormComponent],
  templateUrl: './edit-photo-page.component.html',
})
export class EditPhotoPageComponent {
  constructor(private readonly photosApiAdminService: PhotosApiAdminService) {}

  public readonly onPhotoSave = async (
    savedPhoto?: Partial<Photo & { file: File }>
  ) => {
    if (!savedPhoto) {
      return;
    }
    if (savedPhoto._id) {
      await firstValueFrom(this.photosApiAdminService.patchPhoto(savedPhoto));
    } else {
      await firstValueFrom(this.photosApiAdminService.createPhoto(savedPhoto));
    }
  };
}
