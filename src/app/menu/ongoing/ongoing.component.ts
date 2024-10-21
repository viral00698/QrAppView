import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { OrderStatus } from 'src/app/constent/order-status';
import { RequestStatus } from 'src/app/constent/request-status';
import { StorageKey } from 'src/app/constent/storage-key';
import { Orders } from 'src/app/model/orders';
import { OrderServiceService } from 'src/app/services/order-service.service';
import { RxStompService } from 'src/app/services/rx-stomp.service';
import { SecureLocalStorageService } from 'src/app/services/secure-local-storage.service';

@Component({
  selector: 'app-ongoing',
  templateUrl: './ongoing.component.html',
  styleUrls: ['./ongoing.component.css'],
 
})
export class OngoingComponent  implements OnInit{


  tmpOrderList:any = []
  OrderList:any =[]  
  searchField: any;
  vender:any

  
  constructor(private orderService:OrderServiceService ,
    private rxStompService:RxStompService,
    private storageService: SecureLocalStorageService) {
  }
  ngOnInit(): void {
    this.getOrderList()
  }


  getOrderList(){
    this.getVenderDetails()
    this.orderService.getOrdersCurruntDate(this.vender?.vendorId).subscribe((res:any)=>{
      if(res.status === RequestStatus.success){
        this.OrderList = res.data
        this.tmpOrderList = res.data
      }
      
    })
  }

  getVenderDetails() {
    const tmp = this.storageService.decryptAndGet(StorageKey.USER);
    if (tmp) {
      this.vender = JSON.parse(tmp)
    }
  }

  serarchByTokenAndMobile() {
    if (this.searchField) {
      const search = this.searchField.toLowerCase();
      this.tmpOrderList = this.OrderList.filter((item: any) => {
        return item.customerMobileNo.toLowerCase().includes(search) || item.token_no.toLowerCase().includes(search) ||
          item.orderId.toLowerCase().includes(search)
      })
    } else {
      this.tmpOrderList = this.OrderList;
    }

    if (this.tmpOrderList === null) {
      this.tmpOrderList = this.OrderList;
    }
  }

  generateInvoice(item:any){

  }
  MarkAsCompleted(object:any){
    let data: Orders = new Orders();
    data.orderId = object.orderId;
    data.vendorId = object.vendorId;
    data.customerUUID = object.customerUUID
    data.orderStatus = OrderStatus.Complete;
    // this.updateOrderList(object);
    this.rxStompService.publish({ destination: '/app/orderStatus', body: JSON.stringify(data) })

  }

  updateOrderList(item: any) {
    // this.tmpOrderList = this.tmpOrderList.filter((t: any) => { return t.orderId !== item.orderId });
  }
}
