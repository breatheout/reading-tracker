import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BookPost } from '../Models/bookpost.model';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private authHeader: object;

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {}

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
          /*headers: {
            'Access-Control-Allow-Origin': '*',
            Authorization:
              'Bearer ' + this.localStorageService.get('access_token'),
          },*/
        }
      )
      .toPromise();
  }
}
