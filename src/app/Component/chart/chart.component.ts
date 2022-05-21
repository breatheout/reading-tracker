import { Component, Input, OnInit } from '@angular/core';
import { ChartType, ChartOptions, ChartData } from 'chart.js';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
})
export class ChartComponent implements OnInit {
  @Input() top5: string | string[] = '';
  @Input() type: string = '';
  @Input() chartData: ChartData<'line'>;

  chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      /*title: {
        display: true,
        text: 'Your book stats',
      },*/
    },
  };

  constructor() {}

  ngOnInit(): void {}
}
