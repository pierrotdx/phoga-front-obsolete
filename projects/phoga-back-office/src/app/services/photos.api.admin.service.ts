import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {
  Photo,
  PhotoFormatOptions,
  PhotoMetadata,
  PhotoMetadataFilter,
  SharedPhotoUtilsService,
} from 'phoga-shared';

@Injectable({
  providedIn: 'root',
})
export class PhotosApiAdminService {
  private readonly apiUrl: string;
  private readonly adminApiUrl: string;

  constructor(
    private readonly httpClient: HttpClient,
    private readonly sharedPhotoUtilsService: SharedPhotoUtilsService
  ) {
    this.apiUrl = environment.publicApiUrl;
    this.adminApiUrl = `${this.apiUrl}/restricted`;
  }

  createPhoto = (photo: Partial<Photo & { file: File }>) => {
    const url = new URL(`${this.adminApiUrl}/photos`);
    const formData = this.getFormDataToCreatePhoto(photo);
    if (!formData.has('file')) {
      throw new Error('there is no image to send');
    }
    return this.httpClient.put<boolean>(url.toString(), formData);
  };

  patchPhoto = (photo: Partial<Photo & { file: File }>) => {
    const url = new URL(`${this.adminApiUrl}/photos/${photo._id}`);
    const formData = this.getFormDataToCreatePhoto(photo);
    return this.httpClient.patch<boolean>(url.toString(), formData);
  };

  private readonly getFormDataToCreatePhoto = (
    photo: Partial<Photo & { file: File }>
  ): FormData => {
    const formData = new FormData();
    if (photo.file) {
      formData.append('file', photo.file);
    }
    if (photo.geoLocation?.latitude && photo.geoLocation?.longitude) {
      formData.append('latitude', photo.geoLocation.latitude?.toString());
      formData.append('longitude', photo.geoLocation.longitude?.toString());
    }
    if (photo.titles) {
      formData.append('titles', photo.titles.join(','));
    }
    if (photo.date) {
      formData.append('date', photo.date.toISOString());
    }
    if (photo.description) {
      formData.append('description', photo.description);
    }
    return formData;
  };

  getPhotosMetadata = (filter?: PhotoMetadataFilter) => {
    const url = new URL(`${this.apiUrl}/photos/metadata`);
    this.sharedPhotoUtilsService.updateUrlWithSearchParams(url, filter);
    return this.httpClient.get<PhotoMetadata[]>(url.toString());
  };

  getImageBuffer = (photoId: string, formatOptions?: PhotoFormatOptions) => {
    const url = new URL(`${this.apiUrl}/photos/${photoId}`);
    this.sharedPhotoUtilsService.updateUrlWithSearchParams(url, formatOptions);
    return this.httpClient.get(url.toString(), {
      responseType: 'arraybuffer',
    });
  };

  deletePhoto = (photoId: string) => {
    const url = new URL(`${this.adminApiUrl}/photos/${photoId}`);
    return this.httpClient.delete<boolean>(url.toString());
  };
}
