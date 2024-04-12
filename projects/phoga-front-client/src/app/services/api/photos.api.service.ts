import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  PhotoFormatOptions,
  PhotoMetadata,
  PhotoMetadataFilter,
} from '../../models/api';
import { firstValueFrom, map, tap } from 'rxjs';
import { CacheService } from '../cache.service';

@Injectable({
  providedIn: 'root',
})
export class PhotosApiService {
  private readonly apiUrl: string;

  constructor(private readonly httpClient: HttpClient) {
    this.apiUrl = environment.publicApiUrl;
  }

  searchPhotosMetadata = (filter?: PhotoMetadataFilter) => {
    const url = new URL(`${this.apiUrl}/photos/metadata`);
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });
    }
    return this.httpClient.get<PhotoMetadata[]>(url.toString());
  };

  getImageBuffer = (photoId: string, formatOptions?: PhotoFormatOptions) => {
    const url = new URL(`${this.apiUrl}/photos/${photoId}`);
    this.addFormatOptionsAsSearchParamsToUrl(url, formatOptions);
    return this.httpClient.get(url.toString(), {
      responseType: 'arraybuffer',
    });
  };

  private readonly addFormatOptionsAsSearchParamsToUrl = (
    url: URL,
    formatOptions?: PhotoFormatOptions
  ): void => {
    Object.entries(formatOptions || {}).forEach(([key, value]) => {
      url.searchParams.set(encodeURIComponent(key), encodeURIComponent(value));
    });
  };
}
