import { Component } from '@angular/core';
import { PhotosService } from '../../services';
import {
  FetchPhotosMetadata,
  GalleryComponent,
  GetPhotoRedirectLink,
  GetPhotoTitle,
  PhotoMetadata,
} from 'phoga-shared';
import { GetImage } from '../../../../../phoga-shared/src/public-api';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [GalleryComponent],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
})
export class SearchPageComponent {
  public readonly fetchPhotosMetadata: FetchPhotosMetadata;
  public readonly getPhotoRedirectLink: GetPhotoRedirectLink;
  public readonly getImage: GetImage;
  public readonly getTitle: GetPhotoTitle;

  constructor(private readonly photosService: PhotosService) {
    this.fetchPhotosMetadata = this.photosService.searchPhotosMetadata;
    this.getPhotoRedirectLink = (photoMetadata: PhotoMetadata) =>
      `${photoMetadata._id}/details`;
    this.getImage = this.photosService.getImage;
    this.getTitle = (photoMetadata: PhotoMetadata) =>
      this.photosService.getTitle(photoMetadata.titles);
  }
}
