import { Component, OnInit } from '@angular/core';
import { BookPost } from 'src/app/Models/bookpost.model';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  message: string;
  userLibrary: Array<BookPost>;
  readingBooks: Array<object>;
  wantBooks: Array<object>;
  readBooks: Array<object>;
  finishedLoading: boolean;

  constructor(private userService: UserService) {
    this.readingBooks = [];
    this.wantBooks = [];
    this.readBooks = [];
    this.finishedLoading = false;
  }

  async ngOnInit(): Promise<void> {
    // Get data
    await this.userInfo();
    await this.getLibrary();
    // Controls spinner
    this.finishedLoading = true;
  }

  async userInfo(): Promise<void> {
    const res = await this.userService.getUserInfo();
    this.message = 'Hi ' + res[0].username;
  }

  async getLibrary(): Promise<void> {
    const res = await this.userService.getUserLibrary();
    this.userLibrary = res;
    this.filterBookDisplay();
  }

  // Filters the books in user's library to display only 8 titles in home
  filterBookDisplay(): void {
    for (let book of this.userLibrary) {
      if (book.shelf == 'reading' && this.readingBooks.length < 8) {
        this.readingBooks.push(book);
      }
      if (book.shelf == 'want to read' && this.wantBooks.length < 8) {
        this.wantBooks.push(book);
      }
      if (book.shelf == 'read' && this.readBooks.length < 8) {
        this.readBooks.push(book);
      }
    }
  }
}
