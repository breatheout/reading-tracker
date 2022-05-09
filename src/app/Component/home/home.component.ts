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

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  message = '';
  currentlyReading = '';
  wantToRead = '';
  userLibrary: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService,
    private localStorageService: LocalStorageService
  ) {}

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
    try {
      const res = await this.userService.getUserInfo();
      this.message = `Hi ${res[0].username}`;
      this.getLibrary();
    } catch {
      this.router.navigate(['/login']);
    }
  }

  async getLibrary(): Promise<void> {
    try {
      const res = await this.userService.getUserLibrary();
      this.userLibrary = res;
    } catch {
      this.router.navigate(['/login']);
    }
  }
}
