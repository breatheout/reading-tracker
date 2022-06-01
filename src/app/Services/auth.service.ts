import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Auth } from '../Models/auth.model';
import { User } from '../Models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  url: string = 'https://reading-tracker-application.herokuapp.com';
  constructor(private http: HttpClient) {}

  login(auth: Auth): Promise<Auth> {
    return this.http.post<Auth>(this.url + '/api/login', auth).toPromise();
  }

  logout(): Promise<void> {
    return this.http.delete<void>(this.url + '/api/logout').toPromise();
  }

  verify(): Observable<object> {
    return this.http.get(this.url + '/api/verify');
  }

  resetPassword(user: User): Promise<User> {
    return this.http.post<User>(this.url + '/api/reset', user).toPromise();
  }
}
