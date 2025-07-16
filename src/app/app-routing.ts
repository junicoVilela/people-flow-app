import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        children: [
            {
                path: 'colaboradores',
                loadChildren: () => import('./pages/colaboradores/colaboradores-routes').then(m => m.COLABORADORES_ROUTES),
            },
            {
                path: 'cargos',
                loadChildren: () => import('./pages/cargos/cargos-routes').then(m => m.CARGOS_ROUTES),
            },
            {
                path: 'departamentos',
                loadChildren: () => import('./pages/departamentos/departamentos-routes').then(m => m.DEPARTAMENTOS_ROUTES),
            },
            {
                path: '',
                redirectTo: '/colaboradores', pathMatch: 'full'
            }
        ]
    },
    {
        path: 'auth',
        loadChildren: () => import('./pages/auth/auth-routes').then(m => m.authRoutes),
    },
    {
        path: '**',
        redirectTo: '/colaboradores'
    }
]; 