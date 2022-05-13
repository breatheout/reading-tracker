/*import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}*/
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthInterceptor } from 'src/app/Interceptors/auth.interceptor';
import { UserService } from 'src/app/Services/user.service';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  message: string;
  userLibrary: any;
  readingBooks: Array<object>;
  wantBooks: Array<object>;
  readBooks: Array<object>;

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService,
    private localStorageService: LocalStorageService
  ) {
    this.readingBooks = [];
    this.wantBooks = [];
    this.readBooks = [];
  }

  async ngOnInit(): Promise<void> {
    await this.userInfo();
    await this.getLibrary();
  }
  /*
  logout() {
    this.http.post('http://localhost:8000/api/logout', {}, {withCredentials: true})
      .subscribe(() => {
        AuthInterceptor.accessToken = '';

        this.router.navigate(['/login']);
      });
  }*/

  async userInfo(): Promise<void> {
    const res = await this.userService.getUserInfo();
    this.message = `Hi ${res[0].username}`;
    this.getLibrary();
  }

  async getLibrary(): Promise<void> {
    const res = await this.userService.getUserLibrary();
    this.userLibrary = res;
    this.filterBookDisplay();
  }

  filterBookDisplay(): void {
    console.log(this.readingBooks.length);
    console.log(this.readBooks.length);
    for (let book of this.userLibrary) {
      if (book.shelf == 'reading' && this.readingBooks.length < 8) {
        this.readingBooks.push(book);
        break;
      } else if (book.shelf == 'want to read' && this.wantBooks.length < 8) {
        this.wantBooks.push(book);
        break;
      } else if (book.shelf == 'read' && this.readBooks.length < 8) {
        this.readBooks.push(book);
        break;
      }
      console.log(this.readingBooks);
      console.log(this.readBooks);
    }
  }
}
