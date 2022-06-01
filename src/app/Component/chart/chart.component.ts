import { Component, Input, OnInit } from '@angular/core';
import { ChartOptions, ChartData } from 'chart.js';

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
    plugins: {},
  };

  constructor() {}

  ngOnInit(): void {}
}
