import { Component } from '@angular/core';

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexLegend,
  ApexDataLabels,
  ApexTooltip
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  responsive: ApexResponsive[];
  legend: ApexLegend;
  dataLabels: ApexDataLabels;
  tooltip: ApexTooltip;
}
@Component({
  selector: 'app-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.css']
})
export class DonutChartComponent {
  public chartOptions: Partial<ChartOptions>;

  constructor() {
    this.chartOptions = {
      series: [44, 55, 13, 33],
      chart: {
        type: 'donut',
        width: 180,
        height: 150
      },
      labels: ['Apples', 'Bananas', 'Cherries', 'Dates'],
      dataLabels: {
        enabled: false // hides percentages inside slices
      },
      legend: {
        show: false // hides legend
      },
      tooltip: {
        enabled: true,
        y: {
          formatter: function (val: number) {
            return val + " units"; // customize as needed
          }
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            }
          }
        }
      ]
    };
  }
  }
