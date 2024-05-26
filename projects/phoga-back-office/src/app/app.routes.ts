import { Route, Routes } from '@angular/router';
import { EditGalleryPageComponent, EditPhotoPageComponent } from './pages';

const editGalleryPageRoute: Route = {
  path: '',
  component: EditGalleryPageComponent,
};

const addPhotoPageRoute: Route = {
  path: 'add',
  component: EditPhotoPageComponent,
};

const editPhotoPageRoute: Route = {
  path: ':photoId/edit',
  component: EditPhotoPageComponent,
};

export const routes: Routes = [
  editGalleryPageRoute,
  editPhotoPageRoute,
  addPhotoPageRoute,
];
