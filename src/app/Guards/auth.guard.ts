import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
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
    private localStorageService: LocalStorageService,
    private authService: AuthService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | any> | boolean | UrlTree | any {
    console.log('entra en la funcion');
    let resp = this.authService.verify().pipe(
      map((response) => {
        console.log(response);
        if (response == true) {
          return true;
        }
        this.router.navigate(['/login']);
        return false;
      }),
      catchError((error) => {
        this.router.navigate(['/login']);
        return of(false);
      })
    );
    console.log(resp);
    return resp;
  }
}
