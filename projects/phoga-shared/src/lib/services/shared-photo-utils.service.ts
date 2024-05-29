import { Injectable } from '@angular/core';
import {
  GetImage,
  GetTitle,
  ImageBufferGetter,
  Photo,
  PhotoFormatOptions,
  PhotoMetadata,
} from '../models';
import { firstValueFrom, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedPhotoUtilsService {
  constructor() {}

  public readonly getImagePromise = (
    photoBuffer: ArrayBuffer
  ): Promise<string> =>
    new Promise(function (resolve, reject) {
      if (!photoBuffer) {
        reject(new Error('no buffer provided in input'));
      }
      const fileReader = new FileReader();
      const blob = new Blob([photoBuffer]);
      fileReader.onloadend = () => {
        resolve(fileReader.result as string);
      };
      fileReader.onerror = (err) => {
        reject(err);
      };
      fileReader.readAsDataURL(blob);
    });

  public readonly updateUrlWithSearchParams = <Params extends Object>(
    url: URL,
    params?: Params
  ) => {
    if (!params) {
      return;
    }
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(encodeURIComponent(key), encodeURIComponent(value));
    });
  };

  private readonly getImageFromBuffer = async (imageBuffer: ArrayBuffer) => {
    const image = await this.getImagePromise(imageBuffer);
    return image;
  };

  public readonly getTitle: GetTitle = (photoMetadata?: PhotoMetadata) =>
    photoMetadata?.titles?.map((title) => `"${title}"`)?.join(', ');

  public readonly initGetImage =
    (imageBufferGetter: ImageBufferGetter): GetImage =>
    (photoId: Photo['_id'], format?: PhotoFormatOptions) => {
      const imageBuffer$ = imageBufferGetter(photoId, format);
      const image$ = imageBuffer$.pipe(
        switchMap((buffer) => this.getImageFromBuffer(buffer))
      );
      return firstValueFrom(image$);
    };
}
