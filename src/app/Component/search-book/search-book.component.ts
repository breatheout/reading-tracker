import { Component } from '@angular/core';
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
  results: Book[];

  constructor(
    private bookService: GoogleBooksService,
    private changeDetect: ChangeDetectorRef,
    private router: Router
  ) {}

  @ViewChild('input', { static: false }) input: ElementRef;

  ngAfterViewInit() {
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(async (event: KeyboardEvent) => {
          const bookObservable: Observable<Book[]> = this.bookService.search(
            this.input.nativeElement.value
          );
          const books: Book[] = await bookObservable.toPromise();
          this.results = books;
        })
      )
      .subscribe();
    this.changeDetect.detectChanges();
  }

  goToBook(bookId: string): void {
    this.router.navigateByUrl('book/' + bookId);
  }
}
