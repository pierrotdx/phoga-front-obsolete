import { Location } from '@angular/common';
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
  constructor(
    private readonly location: Location,
    private readonly photosApiAdminService: PhotosApiAdminService
  ) {}

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
    this.navigateBack();
  };

  public readonly onDelete = async (photoId: Photo['_id']) => {
    if (!photoId) {
      throw new Error('delete failed: no photo id provided');
    }
    const isSuccess = await firstValueFrom(
      this.photosApiAdminService.deletePhoto(photoId)
    );
    if (isSuccess) {
      this.navigateBack();
    }
  };

  private readonly navigateBack = () => {
    this.location.back();
  };
}
