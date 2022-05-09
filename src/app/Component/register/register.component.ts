import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/Services/user.service';
import { User } from 'src/app/Models/user.model';
import { SharedService } from 'src/app/Services/shared.service';
import { HeaderMenusService } from 'src/app/Services/header-menus.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  form: FormGroup;

  registerUser: User;

  username: FormControl;
  email: FormControl;
  password: FormControl;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private sharedService: SharedService,
    private headerMenusService: HeaderMenusService,
    private router: Router
  ) {
    this.registerUser = new User('', '', '');

    this.username = new FormControl(this.registerUser.username, [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(25),
    ]);

    this.email = new FormControl(this.registerUser.email, [
      Validators.required,
      Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
    ]);

    this.password = new FormControl(this.registerUser.password, [
      Validators.required,
      Validators.minLength(8),
    ]);

    this.form = this.formBuilder.group({
      username: this.username,
      email: this.email,
      password: this.password,
    });
  }

  ngOnInit(): void {}

  async register(): Promise<void> {
    if (!this.form.invalid) {
      this.registerUser = this.form.value;
      try {
        await this.userService.register(this.registerUser);
        this.registerSuccess();
      } catch (error: any) {
        this.registerFail(error);
      }
    }
  }

  private async registerSuccess(): Promise<void> {
    await this.sharedService.managementToast('registerFeedback', true);
    this.form.reset();
    this.router.navigateByUrl('home');
  }

  private async registerFail(error: any): Promise<void> {
    this.headerMenusService.headerManagement.next({
      showAuthSection: false,
      showNoAuthSection: true,
    });
    await this.sharedService.errorLog(error.error);
    await this.sharedService.managementToast(
      'registerFeedback',
      false,
      error.error
    );
  }
}
