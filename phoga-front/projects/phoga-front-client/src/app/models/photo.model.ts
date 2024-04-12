import { PhotoFormatOptions, PhotoMetadata } from './api';

export interface PhotoImage extends Pick<PhotoMetadata, '_id'> {
  format?: PhotoFormatOptions;
  image?: string;
}

export type Photo = PhotoMetadata & PhotoImage;
