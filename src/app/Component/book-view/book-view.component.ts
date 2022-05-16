import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Book } from 'src/app/Models/book.model';
import { BookService } from 'src/app/Services/book.service';
import { GoogleBooksService } from 'src/app/Services/google-books.service';
import { BookPost } from 'src/app/Models/bookpost.model';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { UserService } from 'src/app/Services/user.service';
import { StarsComponent } from '../stars/stars.component';

@Component({
  selector: 'app-book-view',
  templateUrl: './book-view.component.html',
  styleUrls: ['./book-view.component.scss'],
})
export class BookViewComponent implements OnInit {
  book: Book = new Book();
  bookID: string;
  bookPost: BookPost;
  bookInLibrary: any;
  ngDropdown: string = 'default';
  ngDateInputStart: string;
  ngDateInputEnd: string = '';
  rating: number;
  notes: string;
  genres: any;
  finishedLoading: boolean;

  constructor(
    private bookService: GoogleBooksService,
    private bookPostService: BookService,
    private userService: UserService,
    private route: ActivatedRoute,
    private localStorageService: LocalStorageService
  ) {}

  async ngOnInit(): Promise<void> {
    this.bookID = this.route.snapshot.paramMap.get('id');
    this.book = await this.bookService.getById(this.bookID).toPromise();
    this.arrangeGenres();
    this.bookPost = {
      username: this.localStorageService.get('user_id'),
      id: this.book.id,
      shelf: '',
      title: this.book.volumeInfo.title,
      pageCount: this.book.volumeInfo.pageCount,
      authors: this.book.volumeInfo.authors,
      genre: this.genres,
      startDate: this.getTodaysDate(),
      finishedDate: this.ngDateInputEnd,
      cover: this.book.volumeInfo.imageLinks.thumbnail,
      notes: '',
      rating: null,
    };
    this.finishedLoading = true;
    this.bookInLibrary = await this.userService.checkUserHasBook(this.bookID);
    this.setFormControl();

    if (this.ngDropdown == 'read' || this.ngDropdown == 'reading') {
      let collapse = <HTMLSelectElement>(
        document.getElementById('collapseExample')
      );
      collapse.classList.add('show');
    }
  }

  async addBook(): Promise<void> {
    try {
      var readingStatus;
      if (this.bookPost.finishedDate != '') {
        readingStatus = 'read';
      } else {
        readingStatus = (<HTMLSelectElement>(
          document.getElementById('shelfStatus')
        )).value;
      }
      this.bookPost.shelf = readingStatus;

      this.bookPost.notes = (<HTMLSelectElement>(
        document.getElementById('notes')
      )).value;
      if (readingStatus == 'want to read') {
        this.bookPost.startDate = '';
        this.bookPost.finishedDate = '';
        this.bookPost.rating = null;
        this.bookPost.notes = '';
      } else if (readingStatus == 'reading') {
        this.bookPost.rating = null;
      } else if (readingStatus == 'read' && this.ngDateInputEnd == '') {
        this.bookPost.finishedDate = this.getTodaysDate();
      }
      await this.bookPostService.addBook(this.bookPost);
      //this.registerSuccess();
    } catch (error: any) {
      //this.registerFail(error);
    }
    this.refresh();
  }

  getTodaysDate(): string {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    var todayString = yyyy + '-' + mm + '-' + dd;
    return todayString;
  }

  setFormControl(): void {
    if (this.bookInLibrary) {
      this.ngDropdown = this.bookInLibrary[0].shelf;
      this.ngDateInputStart = this.bookInLibrary[0].dateStart;
      if (this.bookInLibrary[0].dateFinished != '') {
        this.ngDateInputEnd = this.bookInLibrary[0].dateFinished;
      }
      this.rating = this.bookInLibrary[0].rating;
      this.notes = this.bookInLibrary[0].notes;
    }
  }

  updateDates(): void {
    this.bookPost.startDate = (<HTMLSelectElement>(
      document.getElementById('start')
    )).value;
    this.bookPost.finishedDate = (<HTMLSelectElement>(
      document.getElementById('end')
    )).value;
    this.bookPost.rating = Number(
      (<HTMLSelectElement>(
        document.querySelector('input[name="rating"]:checked')
      )).value
    );

    this.addBook();
  }

  arrangeGenres(): void {
    if (this.book.volumeInfo.categories) {
      var genreArray = this.book.volumeInfo.categories;
      var result = new Set();

      for (let genre of genreArray) {
        genre = genre.toLowerCase();
        let aux = genre.split(' / ');
        for (let i = 0; i < aux.length; i++) {
          result.add(aux[i]);
        }
      }

      this.genres = Array.from(result);
    }
  }

  refresh(): void {
    window.location.reload();
  }
}
