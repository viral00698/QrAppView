import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
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
    private messageService:MessageService,
    private storageService: SecureLocalStorageService) {
  }
  ngOnInit(): void {
    this.getOrderList()

    this.rxStompService.watch('/queue/'+ this.vender?.vendorId +'/messages').subscribe((res: any) => {
      const tmp = JSON.parse(res.body)
      // this.OrderList.push(tmp);
    
      this.messageService.add({
        severity: 'info',         // Notification type (success, info, warn, error)
        summary: 'New item Added',
        detail: 'New Item Added at Order ID ' + tmp.orderId.substring(0,7),
        sticky: true              // Keeps the notification visible until manually closed
      });

      this.updateOrderList(tmp)

      // this.tmpOrderList.push(tmp)
      // this.tmpOrderList.push(JSON.parse(res.body));
      // this.tmpcashOrderList = this.cashOrderList
    })
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

updateOrderList(newOrder:any){
    // Check if order already exists in tmpcashOrderList
 const tmpOrderIndex = this.tmpOrderList.findIndex((order: { orderId: any; }) => order.orderId === newOrder.orderId);
 if (tmpOrderIndex !== -1) {
   // Update the existing order
   this.tmpOrderList[tmpOrderIndex] = newOrder;
 } else {
   // Add as a new order if it doesn't exist
   this.tmpOrderList.push(newOrder);
 }

 // Similarly, update or add in cashOrderList
 const cashOrderIndex = this.OrderList.findIndex((order: { orderId: any; }) => order.orderId === newOrder.orderId);
 if (cashOrderIndex !== -1) {
   this.OrderList[cashOrderIndex] = newOrder;
 } else {
   this.OrderList.push(newOrder);
 }
 }
}
