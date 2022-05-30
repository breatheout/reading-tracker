import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Auth } from '../Models/auth.model';
import { User } from '../Models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

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

  verify(): Observable<object> {
    return this.http.get(
      'https://reading-tracker-application.herokuapp.com/api/verify'
    );
  }

  resetPassword(user: User): Promise<User> {
    return this.http
      .post<User>(
        'https://reading-tracker-application.herokuapp.com/api/reset',
        user
      )
      .toPromise();
  }
}
