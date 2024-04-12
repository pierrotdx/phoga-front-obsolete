import { Route, Routes } from '@angular/router';
import { PhotoDetailsPageComponent } from './pages/photo-details-page/photo-details-page.component';
import { SearchPageComponent } from './pages';

export const routes: Routes = [];

const title = 'Phoga';

const defaultPage: Route = {
  component: SearchPageComponent,
  path: '',
  title,
};

const photoDetailsPageRoute: Route = {
  path: ':id/details',
  component: PhotoDetailsPageComponent,
};

const redirectRoute: Route = {
  path: '**',
  redirectTo: '',
  pathMatch: 'full',
};

routes.push(defaultPage, photoDetailsPageRoute, redirectRoute);
