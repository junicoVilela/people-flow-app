import { enableProdMode, importProvidersFrom } from '@angular/core';

import { environment } from './environments/environment';
import {bootstrapApplication, BrowserModule} from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

import { PreloadAllModules, provideRouter, withPreloading } from "@angular/router";
import { routes } from "./app/app-routing";
import { provideAnimations } from "@angular/platform-browser/animations";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { ToastrModule } from "ngx-toastr";
import { provideNgxMask } from "ngx-mask";

import { ErrorInterceptor } from './app/core/interceptors/error.interceptor';
import { LoadingInterceptor } from './app/core/interceptors/loading.interceptor';
import { AuthInterceptor } from './app/core/interceptors/auth.interceptor';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: LoadingInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorInterceptor,
            multi: true
        },
        
        importProvidersFrom(
            BrowserModule,
            HttpClientModule,
            ToastrModule.forRoot()
        ),
        
        provideNgxMask(),
        provideAnimations(),
        
        provideRouter(routes, withPreloading(PreloadAllModules))
    ]
})
  .catch(err => console.error(err));
