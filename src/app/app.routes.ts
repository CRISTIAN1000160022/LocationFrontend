import { Routes } from '@angular/router';
import { CountryComponent } from './pages/country/country.component';
import { StateComponent } from './pages/state/state.component';
import { CityComponent } from './pages/city/city.component';

export const routes: Routes = [
  { path: 'country', component: CountryComponent },
  { path: 'state', component: StateComponent },
  { path: 'city', component: CityComponent },
  { path: '', redirectTo: '/country', pathMatch: 'full' }
];
