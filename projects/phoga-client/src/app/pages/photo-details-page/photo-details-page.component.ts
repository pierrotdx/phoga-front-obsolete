import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  ReplaySubject,
  Subscription,
  firstValueFrom,
  map,
  switchMap,
} from 'rxjs';
import {
  DisplayPhotoComponent,
  GetImage,
  GetTitle,
  Photo,
  PhotoFormatOptions,
  PhotoMetadata,
  SharedPhotoUtilsService,
} from 'phoga-shared';
import { PhotosApiService } from '../../services';
import { CommonModule } from '@angular/common';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-photo-details-page',
  standalone: true,
  imports: [CommonModule, DisplayPhotoComponent, MatProgressSpinnerModule],
  templateUrl: './photo-details-page.component.html',
  styleUrl: './photo-details-page.component.scss',
})
export class PhotoDetailsPageComponent implements OnInit, OnDestroy {
  public readonly getImage: GetImage;
  public readonly getTitle: GetTitle;
  public readonly photoMetadata$ = new BehaviorSubject<
    PhotoMetadata | undefined
  >(undefined);
  public readonly photo$ = new ReplaySubject<string | undefined>();
  public readonly title$ = new ReplaySubject<string | undefined>();

  public readonly isLoading$ = new BehaviorSubject<boolean>(false);

  private readonly subs: Subscription[] = [];

  constructor(
    private readonly photosApiService: PhotosApiService,
    private readonly router: Router,
    private readonly sharedPhotoUtilsService: SharedPhotoUtilsService
  ) {
    this.getImage = this.sharedPhotoUtilsService.initGetImage(
      this.photosApiService.getImageBuffer
    );
    this.getTitle = this.sharedPhotoUtilsService.getTitle;
    const photoMetadata = this.router.getCurrentNavigation()?.extras
      .state as PhotoMetadata;
    if (photoMetadata) {
      this.photoMetadata$.next(photoMetadata);
    } else {
      this.router.navigate(['']);
    }
  }

  ngOnInit(): void {
    const photoMetadataSub = this.photoMetadata$.subscribe(
      this.afterPhotoMetadataLoading
    );
    const photoSub = this.photo$.subscribe(() => {
      this.isLoading$.next(false);
    });
    this.subs.push(photoMetadataSub, photoSub);
  }

  ngOnDestroy(): void {}

  private readonly afterPhotoMetadataLoading = () => {
    this.setTitle();
    void this.setPhoto();
  };

  private readonly setPhoto = async () => {
    this.isLoading$.next(true);
    const photoId = this.photoMetadata$.getValue()?._id;
    if (!photoId) {
      return;
    }
    const photo = await this.getImage(photoId);
    this.photo$.next(photo);
  };

  private readonly setTitle = () => {
    const photoMetadata = this.photoMetadata$.getValue();
    const title = photoMetadata ? this.getTitle(photoMetadata) : undefined;
    this.title$.next(title);
  };
}
