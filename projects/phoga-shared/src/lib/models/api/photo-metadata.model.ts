import { DbDoc } from './db.model';
import { FilterParams } from './search-params.model';

export type PhotoGeoLocation = Partial<
  Pick<GeolocationCoordinates, 'latitude' | 'longitude'>
>;

export interface PhotoMetadata extends DbDoc {
  filename?: string;
  date?: Date;
  description?: string;
  geoLocation?: PhotoGeoLocation;
  titles?: string[];
}

export interface PhotoMetadataFilter extends FilterParams {
  filename?: string;
  description?: string;
  minDate?: Date;
  maxDate?: Date;
  title?: string;
}

export interface PhotoFormatOptions {
  width?: number;
  height?: number;
  quality?: number;
}
