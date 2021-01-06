import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UserAccessGuard } from '../app/guards/user-access.guard';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const ROUTES: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'inicio',
        canActivate: [UserAccessGuard],
        loadChildren: () => import('./modules/pages/pages.module')
        .then(mod => mod.PagesModule)
    },
    {
        path: 'notFound',
        loadChildren: () => import('./modules/not-found/not-found-routing.module')
        .then(mod => mod.NotFoundRoutingModule)
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login'
      },
    {

        path: '**',
        pathMatch: 'full',
        redirectTo: 'notFound'
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(ROUTES)
    ],
    exports: [
        RouterModule
    ],
    declarations: []
})

export class AppRoutingModule{}

