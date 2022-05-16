import { Component, Injectable, OnInit } from '@angular/core';
import { ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { GoogleBooksService } from 'src/app/Services/google-books.service';
import { Book } from 'src/app/Models/book.model';
import { Observable } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-book',
  templateUrl: './search-book.component.html',
  styleUrls: ['./search-book.component.css'],
})
export class SearchBookComponent implements AfterViewInit {
  //result: Book;
  results: Book[];
  //resultID: string;
  //loading: boolean = true;

  constructor(
    private bookService: GoogleBooksService,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {}

  @ViewChild('input', { static: false }) input: ElementRef;

  ngAfterViewInit() {
    // server-side search
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(async (event: KeyboardEvent) => {
          const bookObservable: Observable<Book[]> = this.bookService.search(
            this.input.nativeElement.value
          );

          const books: Book[] = await bookObservable.toPromise();
          //const bookID = books[0].id;
          this.results = books;

          //const book = await this.bookService.getById(bookID).toPromise();
          //console.log(`book: ${JSON.stringify(book)}`);
          //this.result = book;
          //this.resultID = this.result.id;
          //console.log(this.result);
        })
      )
      .subscribe();
    this.cd.detectChanges(); // https://angular.io/errors/NG0100
  }

  goToBook(bookId: string): void {
    this.router.navigateByUrl('book/' + bookId);
  }
}
