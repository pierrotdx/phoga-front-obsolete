import { Injectable } from '@angular/core';
import { firstValueFrom, of, tap } from 'rxjs';
import {
  ImageBufferGetter,
  GetImage,
  Photo,
  GetPhotoMetadata,
  GetPhotosMetadata,
  GetTitle,
  PhotoMetadataFilter,
  PhotoMetadata,
  PhotoFormatOptions,
  PhotoImage,
} from '../models';
import { SharedCacheService, SharedPhotoUtilsService } from '.';

@Injectable({
  providedIn: 'root',
})
export class SharedPhotosService {
  constructor(
    private readonly sharedCacheService: SharedCacheService,
    private readonly sharedPhotoUtilsService: SharedPhotoUtilsService
  ) {}

  public readonly getPhotosMetadataFactory =
    (getPhotosMetadata: GetPhotosMetadata): GetPhotosMetadata =>
    (filter?: PhotoMetadataFilter) =>
      this.getPhotosMetadata(getPhotosMetadata, filter);

  private readonly getPhotosMetadata = (
    getPhotosMetadata: GetPhotosMetadata,
    filter?: PhotoMetadataFilter
  ) => {
    const cachedSearch = this.sharedCacheService.searchPhotoMetadataCache.get({
      filter,
    });
    if (cachedSearch) {
      return of(cachedSearch.results);
    }
    return getPhotosMetadata(filter).pipe(
      tap((photosMetadata) => {
        this.sharedCacheService.searchPhotoMetadataCache.add({
          filter,
          results: photosMetadata,
        });
        photosMetadata.forEach(this.sharedCacheService.photoMetadataCache.add);
      })
    );
  };

  public readonly photoMetadataGetterFactory =
    (getPhotoMetadata: GetPhotosMetadata): GetPhotoMetadata =>
    (_id: Photo['_id']) =>
      this.getPhotoMetadata(getPhotoMetadata, _id);

  private readonly getPhotoMetadata = async (
    getPhotosMetadata: GetPhotosMetadata,
    _id: Photo['_id']
  ) => {
    const cachedPhotoMetadata = this.sharedCacheService.photoMetadataCache.get({
      _id,
    });
    if (cachedPhotoMetadata) {
      return cachedPhotoMetadata;
    }
    const photosMetadata = await firstValueFrom(getPhotosMetadata({ _id }));
    return photosMetadata.find((photoMetadata) => photoMetadata._id === _id);
  };

  public readonly getImageFactory =
    (getImageBuffer: ImageBufferGetter): GetImage =>
    (photoId: PhotoMetadata['_id'], format?: PhotoFormatOptions) =>
      this.getImage(getImageBuffer, photoId, format);

  private readonly getImage = async (
    getImageBuffer: ImageBufferGetter,
    photoId: PhotoMetadata['_id'],
    format?: PhotoFormatOptions
  ) => {
    const cachedImage = this.sharedCacheService.photoImageCache.get({
      _id: photoId,
    });
    if (cachedImage) {
      return cachedImage.image;
    }
    const imageBuffer = await firstValueFrom(getImageBuffer(photoId, format));
    const image = await this.sharedPhotoUtilsService.getImagePromise(
      imageBuffer
    );
    const photoImage: PhotoImage = { _id: photoId, format, image };
    this.sharedCacheService.photoImageCache.add(photoImage);
    return image;
  };

  public readonly getTitle: GetTitle = (photoMetadata?: PhotoMetadata) =>
    photoMetadata?.titles?.map((title) => `"${title}"`)?.join(', ');
}
