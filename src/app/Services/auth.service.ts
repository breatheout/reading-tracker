import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth } from '../Models/auth.model';
import { LocalStorageService } from './local-storage.service';

interface AuthToken {
  user_id: string;
  access_token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url: string;
  private controller: string;
  private authHeader: object;

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {
    this.controller = 'login';
    this.url =
      'https://reading-tracker-application.herokuapp.com/api/' +
      this.controller;
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
        auth,
        this.authHeader
      )
      .toPromise();
  }

  logout(): Promise<void> {
    console.log(this.authHeader);
    return this.http
      .put<void>(
        'https://reading-tracker-application.herokuapp.com/api/logout',
        this.authHeader
      )
      .toPromise();
  }
}
