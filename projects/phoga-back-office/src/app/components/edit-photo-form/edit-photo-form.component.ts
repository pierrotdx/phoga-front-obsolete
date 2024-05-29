import { CommonModule, Location } from '@angular/common';
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
  GetImage,
} from 'phoga-shared';
import {
  BehaviorSubject,
  Subscription,
  combineLatest,
  firstValueFrom,
  filter,
} from 'rxjs';
import { isEmpty } from 'ramda';
import { Router } from '@angular/router';
import { PhotosApiAdminService } from '../../services';

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
  @Output() delete = new EventEmitter<Photo['_id']>();

  private readonly getImage: GetImage;

  public readonly image$ = new BehaviorSubject<string | undefined>(undefined);
  public readonly file$ = new BehaviorSubject<File | undefined>(undefined);
  public readonly thumbnail$ = new BehaviorSubject<string | undefined>(
    undefined
  );
  public readonly showImage$ = new BehaviorSubject<boolean>(false);
  public readonly imageToDisplay$ = new BehaviorSubject<string | undefined>(
    undefined
  );

  public photoId: Photo['_id'] | undefined;
  public photoDate: string = '';
  public photoDescription: string = '';
  public photoGeoLocation: PhotoGeoLocation = {};
  public photoTitles: string[] = [''];

  private readonly subs: Subscription[] = [];

  constructor(
    private readonly location: Location,
    private readonly photosApiAdminService: PhotosApiAdminService,
    private readonly router: Router,
    private readonly sharedPhotoUtilsService: SharedPhotoUtilsService
  ) {
    this.getImage = this.sharedPhotoUtilsService.initGetImage(
      this.photosApiAdminService.getImageBuffer
    );
    const photoMetadata = this.router.getCurrentNavigation()?.extras
      .state as PhotoMetadata;
    this.initForm(photoMetadata);
  }

  ngOnInit() {
    void this.setImageToDisplay();
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  private readonly setImageToDisplay = async () => {
    const initImageToDisplay$ = combineLatest([
      this.image$,
      this.thumbnail$,
    ]).pipe(filter(([image, thumbnail]) => !!image || !!thumbnail));
    const [image, thumbnail] = await firstValueFrom(initImageToDisplay$);
    const imageToDisplay = thumbnail ?? image;
    this.imageToDisplay$.next(imageToDisplay);
  };

  private readonly initForm = (photoMetadata: PhotoMetadata) => {
    const isNewPhoto = !photoMetadata?._id;
    if (isNewPhoto) {
      return;
    }
    this.photoId = photoMetadata._id;
    if (photoMetadata.date) {
      this.photoDate =
        photoMetadata.date instanceof Date
          ? this.getInputCompatibleStringDateFromDate(photoMetadata.date)
          : this.getInputCompatibleStringDateFromDate(
              new Date(photoMetadata.date)
            );
    }
    if (photoMetadata.description) {
      this.photoDescription = photoMetadata.description;
    }
    if (photoMetadata.titles) {
      this.photoTitles = photoMetadata.titles;
    }
    if (
      photoMetadata.geoLocation?.latitude &&
      photoMetadata.geoLocation?.longitude
    ) {
      this.photoGeoLocation = photoMetadata.geoLocation;
    }
    void this.initThumbnail(photoMetadata._id);
    void this.initImage(photoMetadata._id);
  };

  onSubmit = () => {
    const photo: Partial<Photo & { file: File }> = {};
    if (this.photoId) {
      photo._id = this.photoId;
    }
    const file = this.file$.getValue();
    if (file) {
      photo.file = file;
    }
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
    await this.setImage(imageBuffer);
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
    await this.setThumbnail(exifData);
    await this.setImageToDisplay();
  };

  private readonly getInputCompatibleStringDateFromDate = (date: Date) =>
    date?.toISOString().substring(0, 10);

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

  private readonly initThumbnail = async (photoId: Photo['_id']) => {
    const thumbnail = await this.getImage(photoId, { width: 400, height: 400 });
    this.thumbnail$.next(thumbnail);
  };

  private readonly setThumbnail = async (exifData?: ExifData) => {
    const thumbnailBuffer = exifData?.getThumbnailBuffer();
    if (!thumbnailBuffer || thumbnailBuffer.byteLength === 0) {
      this.thumbnail$.next(undefined);
      this.showImage$.next(true);
      return;
    }
    const thumbnail = await this.sharedPhotoUtilsService.getImagePromise(
      thumbnailBuffer
    );
    this.thumbnail$.next(thumbnail);
    this.showImage$.next(false);
  };

  private readonly initImage = async (photoId: Photo['_id']) => {
    const image = await this.getImage(photoId);
    this.image$.next(image);
  };

  public readonly toggleImage = () => {
    const showImage = this.showImage$.getValue();
    const thumbnail = this.thumbnail$.getValue();
    if (showImage || !thumbnail) {
      const image = this.image$.getValue();
      this.imageToDisplay$.next(image);
    } else {
      this.imageToDisplay$.next(thumbnail);
    }
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

  public readonly cancel = () => {
    this.location.back();
  };

  public readonly onDelete = async () => {
    if (this.photoId) {
      this.delete.emit(this.photoId);
    } else {
      throw new Error('delete failed: no photo id provided');
    }
  };
}
