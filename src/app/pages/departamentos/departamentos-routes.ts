import { Routes } from '@angular/router';
import { DepartamentoListComponent } from './departamento-list/departamento-list.component';
import { DepartamentoFormComponent } from './departamento-form/departamento-form.component';

export const DEPARTAMENTOS_ROUTES: Routes = [
    {
        path: '',
        component: DepartamentoListComponent
    },
    {
        path: 'new',
        component: DepartamentoFormComponent
    },
    {
        path: ':id/edit',
        component: DepartamentoFormComponent
    }
]; 