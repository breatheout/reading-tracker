import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
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

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    // AQUI HAY QUE IR AL API PARA VER SI EL TOKEN ES VALIDO
    const access_token = this.localStorageService.get('access_token');
    let resp: any;
    if (access_token) {
      // logged in so return true
      resp = this.authService.verify(access_token);
      if (resp == true) {
        return resp;
      }
    }

    this.router.navigate(['/login']);
    console.log('login');
    return false;
  }
}
