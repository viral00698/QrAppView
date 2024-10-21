import { Component, OnInit } from '@angular/core';
import { RequestStatus } from 'src/app/constent/request-status';
import { StorageKey } from 'src/app/constent/storage-key';
import { OrderServiceService } from 'src/app/services/order-service.service';
import { SecureLocalStorageService } from 'src/app/services/secure-local-storage.service';
import { VenderService } from 'src/app/services/vender.service';

@Component({
    selector: 'app-product-analytics',
    templateUrl: './product-analytics.component.html',
    styleUrls: ['./product-analytics.component.css']
})
export class ProductAnalyticsComponent implements OnInit {

    rangeDates: any;
    minDate!: Date;
    dateRange: Date[] = [];
    data: any;
    options: any;
    OrderStatistics: any;
    vender: any;
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

    constructor(private orderService: OrderServiceService, private secureLocalStorageService: SecureLocalStorageService) { }


    ngOnInit(): void {
        this.ordersChart()
        this.linechart()
        this.getVenderDetails()
        this.getVendorOrderStatisticsToday()
    }

    getVenderDetails() {
        const tmp = this.secureLocalStorageService.decryptAndGet(StorageKey.USER)
        if (tmp) {
            this.vender = JSON.parse(tmp)
        }

    }
    ordersChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

        this.data = {
            labels: ['A', 'B', 'C'],
            datasets: [
                {
                    data: [300, 50, 100],
                    backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--green-500')],
                    hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400')]
                }
            ]
        };


        this.options = {
            cutout: '60%',
            plugins: {
                legend: {
                    position: 'left',
                    labels: {
                        color: textColor
                    }
                }
            }
        };

    }

    linechart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.data = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'My First dataset',
                    backgroundColor: documentStyle.getPropertyValue('--blue-500'),
                    borderColor: documentStyle.getPropertyValue('--blue-500'),
                    data: [65, 59, 80, 81, 56, 55, 40, 87, 88, 99, 45, 88],
                    borderWidth: 2, // Set the line width here
                    barThickness: 10, // Set the bar width here
                    maxBarThickness: 30,
                    minBarThickness: 10
                },

            ]
        };

        this.options = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            weight: 500
                        }
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,

                    }
                }

            }
        };
    }


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
        }

    }
    getVendorOrderStatistics(date: any) {

        if (this.dateRange[0] !== null && this.dateRange[1] !== null) {

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
                    console.log(res);

                }
            })
        }
    }

    updateTimeRangeOptions() {
        if (this.rangeDates[0] && this.rangeDates[1]) {
          const daysDifference = differenceInDays(new Date(this.rangeDates[0]), new Date(this.rangeDates[1]));
      
          if ( daysDifference!=null && daysDifference === 0) {
            this.timeRangeOptions = [
              { label: 'Hourly', value: 'hourly' }
            ];
            this.selectedTimeRange = 'hourly';
          } else if (daysDifference!=null && daysDifference <= 7) {
            this.timeRangeOptions = [
              { label: 'Daily', value: 'daily' },
              { label: 'Hourly', value: 'hourly' }
            ];
            this.selectedTimeRange = 'daily';
          } else if (daysDifference!=null && daysDifference <= 30) {
            this.timeRangeOptions = [
              { label: 'Weekly', value: 'weekly' },
              { label: 'Daily', value: 'daily' }
            ];
            this.selectedTimeRange = 'weekly';
          } else {
            this.timeRangeOptions = [
              { label: 'Monthly', value: 'monthly' },
              { label: 'Weekly', value: 'weekly' },
              { label: 'Daily', value: 'daily' }
            ];
            this.selectedTimeRange = 'monthly';
          }
        }
      }

      getWeeklyData(startDate: Date, endDate: Date) {
        // Logic to group data by week
      }
    
      getHourlyData(startDate: Date, endDate: Date) {
        // Logic to group data by hours
      }
    
      getMonthlyData(startDate: Date, endDate: Date) {
        // Logic to group data by months
      }

      getDailyData(startDate: Date, endDate: Date) {
        // Logic to group data by days
      }
    
      // Call this method whenever the date changes
      onDateChange() {
        this.updateTimeRangeOptions();
        this.filterChart();
      }


      filterChart() {
        if (this.dateRange[0] && this.dateRange[1]) {
          let filteredData;
      
          if (this.selectedTimeRange === 'weekly') {
            filteredData = this.getWeeklyData(this.dateRange[0], this.dateRange[1]);
          } else if (this.selectedTimeRange === 'hourly') {
            filteredData = this.getHourlyData(this.dateRange[0], this.dateRange[1]);
          } else if (this.selectedTimeRange === 'daily') {
            filteredData = this.getDailyData(this.dateRange[0], this.dateRange[1]);  // Daily data logic
          } else {
            filteredData = this.getMonthlyData(this.dateRange[0], this.dateRange[1]);
          }
      
          // Update the chart with the filtered data
        //   this.data.labels = filteredData.labels;
        //   this.data.datasets[0].data = filteredData.data;
        }
      }
      
      

}





function differenceInDays(arg0: Date, arg1: Date) {
    throw new Error('Function not implemented.');
}

