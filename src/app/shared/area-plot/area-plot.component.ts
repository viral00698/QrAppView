import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexTitleSubtitle, ApexDataLabels, ApexFill, ApexMarkers, ApexStroke, ApexTooltip } from 'ng-apexcharts';
import { areaChart } from 'src/app/menu/product-analytics/product-analytics.component';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  fill: ApexFill;
  tooltip: ApexTooltip;
  markers: ApexMarkers;
};


export type axis = {
  lable: any,
  count: any
};

@Component({
  selector: 'app-area-plot',
  templateUrl: './area-plot.component.html',
  styleUrls: ['./area-plot.component.css']
})
export class AreaPlotComponent  {

  @Input() data: axis = { lable: [], count: [] };


  public chartOptions!: Partial<ChartOptions>;
  constructor() { }



  ngOnChanges(changes: SimpleChanges) {
    // Calculate the average of the data array
   const average = this.data?.count.reduce((a:any, b:any) => a + b, 0) / this.data?.count.length;

   this.chartOptions = {
      series: [
        {
          name: "Order",
          // data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
          data:this.data?.count
        },
        // {
        //   name: "Sales",
        //   data: [85, 41, 180, 51, 49, 62, 69, 91, 148]
        // }
      ],
      chart: {
        type: "area",
        height: 150
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth"
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.2,
          stops: [0, 90, 100]
        }
      },
      xaxis: {
        categories: this.data?.lable,
        labels: {
          show: false
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
        // categories: this.getDateLabels('weekly', new Date(), new Date()),
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm"
        }
      },
      
    };
 
  }


  getDateLabels(type: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom', start?: Date, end?: Date): string[] {
    const labels: string[] = [];
    const today = new Date();

    switch (type) {
      case 'daily': {
        // Last 24 hours
        for (let i = 23; i >= 0; i--) {
          const date = new Date();
          date.setHours(today.getHours() - i);
          labels.push(`${date.getHours()}:00`);
        }
        break;
      }
      case 'weekly': {
        // Last 7 days with day names and date
        const options: Intl.DateTimeFormatOptions = {  day: '2-digit', month: 'short' };
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(today.getDate() - i);
          const label = date.toLocaleDateString('en-US', options); // e.g., "Monday, 14-Mar"
          labels.push(label);
        }
        break;
      }
      case 'monthly': {
        // Last 12 months
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        for (let i = 11; i >= 0; i--) {
          const date = new Date();
          date.setMonth(today.getMonth() - i);
          labels.push(`${monthNames[date.getMonth()]} ${date.getFullYear()}`);
        }
        break;
      }
      case 'yearly': {
        // Last 5 years
        const currentYear = today.getFullYear();
        for (let i = 4; i >= 0; i--) {
          labels.push(`${currentYear - i}`);
        }
        break;
      }
      case 'custom': {
        if (!start || !end) return [];
        const date = new Date(start);
        while (date <= end) {
          labels.push(date.toLocaleDateString());
          date.setDate(date.getDate() + 1);
        }
        break;
      }
    }

    return labels;
  }


}
