import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReplaySubject, Subscription } from 'rxjs';
import {
  GetImage,
  GetPhotoTitle,
  PhotoFormatOptions,
  PhotoMetadata,
} from '../../models';
import { CdkPortal } from '@angular/cdk/portal';
import { DisplayPhotoMetadataComponent } from '../display-photo-metadata/display-photo-metadata.component';

@Component({
  selector: 'lib-display-photo',
  standalone: true,
  imports: [
    CdkPortal,
    CommonModule,
    DisplayPhotoMetadataComponent,
    MatProgressSpinnerModule,
    MatTooltipModule,
    OverlayModule,
  ],
  templateUrl: './display-photo.component.html',
})
export class DisplayPhotoComponent implements OnInit, OnDestroy {
  @Input() getImage: GetImage | undefined;
  @Input() getTitle: GetPhotoTitle | undefined;

  private _photoMetadata: PhotoMetadata | undefined;
  @Input() set photoMetadata(value: PhotoMetadata | undefined) {
    this._photoMetadata = value;
    this.onPhotoMetadataChange();
  }
  get photoMetadata() {
    return this._photoMetadata;
  }

  private _photoFormatOptions: PhotoFormatOptions = {
    width: 250,
    height: 250,
    quality: 50,
  };
  @Input() set photoFormatOptions(value: PhotoFormatOptions) {
    if (value) {
      this._photoFormatOptions = value;
    }
    void this.setPhoto();
  }
  get photoFormatOptions() {
    return this._photoFormatOptions;
  }

  @Input() showMetadata: boolean = false;

  public readonly photo$ = new ReplaySubject<string | undefined>();
  public readonly title$ = new ReplaySubject<string | undefined>();
  public readonly anchorLink$ = new ReplaySubject<string | undefined>();

  private readonly subs: Subscription[] = [];
  public readonly isLoading$ = new ReplaySubject<boolean>();

  ngOnInit(): void {
    const photoSub = this.photo$.subscribe(this.afterPhotoLoaded);
    this.subs.push(photoSub);
  }

  ngOnChanges(changes: SimpleChanges): void {
    void this.onPhotoMetadataChange();
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  private readonly onPhotoMetadataChange = () => {
    this.setTitle();
    this.setAnchor();
    void this.setPhoto();
  };

  private readonly setTitle = () => {
    const title =
      this.photoMetadata?.titles && this.getTitle
        ? this.getTitle(this.photoMetadata)
        : undefined;
    this.title$.next(title);
  };

  private readonly setAnchor = () => {
    const anchorLink = this.photoMetadata?._id
      ? `${this.photoMetadata?._id}/details`
      : '';
    this.anchorLink$.next(anchorLink);
  };

  private readonly setPhoto = async () => {
    this.isLoading$.next(true);
    const photo =
      this.photoMetadata?._id && this.getImage
        ? await this.getImage(this.photoMetadata._id, this.photoFormatOptions)
        : undefined;
    this.photo$.next(photo);
  };

  private readonly afterPhotoLoaded = () => {
    this.isLoading$.next(false);
  };
}
