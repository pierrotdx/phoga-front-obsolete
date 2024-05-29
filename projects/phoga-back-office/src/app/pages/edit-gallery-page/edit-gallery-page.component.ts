import { Component } from '@angular/core';
import {
  GalleryComponent,
  GetImage,
  GetTitle,
  GetPhotosMetadata,
  GetRedirectLink,
  PhotoMetadata,
  SharedPhotoUtilsService,
} from 'phoga-shared';
import { PhotosApiAdminService } from '../../services';

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
  public readonly getPhotoRedirectLink: GetRedirectLink;

  constructor(
    private readonly photosApiAdminService: PhotosApiAdminService,
    private readonly sharedPhotoUtilsService: SharedPhotoUtilsService
  ) {
    this.getPhotosMetadata = this.photosApiAdminService.getPhotosMetadata;
    this.getImage = this.sharedPhotoUtilsService.initGetImage(
      this.photosApiAdminService.getImageBuffer
    );
    this.getTitle = this.sharedPhotoUtilsService.getTitle;
    this.getPhotoRedirectLink = (photoMetadata: PhotoMetadata) =>
      `${photoMetadata._id}/edit`;
  }
}
