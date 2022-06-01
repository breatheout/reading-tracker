import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BookPost } from '../Models/bookpost.model';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  url: string = 'https://reading-tracker-application.herokuapp.com';
  constructor(private http: HttpClient) {}

  addBook(book: BookPost) {
    return this.http
      .post<BookPost>(this.url + '/api/book/add', book)
      .toPromise();
  }

  deleteBook(bookId: string) {
    return this.http
      .delete(this.url + '/api/book/delete', {
        body: { bookId: bookId },
      })
      .toPromise();
  }
}
