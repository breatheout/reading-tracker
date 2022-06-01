import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../Models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  url: string = 'https://reading-tracker-application.herokuapp.com';
  private httpDownloadOptions: Object;

  constructor(private http: HttpClient) {
    this.httpDownloadOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }),
      responseType: 'text' as 'json',
    };
  }

  register(user: User): Promise<User> {
    return this.http.post<User>(this.url + '/api/register', user).toPromise();
  }

  updatePassword(passwords: {}): Promise<string> {
    return this.http
      .put<string>(this.url + '/api/user/password', passwords)
      .toPromise();
  }

  downloadUserData() {
    return this.http
      .get(this.url + '/api/download', this.httpDownloadOptions)
      .toPromise();
  }

  deleteUser() {
    return this.http.delete(this.url + '/api/delete').toPromise();
  }

  getUserInfo() {
    return this.http.get<any>(this.url + '/api/user/info').toPromise();
  }

  getUserLibrary(type?: string, payload?: any): Promise<any> {
    return this.http
      .post<any>(this.url + '/api/user/library/', {
        payload,
        type,
      })
      .toPromise();
  }

  checkUserHasBook(bookId: string): any {
    return this.http.get(this.url + '/api/user/book/' + bookId).toPromise();
  }

  /* To implement infinite scroll (abandoned feature)
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
      this.url + '/api/observable/user/library/' + pagenum + '/' + pagesize,
      {
        payload,
        spacesReplaced,
      }
    );
  }*/
}
