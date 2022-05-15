import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthInterceptor } from 'src/app/Interceptors/auth.interceptor';
import { UserService } from 'src/app/Services/user.service';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BookService } from 'src/app/Services/book.service';
import { BehaviorSubject, forkJoin, fromEvent, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'app-shelf-view',
  templateUrl: './shelf-view.component.html',
  styleUrls: ['./shelf-view.component.css'],
})
export class ShelfViewComponent implements OnInit {
  shelfType: string;
  shelfDisplay: any[] = [];

  sortFilter: FormControl;
  orderFilter: FormControl;
  sortingForm: FormGroup;

  obsArray: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  items$: Observable<any> = this.obsArray.asObservable();
  currentPage: number = 1;
  pageSize: number = 4;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private bookService: BookService,
    private localStorageService: LocalStorageService
  ) {
    this.sortFilter = new FormControl('', []);

    this.orderFilter = new FormControl('', []);

    this.sortingForm = this.formBuilder.group({
      sortFilter: this.sortFilter,
      orderFilter: this.orderFilter,
    });
  }

  async ngOnInit(): Promise<void> {
    this.shelfType = this.route.snapshot.paramMap.get('type');
    console.log(this.shelfType);
    if (this.shelfType) {
      if (this.shelfType == 'want-to-read') {
        this.sortFilter.setValue('createdAt');
        this.orderFilter.setValue('DESC');
      } else if (this.shelfType == 'reading') {
        this.sortFilter.setValue('dateStart');
        this.orderFilter.setValue('DESC');
      } else if (this.shelfType == 'read') {
        this.sortFilter.setValue('dateFinished');
        this.orderFilter.setValue('DESC');
      }
      await this.userInfo();
      await this.getLibrary();
      this.getData();
    }
  }

  async userInfo(): Promise<void> {
    try {
      await this.userService.getUserInfo();
    } catch (error) {
      console.log(error);
    }
  }

  /*async getLibrary(): Promise<void> {
    try {
      this.shelfDisplay = await this.userService.getUserLibraryByType(
        this.localStorageService.get('user_id'),
        this.shelfType
      );
    } catch (error) {
      console.log(error);
    }
  }*/

  private getData() {
    this.userService
      .getUserLibraryObservable(this.currentPage, this.pageSize, this.shelfType)
      .subscribe((data: any) => {
        this.obsArray.next(data);
      });

    const content = document.querySelector('.items');
    const scroll$ = fromEvent(content!, 'scroll').pipe(
      map(() => {
        return content!.scrollTop;
      })
    );

    scroll$.subscribe((scrollPos) => {
      let limit = content!.scrollHeight - content!.clientHeight;
      if (scrollPos === limit) {
        this.currentPage += this.pageSize;
        forkJoin([
          this.items$.pipe(take(1)),
          this.userService.getUserLibraryObservable(
            this.currentPage,
            this.pageSize,
            this.shelfType
          ),
        ]).subscribe((data: Array<Array<any>>) => {
          const newArr = [...data[0], ...data[1]];
          this.obsArray.next(newArr);
        });
      }
    });
  }

  async getLibrary(): Promise<void> {
    var payload = [this.sortFilter.value, this.orderFilter.value];
    try {
      console.log(payload);
      this.shelfDisplay = await this.userService.getUserLibrary(
        this.shelfType.replace(/-/g, ' '),
        payload
      );
      this.arrangeAuthors();
    } catch (error) {
      console.log(error);
    }
  }

  remove(bookId: string): void {
    var result = confirm(
      'This book will be remove from your library and all data will be lost, do you want to continue?'
    );
    if (result) {
      this.bookService.deleteBook(bookId);
      window.location.reload();
    }
  }

  arrangeAuthors(): void {
    if (this.shelfType != null) {
      for (const book of this.shelfDisplay) {
        book.authors = book.authors.replaceAll('["', '');
        book.authors = book.authors.replaceAll('"]', '');
        book.authors = book.authors.replaceAll('","', ', ');
        book.authors = book.authors.trim();
      }
    }
  }

  async goToRead(): Promise<void> {
    await this.router.navigateByUrl('shelf/read').then(() => {
      this.ngOnInit();
    });
  }

  async goToReading(): Promise<void> {
    await this.router.navigateByUrl('shelf/reading').then(() => {
      this.ngOnInit();
    });
  }

  async goToWantToRead(): Promise<void> {
    await this.router.navigateByUrl('shelf/want-to-read').then(() => {
      this.ngOnInit();
    });
  }

  goToBook(bookId: string): void {
    this.router.navigateByUrl('book/' + bookId);
  }
}
