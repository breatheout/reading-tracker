import { Component } from '@angular/core';
import { GoogleBooksService } from './Services/google-books.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [GoogleBooksService],
})
export class AppComponent {
  title = 'reading-tracker';
  $: any;

  constructor() {}
}
