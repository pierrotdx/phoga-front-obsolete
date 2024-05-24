import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatInput, MatLabel } from '@angular/material/input';
import { ExifData, ExifParserFactory } from 'ts-exif-parser';
import {
  PhotoGeoLocation,
  PhotoMetadata,
  Photo,
  SharedPhotoUtilsService,
} from 'phoga-shared';
import { BehaviorSubject, ReplaySubject, Subscription } from 'rxjs';
import { isEmpty } from 'ramda';

@Component({
  selector: 'app-edit-photo-form',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatInput,
    MatInput,
    MatLabel,
  ],
  templateUrl: './edit-photo-form.component.html',
})
export class EditPhotoFormComponent implements OnInit, OnDestroy {
  @Output() save = new EventEmitter<Partial<Photo | undefined>>();

  public readonly image$ = new BehaviorSubject<string | undefined>(undefined);
  public readonly file$ = new BehaviorSubject<File | undefined>(undefined);
  public readonly thumbnail$ = new ReplaySubject<string | undefined>();
  public readonly showImage$ = new BehaviorSubject<boolean>(false);

  public photoDate: string = '';
  public photoDescription: string = '';
  public photoGeoLocation: PhotoGeoLocation = {};
  public photoTitles: string[] = [''];

  private readonly subs: Subscription[] = [];

  constructor(
    private readonly sharedPhotoUtilsService: SharedPhotoUtilsService
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subs.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  onSubmit = () => {
    const file = this.file$.getValue();
    if (!file) {
      this.save.emit(undefined);
      return;
    }
    const photo: Partial<Photo & { file: File }> = { file };
    const date = this.photoDate ? new Date(this.photoDate) : undefined;
    if (date) {
      photo.date = date;
    }
    const geoLocation = !isEmpty(this.photoGeoLocation)
      ? this.photoGeoLocation
      : undefined;
    if (geoLocation) {
      photo.geoLocation = geoLocation;
    }
    const nonEmptyTitles = this.photoTitles.filter((title) => !!title);
    const titles = nonEmptyTitles.length > 0 ? nonEmptyTitles : undefined;
    if (titles) {
      photo.titles = titles;
    }
    const description = this.photoDescription || undefined;
    if (description) {
      photo.description = description;
    }
    this.save.emit(photo);
  };

  onImageInputChange = async (event: Event) => {
    const file: File | undefined =
      (event?.target as HTMLInputElement)?.files?.[0] || undefined;
    if (!file) {
      this.file$.next(undefined);
      this.image$.next(undefined);
      return;
    }
    this.file$.next(file);
    const imageBuffer = await file.arrayBuffer();
    void this.setImage(imageBuffer);
    const exifData = this.getExifData(imageBuffer);
    const metadata = this.getMetadata(exifData);
    if (metadata.date instanceof Date) {
      this.photoDate = this.getInputCompatibleStringDateFromDate(
        metadata.date as Date
      );
    }
    if (metadata.geoLocation) {
      this.photoGeoLocation = metadata.geoLocation;
    }
    void this.setThumbnail(exifData);
  };

  private readonly getInputCompatibleStringDateFromDate = (date: Date) =>
    date.toISOString().substring(0, 10);

  private readonly setImage = async (imageBuffer: ArrayBuffer) => {
    const image = await this.sharedPhotoUtilsService.getImagePromise(
      imageBuffer
    );
    this.image$.next(image);
  };

  private getExifData(buffer: ArrayBuffer) {
    const parser = ExifParserFactory.create(buffer);
    const exifData = parser.parse();
    return exifData;
  }

  private readonly setThumbnail = async (exifData?: ExifData) => {
    const thumbnailBuffer = exifData?.getThumbnailBuffer();
    if (!thumbnailBuffer) {
      this.thumbnail$.next(undefined);
      return;
    }
    const thumbnailImage = await this.sharedPhotoUtilsService.getImagePromise(
      thumbnailBuffer
    );
    this.thumbnail$.next(thumbnailImage);
  };

  public readonly toggleImage = () => {
    const showImage = this.showImage$.getValue();
    this.showImage$.next(!showImage);
  };

  private readonly getMetadata = (exifData: ExifData) => {
    const { tags } = exifData;
    // https://stackoverflow.com/a/847196/6281776
    const date = tags?.DateTimeOriginal
      ? new Date(tags?.DateTimeOriginal * 1000)
      : undefined;
    const metadata: Partial<PhotoMetadata> = {};
    if (date) {
      metadata.date = date;
    }
    const latitude = tags?.GPSLatitude;
    const longitude = tags?.GPSLongitude;
    if (latitude && longitude) {
      metadata.geoLocation = { latitude, longitude };
    }
    return metadata;
  };

  public readonly titleTracker = (index: number, item: string) => index;

  public readonly onPhotoTitleChange = (title: string, i: number) => {
    if (this.photoTitles[i]) {
      this.photoTitles[i] = title;
    }
  };

  public readonly addTitle = () => {
    this.photoTitles.push('');
  };

  public readonly removeTitle = (index: number) => {
    if (this.photoTitles[index]) {
      this.photoTitles.splice(index, 1);
    }
  };
}
