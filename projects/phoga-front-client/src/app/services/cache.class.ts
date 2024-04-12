import { CacheInterface } from '../models';
import { BehaviorSubject } from 'rxjs';

export class Cache<T> implements CacheInterface<T> {
  public readonly allValues$ = new BehaviorSubject<T[]>([]);

  constructor(
    private readonly match: (item: T, filters: Partial<T>) => boolean
  ) {}

  public readonly add = (item: T) => {
    // remove duplicate if any
    const allMetadata = this.allValues$
      .getValue()
      .filter((elem) => !this.match(item, elem));
    const allValues = allMetadata.concat([item]);
    this.allValues$.next(allValues);
  };

  public readonly get = (filters?: Partial<T>): T | undefined =>
    filters
      ? this.allValues$.getValue().find((item) => this.match(item, filters))
      : undefined;
}
