import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../Models/user.model';
import { LocalStorageService } from './local-storage.service';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private url: string;
  private controller: string;
  private httpDownloadOptions: any;

  constructor(private http: HttpClient) {
    this.controller = 'user';
    this.url = 'http://localhost:3000/api/' + this.controller;
    this.httpDownloadOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }),
      responseType: 'text' as 'json',
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
        'https://reading-tracker-application.herokuapp.com/api/user/password',
        passwords
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
      .delete('https://reading-tracker-application.herokuapp.com/api/delete')
      .toPromise();
  }

  getUserInfo() {
    return this.http
      .get<any>(
        'https://reading-tracker-application.herokuapp.com/api/user/info'
      )
      .toPromise();
  }

  getUserLibrary(type?: string, payload?: any): Promise<any> {
    return this.http
      .post<any>(
        'https://reading-tracker-application.herokuapp.com/api/user/library/',
        {
          payload,
          type,
        }
      )
      .toPromise();
  }

  checkUserHasBook(bookId: string): any {
    return this.http
      .get(
        'https://reading-tracker-application.herokuapp.com/api/user/book/' +
          bookId
      )
      .toPromise();
  }

  /* To implement infinite scroll (abandoned feature) */
  getUserLibraryObservable(
    pagenum: number,
    pagesize: number,
    type?: string,
    payload?: any
  ): any {
    if (pagenum == null && pagesize == null) {
      pagenum = 1;
      pagesize = 10;
    }
    const spacesReplaced = type.replace(' ', '-');
    return this.http.post<any>(
      'https://reading-tracker-application.herokuapp.com/api/observable/user/library/' +
        pagenum +
        '/' +
        pagesize,
      {
        payload,
        spacesReplaced,
      }
    );
  }
}
