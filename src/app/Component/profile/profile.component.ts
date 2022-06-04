import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/Services/shared.service';
import { UserService } from 'src/app/Services/user.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  username: string;

  passwordNew: FormControl;
  passwordOld: FormControl;
  passwordForm: FormGroup;

  isValidForm: boolean | null;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private sharedService: SharedService
  ) {
    this.passwordOld = new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]);

    this.passwordNew = new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]);

    this.passwordForm = this.formBuilder.group({
      passwordNew: this.passwordNew,
      passwordOld: this.passwordOld,
    });
  }

  async ngOnInit(): Promise<void> {
    await this.userService.getUserInfo().then((res) => {
      this.username = res[0].username;
    });
  }

  async downloadUserData(): Promise<void> {
    await this.userService.downloadUserData().then((buffer: any) => {
      const data: Blob = new Blob([buffer], {
        type: 'text/csv;charset=utf-8',
      });
      saveAs(data, this.username + '_data.csv');
    });
  }

  async updatePassword(): Promise<void> {
    this.isValidForm = true;
    if (this.isValidForm == true) {
      //this.registerUser = this.form.value;
      let passwords = {
        old: this.passwordOld.value,
        new: this.passwordNew.value,
      };
      try {
        await this.userService.updatePassword(passwords);
        this.updatePasswordSuccess();
      } catch (error: any) {
        this.updatePasswordFail(error);
      }
    }
  }

  deleteAccount(): void {
    var confirmation = confirm(
      'This account will be permanently deleted and all data will be lost, do you want to continue?'
    );
    if (confirmation) {
      this.userService.deleteUser();
      alert('Your account has been deleted');
      localStorage.clear();
      this.router.navigateByUrl('home');
    }
  }

  private async updatePasswordSuccess(): Promise<void> {
    await this.sharedService.managementToast('formFeedback', true);
    this.passwordForm.reset();
  }

  private async updatePasswordFail(error: any): Promise<void> {
    await this.sharedService.errorLog(error.error);
    await this.sharedService.managementToast(
      'formFeedback',
      false,
      error.error
    );
  }
}
