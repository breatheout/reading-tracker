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
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjUxOTE0MDM2fQ.ZexoJf912Fl_Gwz156S5AAjDy6cvNzKMy_Hrh9kceo4',
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
}
