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

export const routes: Routes = [editGalleryPageRoute, addPhotoPageRoute];
