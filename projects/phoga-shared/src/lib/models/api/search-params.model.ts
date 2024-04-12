import { PhotoMetadata, PhotoMetadataFilter } from './photo-metadata.model';

export type FilterParams = Record<string, any>;

export interface RenderParams {
  size?: number;
  sort?: Sort;
}

export enum Sort {
  Asc = 'asc',
  Desc = 'desc',
}

export interface SearchCacheItem<Filter, Result> {
  filter?: Filter;
  results: Result[];
}
