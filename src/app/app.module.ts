import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Component/login/login.component';
import { RegisterComponent } from './Component/register/register.component';
import { HomeComponent } from './Component/home/home.component';
import { SearchBookComponent } from './Component/search-book/search-book.component';
import { BookViewComponent } from './Component/book-view/book-view.component';

import { HeaderComponent } from './Component/header/header.component';
import { ShelfViewComponent } from './Component/shelf-view/shelf-view.component';
import { ProfileComponent } from './Component/profile/profile.component';
import { StatsComponent } from './Component/stats/stats.component';
import { AuthInterceptorService } from './Services/auth-interceptor.service';
import { NgChartsModule } from 'ng2-charts';
import { ChartComponent } from './Component/chart/chart.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    SearchBookComponent,
    BookViewComponent,

    HeaderComponent,
    ShelfViewComponent,
    ProfileComponent,
    StatsComponent,
    ChartComponent,
  ],
  exports: [],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    NgChartsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [
    /*    {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptorService,
    multi: true,
  },*/
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
