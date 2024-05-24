import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
  PhotoFormatOptions,
  PhotoMetadata,
  PhotoMetadataFilter,
  SharedPhotoUtilsService,
} from 'phoga-shared';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PhotosApiService {
  private readonly apiUrl: string;

  constructor(
    private readonly httpClient: HttpClient,
    private readonly sharedPhotoUtilsService: SharedPhotoUtilsService
  ) {
    this.apiUrl = environment.publicApiUrl;
  }

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
}
