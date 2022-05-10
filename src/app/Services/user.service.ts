import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../Models/user.model';
import { BookPost } from '../Models/bookpost.model';
import { Observable } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { environment } from 'src/environments/environment.prod';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private url: string;
  private controller: string;
  private httpDownloadOptions: any;
  private authHeader: object;

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {
    this.controller = 'user';
    this.url = 'http://localhost:3000/api/' + this.controller;
    this.httpDownloadOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        Authorization: 'Bearer ' + this.localStorageService.get('access_token'),
      }),
      responseType: 'text' as 'json',
    };
    this.authHeader = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        Authorization: 'Bearer ' + this.localStorageService.get('access_token'),
      }),
    };
  }

  register(user: User): Promise<User> {
    return this.http
      .post<User>(
        'https://reading-tracker-application.herokuapp.com/api/register',
        user
      )
      .toPromise();
  }

  updatePassword(passwords: {}): Promise<string> {
    return this.http
      .put<string>(
        'https://reading-tracker-application.herokuapp.com/api/password',
        passwords,
        this.authHeader
      )
      .toPromise();
  }

  downloadUserData() {
    return this.http
      .get(
        'https://reading-tracker-application.herokuapp.com/api/download',
        this.httpDownloadOptions
      )
      .toPromise();
  }

  deleteUser() {
    return this.http
      .delete(
        'https://reading-tracker-application.herokuapp.com/api/delete',
        this.authHeader
      )
      .toPromise();
  }

  getUserInfo() {
    return this.http
      .get<any>(
        this.url +
          'https://reading-tracker-application.herokuapp.com/api/user/info',
        this.authHeader
      )
      .toPromise();
  }

  getUserLibrary(type?: string, payload?: Array<string>) {
    return this.http
      .post<any>(
        'https://reading-tracker-application.herokuapp.com/api/user/library/',
        {
          payload,
          type,
        },
        this.authHeader
      )
      .toPromise();
  }

  checkUserHasBook(bookId: string): any {
    return this.http
      .get(
        'https://reading-tracker-application.herokuapp.com/api/user/book/' +
          bookId,
        this.authHeader
      )
      .toPromise();
  }
}
