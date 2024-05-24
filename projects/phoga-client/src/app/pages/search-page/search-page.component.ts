import { Component } from '@angular/core';
import { PhotosApiService, SharedPhotosService } from '../../services';
import {
  GetPhotosMetadata,
  GalleryComponent,
  GetImage,
  GetRedirectLink,
  GetTitle,
  PhotoMetadata,
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
    private readonly sharedPhotosService: SharedPhotosService
  ) {
    this.getPhotosMetadata = this.sharedPhotosService.getPhotosMetadataFactory(
      this.photosApiService.getPhotosMetadata
    );
    this.getPhotoRedirectLink = (photoMetadata: PhotoMetadata) =>
      `${photoMetadata._id}/details`;
    this.getImage = this.sharedPhotosService.getImageFactory(
      this.photosApiService.getImageBuffer
    );
    this.getTitle = this.sharedPhotosService.getTitle;
  }
}
