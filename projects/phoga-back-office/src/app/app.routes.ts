import { Route, Routes } from '@angular/router';
import { EditGalleryPageComponent, EditPhotoPageComponent } from './pages';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { authGuard } from './guards/auth.guard';
import { RestrictedHomePageComponent } from './pages';

const homePageRoute: Route = {
  path: '',
  component: HomePageComponent,
};

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

const restrictedRoute: Route = {
  path: 'restricted',
  canActivate: [authGuard()],
  children: [editGalleryPageRoute, editPhotoPageRoute, addPhotoPageRoute],
  component: RestrictedHomePageComponent,
};

export const routes: Routes = [homePageRoute, restrictedRoute];
