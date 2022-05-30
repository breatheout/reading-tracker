import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BookPost } from '../Models/bookpost.model';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  constructor(private http: HttpClient) {}

  addBook(book: BookPost) {
    return this.http
      .post<BookPost>(
        'https://reading-tracker-application.herokuapp.com/api/book/add',
        book
      )
      .toPromise();
  }

  deleteBook(bookId: string) {
    return this.http
      .delete(
        'https://reading-tracker-application.herokuapp.com/api/book/delete',
        {
          body: { bookId: bookId },
        }
      )
      .toPromise();
  }
}
