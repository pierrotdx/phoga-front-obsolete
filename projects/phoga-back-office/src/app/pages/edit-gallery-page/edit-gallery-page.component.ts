import { Component } from '@angular/core';
import {
  GalleryComponent,
  GetImage,
  GetTitle,
  GetPhotosMetadata,
} from 'phoga-shared';
import { PhotosApiAdminService } from '../../services';
import { SharedPhotosService } from '../../../../../phoga-client/src/app/services';

@Component({
  selector: 'app-edit-gallery-page',
  standalone: true,
  imports: [GalleryComponent],
  templateUrl: './edit-gallery-page.component.html',
})
export class EditGalleryPageComponent {
  public readonly getPhotosMetadata: GetPhotosMetadata;
  public readonly getImage: GetImage;
  public readonly getTitle: GetTitle;

  constructor(
    private readonly photosApiAdminService: PhotosApiAdminService,
    private readonly sharedPhotoService: SharedPhotosService
  ) {
    this.getPhotosMetadata = this.sharedPhotoService.getPhotosMetadataFactory(
      this.photosApiAdminService.getPhotosMetadata
    );
    this.getImage = this.sharedPhotoService.getImageFactory(
      this.photosApiAdminService.getImageBuffer
    );
    this.getTitle = this.sharedPhotoService.getTitle;
  }
}
