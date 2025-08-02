import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

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
export class DonutChartComponent implements OnChanges {

  @Input() data: any;


  public chartOptions: Partial<ChartOptions> = {
    chart: {       // <-- Provide minimal default chart config here!
      type: 'donut',
      width: 180,
      height: 150
    },
    labels: [],
  } as any;

  constructor() {

  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['data'] && this.data?.CASH!==null && this.data?.ONLINE !==null)
      this.chartOptions = {
        series: [this.data?.CASH, this.data?.ONLINE],
        chart: {
          type: 'donut',
          width: 180,
          height: 150
        },
        labels: ['CASH(₹)', 'ONLINE(₹)'],
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
              return val.toFixed(3); // customize as needed
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
