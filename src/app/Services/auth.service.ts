import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth } from '../Models/auth.model';

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

  constructor(private http: HttpClient) {
    this.controller = 'login';
    this.url =
      'https://reading-tracker-application.herokuapp.com/api/' +
      this.controller;
    this.authHeader = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
      }),
    };
  }

  login(auth: Auth): Promise<AuthToken> {
    return this.http
      .post<AuthToken>(this.url, auth, this.authHeader)
      .toPromise();
  }
}
