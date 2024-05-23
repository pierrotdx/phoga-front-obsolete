import { Component, Input } from '@angular/core';
import {
  FetchPhotosMetadata,
  GetImage,
  GetPhotoRedirectLink,
  GetPhotoTitle,
  PhotoMetadata,
  PhotoMetadataFilter,
} from '../../models';
import {
  BehaviorSubject,
  ReplaySubject,
  Subscription,
  firstValueFrom,
  tap,
} from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DisplayPhotoComponent } from '../display-photo/display-photo.component';

@Component({
  selector: 'lib-gallery',
  standalone: true,
  imports: [
    CommonModule,
    DisplayPhotoComponent,
    MatProgressSpinnerModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './gallery.component.html',
})
export class GalleryComponent {
  @Input() fetchPhotosMetadata: FetchPhotosMetadata | undefined;
  @Input() getPhotoRedirectLink: GetPhotoRedirectLink | undefined;
  @Input() getImage: GetImage | undefined;
  @Input() getTitle: GetPhotoTitle | undefined;

  public readonly photosMetadata$ = new BehaviorSubject<PhotoMetadata[]>([]);
  public readonly rawPhotos$ = new ReplaySubject<string[]>();

  public anchorLinks: Record<PhotoMetadata['_id'], string> = {};

  private readonly subs: Subscription[] = [];

  constructor() {}

  ngOnInit(): void {
    void this.searchOnPhotosMetadata();
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  private readonly searchOnPhotosMetadata = async (
    filter?: PhotoMetadataFilter
  ) =>
    this.fetchPhotosMetadata
      ? await firstValueFrom(
          this.fetchPhotosMetadata(filter).pipe(
            tap((photosMetadata) => {
              photosMetadata.forEach((photoMetadata) => {
                this.anchorLinks[photoMetadata._id] = this.getPhotoRedirectLink
                  ? this.getPhotoRedirectLink(photoMetadata)
                  : '';
              });
              this.photosMetadata$.next(photosMetadata);
            })
          )
        )
      : undefined;
}
