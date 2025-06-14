import { Component, OnInit } from '@angular/core';
import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexTitleSubtitle } from 'ng-apexcharts';
import { RequestStatus } from 'src/app/constent/request-status';
import { StorageKey } from 'src/app/constent/storage-key';
import { TimeIntrval } from 'src/app/constent/time-intrval';
import { BarchartFilterService } from 'src/app/services/barchart-filter.service';
import { ChartService } from 'src/app/services/chart.service';
import { CustomFilterService } from 'src/app/services/custom-filter.service';
import { FilterRevenueByFoodService } from 'src/app/services/filter-revenue-by-food.service';
import { OrderServiceService } from 'src/app/services/order-service.service';
import { OrderStaticticsService } from 'src/app/services/order-statictics.service';
import { SecureLocalStorageService } from 'src/app/services/secure-local-storage.service';
import { TopAndLowestSellingService } from 'src/app/services/top-and-lowest-selling.service';
import { VenderService } from 'src/app/services/vender.service';


export type areaChart = {
  total: number,
  ongoing: number
};

export type axis = {
  lable: any,
  count: any
};

export type barChart = {
  new: any,
  repeat: any,
  lable: any
};
@Component({
  selector: 'app-product-analytics',
  templateUrl: './product-analytics.component.html',
  styleUrls: ['./product-analytics.component.css']
})
export class ProductAnalyticsComponent implements OnInit {


  areaChartData!: areaChart;
  dataForArea!: axis;
  barChartData!: barChart;
  DateIntervals: Date[] = [];
  rangeDates: any;
  minDate!: Date;
  dateRange: Date[] = [];
  data: any;
  options: any;
  OrderStatistics: any;
  vender: any;
  topTrendingitem: any = []

  selectedTimeRange!: string;
  timeRangeOptions: { label: string; value: string }[] = [];

  state_Orders: any
  state_Revenue: any
  state_Ongoing: any
  revenueByFoodCetegoryFiter: any;
  orderStates!: { totalAmount: number; totalOrders: number; ongoingOrders: number; };
  TopSellingItems: any;
  LowestSellingItems: any;


  constructor(private orderService: OrderServiceService,
    private secureLocalStorageService: SecureLocalStorageService,
    private dateIntervalService: ChartService,
    private filter: CustomFilterService,
    private barchartFilter: BarchartFilterService,
    private revenueByFoodCetegory:FilterRevenueByFoodService,
    private orderStaticticsService:OrderStaticticsService,
    private topAndLowestSellingService:TopAndLowestSellingService) { }

  ngOnInit(): void {
    this.getVenderDetails()
    this.countOrdersGroupByDay();
    this.custmerInsides(1)
    this.revenueByFoodCategory(0);
    this.orderStatictics()
    this.getLowestSellingItems()
    this.getTopSellingItems()
    
  }

  getVenderDetails() {
    const tmp = this.secureLocalStorageService.decryptAndGet(StorageKey.USER)
    if (tmp) {
      this.vender = JSON.parse(tmp)
    }
  }

  countOrdersGroupByDay() {
    this.orderService.countOrdersGroupByDay(this.vender?.vendorId).subscribe((res: any) => {
      let map: any = new Map<string, number>()

      map = this.filter.filterOrders('last30Days', res?.data)
      let tmpLabel: string[] = [];
      let tmpValue: number[] = [];

      map.forEach((value: number, key: string) => {
        tmpLabel.push(key);
        tmpValue.push(value);
      });

      this.dataForArea = {
        lable: tmpLabel,
        count: tmpValue
      };

    })
  }

  custmerInsides(month:number) {
    this.orderService.customerInsides(this.vender?.vendorId).subscribe((res: any) => {
      const tmp = this.barchartFilter.Last30Days(res?.data , month-1);  
      this.barChartData={
        new: tmp?.new,
        repeat: tmp?.repeat,
        lable: tmp?.lable
      }
    })
  }

  revenueByFoodCategory(filter:any){
    this.orderService.revenueByFoodCategory(this.vender?.vendorId).subscribe((res: any) => {
        if(res.status === RequestStatus.success){
          this.revenueByFoodCetegoryFiter= this.revenueByFoodCetegory.applyCategoryFilter('yearly' , res?.data)
        }
       
    })
  }

  orderStatictics(){
      this.orderService.orderStatictics(this.vender?.vendorId).subscribe((res:any)=>{
        if(res.status === RequestStatus.success){
        this.orderStates = this.orderStaticticsService.filterAndSummarize('Today' , res.data);     
        }
      })
  }

  getTopSellingItems(){
      this.orderService.getTopSellingItems(this.vender?.vendorId).subscribe((res:any)=>{
        if(res.status === RequestStatus.success){
         this.TopSellingItems = this.topAndLowestSellingService.transform(res.data);
        }
      })
  }

    getLowestSellingItems(){
      this.orderService.getLowestSellingItems(this.vender?.vendorId).subscribe((res:any)=>{
        if(res.status === RequestStatus.success){
         this.LowestSellingItems =  this.topAndLowestSellingService.transform(res.data);
        }
      })
  }


}

