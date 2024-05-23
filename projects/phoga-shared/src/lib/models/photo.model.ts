import { Observable } from 'rxjs';
import { PhotoFormatOptions, PhotoMetadata, PhotoMetadataFilter } from './api';

export interface PhotoImage extends Pick<PhotoMetadata, '_id'> {
  format?: PhotoFormatOptions;
  image?: string;
}

export type Photo = PhotoMetadata & PhotoImage;

export type FetchPhotosMetadata = (
  filter?: PhotoMetadataFilter
) => Observable<PhotoMetadata[]>;

export type GetPhotoRedirectLink = (photoMetadata: PhotoMetadata) => string;

export type GetImage = (
  photoId: PhotoMetadata['_id'],
  format?: PhotoFormatOptions
) => Promise<string | undefined>;

export type GetPhotoTitle = (
  photoMetadata: PhotoMetadata
) => string | undefined;
