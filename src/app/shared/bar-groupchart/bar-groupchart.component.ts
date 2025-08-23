import { Component, Input, SimpleChanges } from '@angular/core';

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexPlotOptions,
  ApexLegend,
  ApexFill,
  ApexTooltip,
  ApexStroke
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  legend: ApexLegend;
  fill: ApexFill;
  stroke?: ApexStroke;
  tooltip: ApexTooltip;
};



@Component({
  selector: 'app-bar-groupchart',
  templateUrl: './bar-groupchart.component.html',
  styleUrls: ['./bar-groupchart.component.css']
})
export class BarGroupchartComponent {

  @Input() data: { date: string[]; count: number[]; revenue: number[]; category: string[] } | undefined;
  @Input() Topselling: any;
  @Input() Lowestselling!: any;


  public chartOptions: Partial<ChartOptions> = {
    chart: {       // <-- Provide minimal default chart config here!
      type: 'bar',
      height: 350
    },
    series: [],
    xaxis: { categories: [] }
  } as any;

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['data'] && this.data?.revenue && this.data?.category ) {
      this.chartOptions = {
        series: [
          {
            name: 'Revenue (₹)',
            data: this.data?.revenue,
            
          },
          {
            name: 'Total Orders',
            data: this.data?.count,
          }
        ],
        chart: {
          type: 'bar',
          height: 350, 
          stacked: true,       
        },
        stroke: {
          width: [0, 1] // bar has 0 width stroke, line has 4
        },
        plotOptions: {
          bar: {
            horizontal: true,
            borderRadius: 2,
             barHeight: '40%'
          }
        },
        dataLabels: {
          enabled: false
        },
        legend: {
          position: 'top'
        },
        xaxis: {
          categories: this.data?.category,
        },

        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function (val: number) {
              return val + '';
            }
          }
        }
      };
    }


    if (changes['Topselling'] && this.Topselling?.item && this.Topselling?.totalQuantity) {

      this.chartOptions = {
        series: [
          {
            name: 'Revenue (₹)',
            data: this.Topselling.totalRevenue,

          },
          {
            name: 'Total Orders',
            data: this.Topselling.totalQuantity,
          }
        ],
        chart: {
          type: 'bar',
          height: 350,
          stacked: true,
        },
        stroke: {
          width: [0, 1] // bar has 0 width stroke, line has 4
        },
        plotOptions: {
          bar: {
            horizontal: true,
            borderRadius: 2,
            barHeight: '40%'
          }
        },
        dataLabels: {
          enabled: false
        },
        legend: {
          position: 'top'
        },
        xaxis: {
          categories: this.Topselling.item,
        },

        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function (val: number) {
              return val + '';
            }
          }
        }
      };

    }

  }
}
