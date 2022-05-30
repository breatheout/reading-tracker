import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/Models/user.model';
import { AuthService } from 'src/app/Services/auth.service';
import { HeaderMenusService } from 'src/app/Services/header-menus.service';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { SharedService } from 'src/app/Services/shared.service';

@Component({
  selector: 'app-resetpass',
  templateUrl: './resetpass.component.html',
  styleUrls: ['./resetpass.component.css'],
})
export class ResetpassComponent implements OnInit {
  forgottenUser: User;

  username: FormControl;
  email: FormControl;
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private sharedService: SharedService,
    private headerMenusService: HeaderMenusService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {
    this.forgottenUser = new User('', '', 'forgottenPassword');
    this.username = new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(25),
    ]);

    this.email = new FormControl(this.forgottenUser.email, [
      Validators.required,
      Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
    ]);

    this.form = this.formBuilder.group({
      username: this.username,
      email: this.email,
    });
  }

  ngOnInit(): void {}

  async resetPassword(): Promise<void> {
    if (!this.form.invalid) {
      this.forgottenUser = this.form.value;
      try {
        await this.authService.resetPassword(this.forgottenUser);
        this.resetSuccess();
      } catch (error: any) {
        this.resetFail(error);
      }
    }
  }

  private async resetSuccess(): Promise<void> {
    await this.sharedService.managementToast('formFeedback', true);
    this.form.reset();
    this.router.navigateByUrl('home');
  }

  private async resetFail(error: any): Promise<void> {
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
