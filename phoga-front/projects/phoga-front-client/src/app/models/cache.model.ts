import { BehaviorSubject } from 'rxjs';

export interface CacheInterface<T> {
  allValues$: BehaviorSubject<T[]>;
  get: (...params: any[]) => T | undefined;
  add: (...params: any[]) => void;
}
