import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Auth } from '../Models/auth.model';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authHeader: object;

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {
    this.authHeader = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.localStorageService.get('access_token'),
      }),
    };
  }

  login(auth: Auth): Promise<Auth> {
    return this.http
      .post<Auth>(
        'https://reading-tracker-application.herokuapp.com/api/login',
        auth
      )
      .toPromise();
  }

  logout(): Promise<void> {
    return this.http
      .delete<void>(
        'https://reading-tracker-application.herokuapp.com/api/logout'
      )
      .toPromise();
  }

  /*verify(): any {
    return this.http
      .get('https://reading-tracker-application.herokuapp.com/api/verify')
      .toPromise();
  }*/

  verify(): any {
    return this.http.get(
      'https://reading-tracker-application.herokuapp.com/api/verify'
    );
  }
}
