import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexPlotOptions,
  ChartComponent
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
};

export type barChart = {
  new: any,
  repeat: any,
  lable:any
};


@Component({
  selector: 'app-barchart',
  templateUrl: './barchart.component.html',
  styleUrls: ['./barchart.component.css']
})
export class BarchartComponent {
  @ViewChild("chart") chart!: ChartComponent;
  @Input() data: barChart = { new: [], repeat: [] , lable:[] };

  constructor() {}
  
  public chartOptions!: Partial<ChartOptions>;

   ngOnChanges(changes: SimpleChanges) {
    this.chartOptions = {
      series: [
        {
          name: "New",
          data: this.data.new,
        },
        {
          name: "Repeat",
          data: this.data.repeat,
        }
      ],
      chart: {
        type: "bar",
        height: 150,
        stacked: true,
        stackType: "100%"
      },
      
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          // endingShape: "rounded"
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        // categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        categories:this.data.lable,
        labels: {
          show: false
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      }
    };
   }
 

}
