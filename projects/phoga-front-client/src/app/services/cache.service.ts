import { Injectable } from '@angular/core';
import {
  PhotoImage,
  PhotoMetadata,
  PhotoMetadataFilter,
  SearchCacheItem,
} from '../models';
import { Cache } from './cache.class';
import { equals } from 'ramda';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  public readonly photoImageCache = new Cache<PhotoImage>(
    (a: PhotoImage, b: Partial<PhotoImage>) => a._id === b?._id
  );
  public readonly photoMetadataCache = new Cache<PhotoMetadata>(
    (a: PhotoMetadata, b: Partial<PhotoMetadata>) => a._id === b?._id
  );
  public readonly searchPhotoMetadataCache = new Cache<
    SearchCacheItem<PhotoMetadataFilter, PhotoMetadata>
  >(
    (
      a: SearchCacheItem<PhotoMetadataFilter, PhotoMetadata>,
      b: Partial<SearchCacheItem<PhotoMetadataFilter, PhotoMetadata>>
    ) => equals(a.filter, b.filter)
  );
}
