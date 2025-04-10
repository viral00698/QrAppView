import { Component, OnInit } from '@angular/core';
import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexTitleSubtitle } from 'ng-apexcharts';
import { RequestStatus } from 'src/app/constent/request-status';
import { StorageKey } from 'src/app/constent/storage-key';
import { TimeIntrval } from 'src/app/constent/time-intrval';
import { ChartService } from 'src/app/services/chart.service';
import { OrderServiceService } from 'src/app/services/order-service.service';
import { SecureLocalStorageService } from 'src/app/services/secure-local-storage.service';
import { VenderService } from 'src/app/services/vender.service';


export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-product-analytics',
  templateUrl: './product-analytics.component.html',
  styleUrls: ['./product-analytics.component.css']
})
export class ProductAnalyticsComponent implements OnInit {


  DateIntervals: Date[] = [];
  rangeDates: any;
  minDate!: Date;
  dateRange: Date[] = [];
  data: any;
  options: any;
  OrderStatistics: any;
  vender: any;
  topTrendingitem: any = []
  // timeRangeOptions = [];
  selectedTimeRange!: string;
  timeRangeOptions: { label: string; value: string }[] = [];
  //   orderKhobValue = 250
  //   revenuekhobValue = 4766.00
  //   onlinekhobValue = 23750
  //   cashkhobValue = 565
  //   cities:any=[]
  state_Orders: any
  state_Revenue: any
  state_Ongoing: any

  public chartOptions: ChartOptions = {
    series: [
      {
        name: 'Example',
        data: [10, 20, 15, 30]
      }
    ],
    chart: {
      type: 'line',
      height: 350
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr']
    },
    title: {
      text: 'Line Chart Example'
    }
  };

  constructor(private orderService: OrderServiceService,
    private secureLocalStorageService: SecureLocalStorageService,
    private dateIntervalService: ChartService) { 
      this.chartOptions = {
        series: [{
          name: "Example",
          data: [10, 20, 15, 30]
        }],
        chart: {
          type: "line",
          height: 350
        },
        xaxis: {
          categories: ["Jan", "Feb", "Mar", "Apr"]
        },
        title: {
          text: "Line Chart Example"
        }
      };
    
    }

  ngOnInit(): void {
    // this.ordersChart()
    // this.linechart()
    this.getVenderDetails()
    this.getVendorOrderStatisticsToday()
  }

  getVenderDetails() {
    const tmp = this.secureLocalStorageService.decryptAndGet(StorageKey.USER)
    if (tmp) {
      this.vender = JSON.parse(tmp)
    }

  }
  // ordersChart() {
  //   const documentStyle = getComputedStyle(document.documentElement);
  //   const textColor = documentStyle.getPropertyValue('--text-color');

  //   this.data = {
  //     labels: ['A', 'B', 'C'],
  //     datasets: [
  //       {
  //         data: [300, 50, 100],
  //         backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--green-500')],
  //         hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400')]
  //       }
  //     ]
  //   };


  //   this.options = {
  //     cutout: '60%',
  //     plugins: {
  //       legend: {
  //         position: 'left',
  //         labels: {
  //           color: textColor
  //         }
  //       }
  //     }
  //   };

  // }

  // linechart() {
  //   const documentStyle = getComputedStyle(document.documentElement);
  //   const textColor = documentStyle.getPropertyValue('--text-color');
  //   const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
  //   const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

  //   this.data = {
  //     // labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
  //     datasets: [
  //       {
  //         // label: 'My First dataset',
  //         backgroundColor: documentStyle.getPropertyValue('--blue-500'),
  //         borderColor: documentStyle.getPropertyValue('--blue-500'),
  //         data: [22, 5, 8, 99, 9, 9],
  //         borderWidth: 2, // Set the line width here
  //         barThickness: 10, // Set the bar width here
  //         maxBarThickness: 30,
  //         minBarThickness: 10
  //       },

  //     ]
  //   };

  //   // this.options = {
  //   //   maintainAspectRatio: false,
  //   //   aspectRatio: 0.8,
  //   //   plugins: {
  //   //     legend: {
  //   //       labels: {
  //   //         color: textColor
  //   //       }
  //   //     }
  //   //   },
  //   //   scales: {
  //   //     x: {
  //   //       ticks: {
  //   //         color: textColorSecondary,
  //   //         font: {
  //   //           weight: 500
  //   //         }
  //   //       },
  //   //       grid: {
  //   //         color: surfaceBorder,
  //   //         drawBorder: false
  //   //       }
  //   //     },
  //   //     y: {
  //   //       ticks: {
  //   //         color: textColorSecondary
  //   //       },
  //   //       grid: {
  //   //         color: surfaceBorder,
  //   //         drawBorder: false,

  //   //       }
  //   //     }

  //   //   }
  //   // };
  // }


  getVendorOrderStatisticsToday() {

    if (this.dateRange[0] !== null && this.dateRange[1] !== null) {

      const data = {
        'startDate': new Date(),
        'endDate': new Date(),
        'venderId': this.vender?.vendorId
      }

      this.orderService.findVendorOrderStatistics(data).subscribe((res: any) => {
        if (res.status === RequestStatus.success) {
          this.state_Orders = res.data[2]
          this.state_Ongoing = res.data[0]
          this.state_Revenue = res.data[1]
          console.log(res);

        }
      })


      this.orderService.findTop10MostOrderedItems(data).subscribe((res: any) => {
        if (res.status === RequestStatus.success) {
          console.log(res);
          this.topTrendingitem = res.data;
          this.topTranDingComman(this.topTrendingitem)
        }
      })

    }

  }
  getVendorOrderStatistics(date: any) {

    if (this.dateRange[0] !== null && this.dateRange[1] !== null) {
      this.DateIntervals = this.dateIntervalService.getDateIntervals(this.dateRange[0], this.dateRange[1]);

      console.log("Hourly Intervals:", this.DateIntervals);

      const data = {
        'startDate': this.dateRange[0],
        'endDate': this.dateRange[1],
        'venderId': this.vender?.vendorId
      }
      this.orderService.findVendorOrderStatistics(data).subscribe((res: any) => {
        if (res.status === RequestStatus.success) {
          this.state_Orders = res.data[0]
          this.state_Ongoing = res.data[2]
          this.state_Revenue = res.data[1]


        }
      })

      this.orderService.findTop10MostOrderedItems(data).subscribe((res: any) => {
        if (res.status === RequestStatus.success) {
          this.topTrendingitem = res.data;
          this.topTranDingComman(this.topTrendingitem)
        }
      })
    }
  }

  topTranDingComman(topTrends: any) {

    const labels = topTrends.map((item: any) => item[0]);
    const values = topTrends.map((item: any) => item[1]);

    if(labels.length < 1 || values.length <1){
      labels.push('No Values');
      values.push(0.1);
     
    }
    this.data = {
      labels: labels,
      datasets: [
        {
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#F56954', '#8E44AD', '#2ECC71', '#FF9F40', '#FFCD56', '#C2C0C0'],
          borderColor: '#ffffff',
          data: values,
          borderWidth: 2,
          barThickness: 10,
          maxBarThickness: 30,
          minBarThickness: 10
        },
      ],

      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false // Hide legend
          },
          tooltip: {
            enabled: false // Optionally, hide tooltips
          }
        },
        elements: {
          arc: {
            borderWidth: 0 // Hide border around segments
          }
        },
        animation: {
          animateRotate: true, // Keep rotation animation (optional)
        },
      }
    };
  };
}

