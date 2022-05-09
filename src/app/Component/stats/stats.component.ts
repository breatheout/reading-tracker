import { TypeofExpr } from '@angular/compiler';
import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ChartType, ChartOptions, ChartData } from 'chart.js';
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

  userLibrary: any;

  salesData: ChartData<'line'>;

  constructor(
    private userService: UserService,
    private localStorageService: LocalStorageService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.getLibrary();
    console.log(this.userLibrary);
    await this.getTopGenres();
    console.log(this.top5Genres);

    this.salesData = {
      // Las labels deberia ser el array con los generos de los libros
      labels: ['global'],
      datasets: [
        // labels es el eje horizontal, data son los numeros que aparecen en el eje vertical, la tension es solo para los line charts
        {
          label: this.top5Genres[0],
          data: [this.top5GenresData[0]],
        },
        {
          label: this.top5Genres[1],
          data: [this.top5GenresData[1]],
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
  }

  async getLibrary(): Promise<void> {
    try {
      this.userLibrary = await this.userService.getUserLibrary();
    } catch {
      console.log('Error getting library');
    }
  }

  getTopGenres(): void {
    var result = [];

    // Create a single array with all the genres
    for (const book of this.userLibrary) {
      $.map(book.genre.split('"'), function (substr, i: number) {
        return i % 2 ? result.push(substr) : null;
      });
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
      let count = 0;
      result.forEach((element) => {
        if (element === aux) {
          count += 1;
        }
      });
      realTop5Count.push(count);
      // Deletes the tag from the array
      result = result.filter(function (value, index, arr) {
        return value != aux;
      });
      i++;
    } while (i < 5);
    console.log(realTop5);
    this.top5Genres = realTop5;
    this.top5GenresData = realTop5Count;
  }
}
