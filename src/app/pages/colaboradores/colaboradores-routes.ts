import { Routes } from "@angular/router";
import { ColaboradorListComponent } from "./colaborador-list/colaborador-list.component";
import { ColaboradorFormComponent } from "./colaborador-form/colaborador-form.component";

export const COLABORADORES_ROUTES: Routes = [
  {
    path: '',
    component: ColaboradorListComponent
  },
  {
    path: 'new',
    component: ColaboradorFormComponent
  },
  {
    path: ':id/edit',
    component: ColaboradorFormComponent
  }
]; 