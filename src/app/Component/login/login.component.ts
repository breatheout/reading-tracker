import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from 'src/app/Models/auth.model';
import { AuthService } from 'src/app/Services/auth.service';
import { SharedService } from 'src/app/Services/shared.service';
import { HeaderMenusService } from 'src/app/Services/header-menus.service';
import { LocalStorageService } from 'src/app/Services/local-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginUser: Auth;
  username: FormControl;
  password: FormControl;
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private sharedService: SharedService,
    private headerMenusService: HeaderMenusService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {
    this.loginUser = new Auth('', '', '', '');

    this.username = new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(25),
    ]);

    this.password = new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(16),
    ]);

    this.form = this.formBuilder.group({
      username: this.username,
      password: this.password,
    });
  }

  ngOnInit(): void {}

  async login(): Promise<void> {
    this.loginUser.username = this.username.value;
    this.loginUser.password = this.password.value;
    try {
      const authToken = await this.authService.login(this.loginUser);
      this.loginSuccess(authToken);
    } catch (error: any) {
      this.loginFail(error);
    }
  }

  private async loginSuccess(authToken: any): Promise<void> {
    this.localStorageService.set('user_id', authToken.user_id);
    this.localStorageService.set('access_token', authToken.access_token);

    await this.sharedService.managementToast('formFeedback', true);

    this.headerMenusService.headerManagement.next({
      showAuthSection: true,
      showNoAuthSection: false,
    });
    this.router.navigateByUrl('home');
  }

  private async loginFail(error: any): Promise<void> {
    this.headerMenusService.headerManagement.next({
      showAuthSection: false,
      showNoAuthSection: true,
    });
    await this.sharedService.errorLog(error.error);
    await this.sharedService.managementToast(
      'formFeedback',
      false,
      error.error
    );
  }
}
