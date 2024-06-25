import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { SharedEnvironment } from '../models';

enum ApiEndpoint {
  Photos = 'photos',
}

// https://dev.to/aws-builders/cache-api-calls-in-angular-using-interceptor-5b72
export class CacheHttpInterceptor implements HttpInterceptor {
  public readonly cache = new Map<string, HttpResponse<any>>();

  private readonly cacheableEndpoints = Object.values(ApiEndpoint);

  constructor(private readonly environment: SharedEnvironment) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const url = this.getUrlWithoutBase(req.url);
    const endpoint = this.getCacheableEndpointFromUrl(url);
    if (!endpoint) {
      return next.handle(req);
    } else if (req.method !== 'GET') {
      this.flushEndpointFromCache(endpoint);
      next.handle(req);
    }

    const cachedResponse = this.cache.get(url);
    if (cachedResponse) {
      return of(cachedResponse.clone());
    }

    return next.handle(req).pipe(tap((res) => this.cacheResponse(url, res)));
  }

  private readonly getUrlWithoutBase = (fullUrl: string): string =>
    fullUrl.replace(this.environment.publicApiUrl, '');

  private readonly getCacheableEndpointFromUrl = (url: string): ApiEndpoint =>
    this.cacheableEndpoints.find((endPoint) =>
      url.includes(`/${endPoint}`)
    ) as ApiEndpoint;

  private readonly cacheResponse = (url: string, res: HttpEvent<any>): void => {
    if (res instanceof HttpResponse) {
      this.cache.set(url, res.clone());
    }
  };

  private readonly flushEndpointFromCache = (endpoint: ApiEndpoint) => {
    const cacheKeys = Array.from(this.cache.keys());
    const keysToRemove = cacheKeys.filter((key) => key.includes(endpoint));
    keysToRemove.forEach((key) => this.cache.delete(key));
  };
}
