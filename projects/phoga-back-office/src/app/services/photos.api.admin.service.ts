import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Photo } from 'phoga-shared';

@Injectable({
  providedIn: 'root',
})
export class PhotosApiAdminService {
  private readonly apiUrl: string;

  constructor(private readonly httpClient: HttpClient) {
    this.apiUrl = environment.publicApiUrl;
  }

  createPhoto = (photo: Partial<Photo & { file: File }>) => {
    const url = new URL(`${this.apiUrl}/photos`);
    const formData = this.getFormDataToCreatePhoto(photo);
    return this.httpClient.put<unknown>(url.toString(), formData);
  };

  private readonly getFormDataToCreatePhoto = (
    photo: Partial<Photo & { file: File }>
  ): FormData => {
    const formData = new FormData();
    if (photo.file) {
      formData.append('file', photo.file);
    } else {
      throw new Error('there is no image to send');
    }
    if (photo.geoLocation?.latitude && photo.geoLocation?.longitude) {
      formData.append('latitude', photo.geoLocation.latitude?.toString());
      formData.append('longitude', photo.geoLocation.longitude?.toString());
    }
    if (photo.titles) {
      formData.append('titles', photo.titles.join(','));
    }
    if (photo.date) {
      formData.append('date', photo.date.toISOString());
    }
    if (photo.description) {
      formData.append('description', photo.description);
    }
    return formData;
  };
}
