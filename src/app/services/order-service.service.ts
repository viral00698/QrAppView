import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrderStatus } from '../constent/order-status';

@Injectable({
  providedIn: 'root'
})
export class OrderServiceService {
 
  constructor(private http: HttpClient) { }

  getWAIT_FOR_APPROVE_Order(vendor_id:any) {
    return this.http.get('Orders/getbyStatus/' + OrderStatus.WaitForApprove +'/'+vendor_id);
  }

  getOrdersCurruntDate(vendorId:any) {
    return this.http.get('Orders/getOngoingOrder/'+vendorId);
  }

  getOrderByDateRange(date: any, vederId: any) {
    return this.http.get('Orders/getOrderByDateRange/' + date + "/" + vederId);
  }

  findVendorOrderStatistics(data:any) {
    return this.http.post('OrderStatstics/daily',data);
  }

  findTop10MostOrderedItems(data:any) {
    return this.http.post('OrderStatstics/findTop10MostOrderedItems',data);
  }

  findByVendorId(data:any){
    return this.http.get('Orders/getbyOrdersByVendorId/'+data);
  }

  countOrdersGroupByDay(vendorId: any) {
    return this.http.get('OrderStatstics/totalOrder/'+vendorId);
  }

  customerInsides(vendorId: any) {
    return this.http.get('OrderStatstics/custmerInsides/'+vendorId)
  }

}
