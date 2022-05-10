import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Component/home/home.component';
import { LoginComponent } from './Component/login/login.component';
import { RegisterComponent } from './Component/register/register.component';
import { AuthGuard } from './Guards/auth.guard';
import { SearchBookComponent } from './Component/search-book/search-book.component';
import { BookViewComponent } from './Component/book-view/book-view.component';
import { ShelfViewComponent } from './Component/shelf-view/shelf-view.component';
import { ProfileComponent } from './Component/profile/profile.component';
import { StatsComponent } from './Component/stats/stats.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    //canActivate: [AuthGuard],
  },
  {
    path: 'home',
    component: HomeComponent,
    //canActivate: [AuthGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'search',
    component: SearchBookComponent,
  },
  {
    path: 'shelf',
    component: ShelfViewComponent,
    //canActivate: [AuthGuard],
  },
  {
    path: 'shelf/:type',
    component: ShelfViewComponent,
    //canActivate: [AuthGuard],
  },
  {
    path: 'book/:id',
    component: BookViewComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
    //canActivate: [AuthGuard],
  },
  {
    path: 'stats',
    component: StatsComponent,
    //canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
