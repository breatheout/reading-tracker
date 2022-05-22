import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ChartType, ChartOptions, ChartData } from 'chart.js';
import { BookPost } from 'src/app/Models/bookpost.model';

import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css'],
})
export class StatsComponent implements OnInit {
  @ViewChild('container', { read: ViewContainerRef, static: true })
  embeddedContainer: ViewContainerRef;
  top5Genres: string[];
  top5GenresData: number[];
  top5Authors: string[];
  top5AuthorsData: number[];

  currentYear: string = new Date().getFullYear().toString();

  totalPages: number;
  annualPages: number;
  shortestBook: any;
  largestBook: any;
  totalBooks: number = 0;
  totalAnnualBooks: number = 0;

  barChart: string = 'bar';
  pieChart: string = 'pie';

  userLibrary: Array<any>;

  chartDataGenres: ChartData<'bar'>;
  chartDataAuthors: ChartData<'pie'>;

  displayTopGenres: boolean = true;
  displayTopAuthors: boolean = false;

  constructor(private userService: UserService) {}

  async ngOnInit(): Promise<void> {
    await this.getLibrary();
    await this.getTopGenres();
    await this.getTopAuthors();
    await this.getPagesData();

    this.chartDataGenres = {
      // Las labels deberia ser el array con los generos de los libros
      labels: [''],
      datasets: [
        // labels es el eje horizontal, data son los numeros que aparecen en el eje vertical, la tension es solo para los line charts
        {
          label: this.top5Genres[0],
          data: [this.top5GenresData[0]],
          backgroundColor: ['rgba(116, 58, 213, 1)'],
          borderColor: ['rgba(116, 58, 213, 1)'],
          hoverBackgroundColor: ['rgba(116, 58, 213, 0.5)'],
          hoverBorderColor: ['rgba(116, 58, 213, 0.5)'],
        },
        {
          label: this.top5Genres[1],
          data: [this.top5GenresData[1]],
          backgroundColor: ['rgba(213, 58, 157, 1)'],
          borderColor: ['rgba(213, 58, 157, 1)'],
          hoverBackgroundColor: ['rgba(213, 58, 157, 0.5)'],
          hoverBorderColor: ['rgba(213, 58, 157, 0.5)'],
        },
        {
          label: this.top5Genres[2],
          data: [this.top5GenresData[2]],
        },
        {
          label: this.top5Genres[3],
          data: [this.top5GenresData[3]],
        },
        {
          label: this.top5Genres[4],
          data: [this.top5GenresData[4]],
        },
      ],
    };
    this.chartDataAuthors = {
      // Las labels deberia ser el array con los generos de los libros
      labels: [''],
      datasets: [
        // labels es el eje horizontal, data son los numeros que aparecen en el eje vertical, la tension es solo para los line charts
        {
          label: this.top5Authors[0],
          data: [this.top5AuthorsData[0]],
          backgroundColor: ['rgba(116, 58, 213, 1)'],
          borderColor: ['rgba(116, 58, 213, 1)'],
          hoverBackgroundColor: ['rgba(116, 58, 213, 0.5)'],
          hoverBorderColor: ['rgba(116, 58, 213, 0.5)'],
        },
        {
          label: this.top5Authors[1],
          data: [this.top5AuthorsData[1]],
          backgroundColor: ['rgba(213, 58, 157, 1)'],
          borderColor: ['rgba(213, 58, 157, 1)'],
          hoverBackgroundColor: ['rgba(213, 58, 157, 0.5)'],
          hoverBorderColor: ['rgba(213, 58, 157, 0.5)'],
        },
        {
          label: this.top5Authors[2],
          data: [this.top5AuthorsData[2]],
        },
        {
          label: this.top5Authors[3],
          data: [this.top5AuthorsData[3]],
        },
        {
          label: this.top5Authors[4],
          data: [this.top5AuthorsData[4]],
        },
      ],
    };
  }

  async getLibrary(): Promise<void> {
    try {
      this.userLibrary = await this.userService.getUserLibrary('read');
    } catch {
      console.log('Error getting library');
    }
  }

  getTopGenres(): void {
    var result = [];

    // Create a single array with all the genres
    for (const book of this.userLibrary) {
      // Filter tag 'general' out
      if (book.shelf == 'read' && !book.genre.includes('general')) {
        $.map(book.genre.split('"'), function (substr, i: number) {
          return i % 2 ? result.push(substr) : null;
        });
      }
    }

    // Get the top 5 genres
    let realTop5 = [];
    let realTop5Count = [];
    let i = 0;
    do {
      // Gets most repeated genre tag
      let aux = result
        .sort(
          (a, b) =>
            result.filter((v) => v === a).length -
            result.filter((v) => v === b).length
        )
        .pop();
      realTop5.push(aux);
      // Counts how many times it's repeated
      let count = 1;
      result.forEach((element) => {
        if (element === aux) {
          count++;
        }
      });
      realTop5Count.push(count);
      // Deletes the tag from the array
      result = result.filter(function (value, index, arr) {
        return value != aux;
      });
      i++;
    } while (i < 5);
    this.top5Genres = realTop5;
    this.top5GenresData = realTop5Count;
  }

  getTopAuthors(): void {
    var result = [];

    // Create a single array with all the genres
    for (const book of this.userLibrary) {
      if (book.shelf == 'read') {
        $.map(book.authors.split('"'), function (substr, i: number) {
          return i % 2 ? result.push(substr) : null;
        });
      }
    }

    // Get the top 5 genres
    let realTop5 = [];
    let realTop5Count = [];
    let i = 0;
    do {
      // Gets most repeated genre tag
      let aux = result
        .sort(
          (a, b) =>
            result.filter((v) => v === a).length -
            result.filter((v) => v === b).length
        )
        .pop();
      realTop5.push(aux);
      // Counts how many times it's repeated
      let count = 1;
      result.forEach((element) => {
        if (element === aux) {
          count++;
        }
      });
      realTop5Count.push(count);
      // Deletes the tag from the array
      result = result.filter(function (value, index, arr) {
        return value != aux;
      });
      i++;
    } while (i < 5);
    this.top5Authors = realTop5;
    this.top5AuthorsData = realTop5Count;
  }

  getPagesData() {
    let overallResult: number = 0;
    let annualResult: number = 0;
    let largest: number = this.userLibrary[0].pageCount;
    let largestBook;
    let shortest: number = this.userLibrary[0].pageCount;
    let shortestBook;

    for (var i = 0; i < this.userLibrary.length; i++) {
      if ((this.userLibrary[i].shelf = 'read')) {
        this.totalBooks++;
        overallResult += Number(this.userLibrary[i].pageCount);
        if (this.userLibrary[i].dateFinished.includes(this.currentYear)) {
          annualResult += Number(this.userLibrary[i].pageCount);
          this.totalAnnualBooks++;
        }
        if (largest < this.userLibrary[i].pageCount) {
          largest = this.userLibrary[i].pageCount;
          largestBook = this.userLibrary[i];
        }
        if (shortest > this.userLibrary[i].pageCount) {
          shortest = this.userLibrary[i].pageCount;
          shortestBook = this.userLibrary[i];
        }
      }
    }
    this.totalPages = overallResult;
    this.annualPages = annualResult;
    this.largestBook = largestBook;
    this.shortestBook = shortestBook;
  }

  changeDisplay() {
    this.displayTopGenres = !this.displayTopGenres;
    this.displayTopAuthors = !this.displayTopAuthors;
  }
}
