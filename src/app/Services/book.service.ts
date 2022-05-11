import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BookPost } from '../Models/bookpost.model';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private url: string;
  private controller: string;
  private authHeader: object;

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {
    this.controller = 'api/books';
    this.url = 'http://localhost:3000/' + this.controller;
    this.authHeader = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.localStorageService.get('access_token'),
      }),
    };
  }

  addBook(book: BookPost) {
    return this.http
      .post<BookPost>(
        'https://reading-tracker-application.herokuapp.com/api/book/add',
        book,
        this.authHeader
      )
      .toPromise();
  }

  deleteBook(bookId: string) {
    return this.http
      .delete(
        'https://reading-tracker-application.herokuapp.com/api/book/delete',
        {
          body: { bookId: bookId },
          headers: {
            'Access-Control-Allow-Origin': '*',
            Authorization:
              'Bearer ' + this.localStorageService.get('access_token'),
          },
        }
      )
      .toPromise();
  }
}
