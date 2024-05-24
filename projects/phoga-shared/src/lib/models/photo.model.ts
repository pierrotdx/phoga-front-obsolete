import { Observable } from 'rxjs';
import { PhotoFormatOptions, PhotoMetadata, PhotoMetadataFilter } from './api';

export interface PhotoImage extends Pick<PhotoMetadata, '_id'> {
  format?: PhotoFormatOptions;
  image?: string;
}

export type Photo = PhotoMetadata & PhotoImage;

export type GetRedirectLink = (photoMetadata: PhotoMetadata) => string;

export type GetTitle = (photoMetadata: PhotoMetadata) => string | undefined;

export type GetPhotosMetadata = (
  filter?: PhotoMetadataFilter
) => Observable<PhotoMetadata[]>;

export type GetPhotoMetadata = (
  _id: Photo['_id']
) => Promise<PhotoMetadata | undefined>;

export type GetImage = (
  photoId: Photo['_id'],
  format?: PhotoFormatOptions
) => Promise<string | undefined>;

export type ImageBufferGetter = (
  photoId: Photo['_id'],
  formatOptions?: PhotoFormatOptions
) => Observable<ArrayBuffer>;
