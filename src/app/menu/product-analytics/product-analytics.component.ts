import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
import { PaymentMethodAnalyticsService } from 'src/app/services/payment-method-analytics.service';
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


  selected: string = 'last7Days';
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
  paymentMethodInsides: any;

  constructor(private orderService: OrderServiceService,
    private secureLocalStorageService: SecureLocalStorageService,
    private dateIntervalService: ChartService,
    private filter: CustomFilterService,
    private barchartFilter: BarchartFilterService,
    private revenueByFoodCetegory: FilterRevenueByFoodService,
    private orderStaticticsService: OrderStaticticsService,
    private topAndLowestSellingService: TopAndLowestSellingService , private paymentAnalitcs:PaymentMethodAnalyticsService) { }

  ngOnInit(): void {
    this.getVenderDetails()
    this.last30Days()

  }

  getVenderDetails() {
    const tmp = this.secureLocalStorageService.decryptAndGet(StorageKey.USER)
    if (tmp) {
      this.vender = JSON.parse(tmp)
    }
  }

  countOrdersGroupByDay(filter: any) {
    this.orderService.countOrdersGroupByDay(this.vender?.vendorId).subscribe((res: any) => {
      let map: any = new Map<string, number>()

      map = this.filter.filterOrders(filter, res?.data)
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

  custmerInsides(filter: any) {
    this.orderService.customerInsides(this.vender?.vendorId).subscribe((res: any) => {
      // const tmp = this.barchartFilter.Last30Days(res?.data , month-1);  
      const tmp = this.barchartFilter.filterAndSummarize(filter, res?.data)
      this.barChartData = {
        new: tmp?.new,
        repeat: tmp?.repeat,
        lable: tmp?.lable
      }
    })
  }

  revenueByFoodCategory(filter: any) {
    this.orderService.revenueByFoodCategory(this.vender?.vendorId).subscribe((res: any) => {
      if (res.status === RequestStatus.success) {
        this.revenueByFoodCetegoryFiter = this.revenueByFoodCetegory.applyCategoryFilter(filter, res?.data)
      
      }

    })
  }

  orderStatictics(filter: any) {
    this.orderService.orderStatictics(this.vender?.vendorId).subscribe((res: any) => {
      if (res.status === RequestStatus.success) {
        this.orderStates = this.orderStaticticsService.filterAndSummarize(filter, res.data);
      }
    })
  }

  getTopSellingItems(filter: any) {
    this.orderService.getTopSellingItems(this.vender?.vendorId).subscribe((res: any) => {
      if (res.status === RequestStatus.success) {
        this.TopSellingItems = this.topAndLowestSellingService.filterAndSummarize(filter, res.data);
      }
    })
  }

  getLowestSellingItems() {
    this.orderService.getLowestSellingItems(this.vender?.vendorId).subscribe((res: any) => {
      if (res.status === RequestStatus.success) {
        //  this.LowestSellingItems =  this.topAndLowestSellingService.transform(res.data);
      }
    })
  }

  getPaymentMethodUsed(filter:any){
    this.orderService.getPaymentMethodUsed(this.vender?.vendorId).subscribe((res: any) => {
      if (res.status === RequestStatus.success) {
        this.paymentMethodInsides = this.paymentAnalitcs.filterAndSummarize(filter , res?.data);
      }
    })
  }

  selectItem(item: string) {
    this.selected = item;
  }

  today() {

    this.selected = 'today';
    this.countOrdersGroupByDay('daily');
    // this.revenueByFoodCategory('weekly')
    this.orderStatictics('Today')
    this.custmerInsides('Today')
    this.getTopSellingItems('Today')
    this.getPaymentMethodUsed('Today')


  }

  last7Days() {
    this.selected = 'last7Days';
    this.countOrdersGroupByDay('last7Days');
    this.revenueByFoodCategory('weekly')
    this.orderStatictics('WEEKLY')
    this.custmerInsides('WEEKLY')
    this.getTopSellingItems('WEEKLY')
    this.getPaymentMethodUsed('WEEKLY')


  }

  last30Days() {
    this.selected = 'last30Days';
    this.countOrdersGroupByDay('last30Days');
    this.revenueByFoodCategory('monthly')
    this.orderStatictics('MONTHLY')
    this.custmerInsides('MONTHLY')
    this.getTopSellingItems('MONTHLY')
    this.getPaymentMethodUsed('MONTHLY')


  }

  last90days() {
    this.selected = 'last90Days';
    this.countOrdersGroupByDay('last90Days');
    this.revenueByFoodCategory('90days')
    this.orderStatictics('NINETY_DAYS')
    this.custmerInsides('NINETY_DAYS')
    this.getTopSellingItems('NINETY_DAYS')
    this.getPaymentMethodUsed('NINETY_DAYS')



  }


  last180Days() {
    this.selected = 'last180Days';
    this.countOrdersGroupByDay('last180Days');
    this.revenueByFoodCategory('6months')
    this.orderStatictics('SIX_MONTHS')
    this.custmerInsides('SIX_MONTHS')
    this.getTopSellingItems('SIX_MONTHS')
    this.getPaymentMethodUsed('SIX_MONTHS')

  }

  yearly() {
    this.selected = 'yearly';
    this.countOrdersGroupByDay('yearly');
    this.revenueByFoodCategory('yearly')
    this.orderStatictics('YEARLY')
    this.custmerInsides('YEARLY')
    this.getTopSellingItems('YEARLY')
    this.getPaymentMethodUsed('YEARLY')


  }


}

