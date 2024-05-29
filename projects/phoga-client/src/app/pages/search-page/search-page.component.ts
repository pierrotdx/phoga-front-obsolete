import { Component } from '@angular/core';
import { PhotosApiService } from '../../services';
import {
  GetPhotosMetadata,
  GalleryComponent,
  GetImage,
  GetRedirectLink,
  GetTitle,
  PhotoMetadata,
  SharedPhotoUtilsService,
} from 'phoga-shared';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [GalleryComponent],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
})
export class SearchPageComponent {
  public readonly getPhotosMetadata: GetPhotosMetadata;
  public readonly getPhotoRedirectLink: GetRedirectLink;
  public readonly getImage: GetImage;
  public readonly getTitle: GetTitle;

  constructor(
    private readonly photosApiService: PhotosApiService,
    private readonly sharedPhotoUtilsService: SharedPhotoUtilsService
  ) {
    this.getPhotosMetadata = this.photosApiService.getPhotosMetadata;
    this.getPhotoRedirectLink = (photoMetadata: PhotoMetadata) =>
      `${photoMetadata._id}/details`;
    this.getImage = this.sharedPhotoUtilsService.initGetImage(
      this.photosApiService.getImageBuffer
    );
    this.getTitle = this.sharedPhotoUtilsService.getTitle;
  }
}
