import { HttpClient } from '@angular/common/http';
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

  constructor(private http: HttpClient) {
    this.controller = 'login';
    this.url =
      'https://reading-tracker-application-be.herokuapp.com/api/' +
      this.controller;
  }

  login(auth: Auth): Promise<AuthToken> {
    return this.http.post<AuthToken>(this.url, auth).toPromise();
  }
}
