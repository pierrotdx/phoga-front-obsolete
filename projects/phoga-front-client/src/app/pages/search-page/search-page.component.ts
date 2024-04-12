import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PhotosService } from '../../services';
import {
  BehaviorSubject,
  ReplaySubject,
  Subscription,
  firstValueFrom,
  tap,
} from 'rxjs';
import { PhotoMetadata, PhotoMetadataFilter } from '../../models';
import { DisplayPhotoComponent } from '../../components';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [
    CommonModule,
    DisplayPhotoComponent,
    MatProgressSpinnerModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
})
export class SearchPageComponent implements OnInit, OnDestroy {
  public readonly photosMetadata$ = new BehaviorSubject<PhotoMetadata[]>([]);
  public readonly rawPhotos$ = new ReplaySubject<string[]>();

  public anchorLinks: Record<PhotoMetadata['_id'], string> = {};

  private readonly subs: Subscription[] = [];

  constructor(private readonly photosService: PhotosService) {}

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
    await firstValueFrom(
      this.photosService.searchPhotosMetadata(filter).pipe(
        tap((photosMetadata) => {
          photosMetadata.forEach((photoMetadata) => {
            this.anchorLinks[
              photoMetadata._id
            ] = `${photoMetadata._id}/details`;
          });
          this.photosMetadata$.next(photosMetadata);
        })
      )
    );
}
