import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PhotoMetadata } from '../../models';
import { ReplaySubject, Subscription } from 'rxjs';
import { GetPhotoTitle } from '../../../public-api';

@Component({
  selector: 'lib-display-photo-metadata',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './display-photo-metadata.component.html',
})
export class DisplayPhotoMetadataComponent implements OnInit, OnDestroy {
  @Input() getTitle: GetPhotoTitle | undefined;

  private _photoMetadata: PhotoMetadata | undefined;
  @Input() set photoMetadata(value: PhotoMetadata | undefined) {
    this._photoMetadata = value;
    this.photoMetadata$.next(value);
  }
  get photoMetadata() {
    return this._photoMetadata;
  }

  public readonly photoMetadata$ = new ReplaySubject<
    PhotoMetadata | undefined
  >();

  public readonly title$ = new ReplaySubject<string | undefined>();

  private readonly subs: Subscription[] = [];

  ngOnInit(): void {
    const photoMetadataSub = this.photoMetadata$.subscribe(
      this.onPhotoMetadata
    );
    this.subs.push(photoMetadataSub);
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  private readonly onPhotoMetadata = (
    photoMetadata: PhotoMetadata | undefined
  ) => {
    if (!photoMetadata) {
      return;
    }
    const title = this.getTitle ? this.getTitle(photoMetadata) : '';
    this.title$.next(title);
  };
}
