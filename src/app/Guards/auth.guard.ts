import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { AuthService } from '../Services/auth.service';
import { LocalStorageService } from '../Services/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService,
    private localStorageService: LocalStorageService
  ) {}

  // CanActivate snippet from:
  //https://jacobneterer.medium.com/angular-authentication-securing-routes-with-route-guards-2be6c51b6a23

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.verify().pipe(
      map((response: { authenticated: boolean }) => {
        if (response.authenticated) {
          return true;
        }
        this.localStorageService.remove('user_id');
        this.localStorageService.remove('access_token');
        this.router.navigate(['/login']);
        return false;
      }),
      catchError((error) => {
        this.localStorageService.remove('user_id');
        this.localStorageService.remove('access_token');
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
}
