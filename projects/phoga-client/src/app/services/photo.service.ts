import { Injectable } from '@angular/core';
import {
  PhotoFormatOptions,
  PhotoImage,
  PhotoMetadata,
  PhotoMetadataFilter,
} from 'phoga-shared';
import { PhotosApiService } from './api';
import { firstValueFrom, of, tap } from 'rxjs';
import { CacheService } from './cache.service';
import { PhotoUtilsService } from 'phoga-shared';

@Injectable({
  providedIn: 'root',
})
export class PhotosService {
  constructor(
    private readonly cacheService: CacheService,
    private readonly photoUtilsService: PhotoUtilsService,
    private readonly photosApiService: PhotosApiService
  ) {}

  searchPhotosMetadata = (filter?: PhotoMetadataFilter) => {
    const cachedSearch = this.cacheService.searchPhotoMetadataCache.get({
      filter,
    });
    if (cachedSearch) {
      return of(cachedSearch.results);
    }
    return this.photosApiService.searchPhotosMetadata(filter).pipe(
      tap((photosMetadata) => {
        this.cacheService.searchPhotoMetadataCache.add({
          filter,
          results: photosMetadata,
        });
        photosMetadata.forEach(this.cacheService.photoMetadataCache.add);
      })
    );
  };

  getPhotoMetadata = async (_id: PhotoMetadata['_id']) => {
    const cachedPhotoMetadata = this.cacheService.photoMetadataCache.get({
      _id,
    });
    if (cachedPhotoMetadata) {
      return cachedPhotoMetadata;
    }
    const photosMetadata = await firstValueFrom(
      this.searchPhotosMetadata({ _id })
    );
    return photosMetadata.find((photoMetadata) => photoMetadata._id === _id);
  };

  public readonly getImage = async (
    photoId: PhotoMetadata['_id'],
    format?: PhotoFormatOptions
  ) => {
    const cachedImage = this.cacheService.photoImageCache.get({ _id: photoId });
    if (cachedImage) {
      return cachedImage.image;
    }
    const imageBuffer = await firstValueFrom(
      this.photosApiService.getImageBuffer(photoId, format)
    );
    const image = await this.photoUtilsService.getImagePromise(imageBuffer);
    const photoImage: PhotoImage = { _id: photoId, format, image };
    this.cacheService.photoImageCache.add(photoImage);
    return image;
  };

  public readonly getTitle = (titles?: string[]) =>
    titles?.map((title) => `"${title}"`)?.join(', ');
}
