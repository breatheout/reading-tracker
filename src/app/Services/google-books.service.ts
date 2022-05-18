import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Book } from '../Models/book.model';

@Injectable({
  providedIn: 'root',
})
export class GoogleBooksService {
  private api_url = 'https://www.googleapis.com/books/v1/volumes';

  constructor(private http: HttpClient) {}

  search(query: string): Observable<Book[]> {
    return this.http
      .get<{ items: Book[] }>(`${this.api_url}?q=${query}`)
      .pipe(map((books) => books.items || []));
  }

  getById(volumeId: string): Observable<Book> {
    return this.http.get<Book>(`${this.api_url}/${volumeId}`);
  }
}
