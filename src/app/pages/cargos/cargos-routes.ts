import { Routes } from "@angular/router";
import { CargoListComponent } from "./cargo-list/cargo-list.component";
import { CargoFormComponent } from "./cargo-form/cargo-form.component";

export const CARGOS_ROUTES: Routes = [
  {
    path: '',
    component: CargoListComponent
  },
  {
    path: 'new',
    component: CargoFormComponent
  },
  {
    path: ':id/edit',
    component: CargoFormComponent
  }
]; 