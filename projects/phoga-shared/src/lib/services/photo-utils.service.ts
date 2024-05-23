import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PhotoUtilsService {
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
}
