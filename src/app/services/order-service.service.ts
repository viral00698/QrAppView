import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrderStatus } from '../constent/order-status';

@Injectable({
  providedIn: 'root'
})
export class OrderServiceService {

  constructor(private http:HttpClient) { }

  getWAIT_FOR_APPROVE_Order(){
    return this.http.get('Orders/getbyStatus/'+OrderStatus.WaitForApprove);
  }
}
