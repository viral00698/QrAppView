import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TableService } from 'primeng/table';
import { OrderStatus } from 'src/app/constent/order-status';
import { RequestStatus } from 'src/app/constent/request-status';
import { StorageKey } from 'src/app/constent/storage-key';
import { Orders } from 'src/app/model/orders';
import { OrderServiceService } from 'src/app/services/order-service.service';
import { RxStompService } from 'src/app/services/rx-stomp.service';
import { SecureLocalStorageService } from 'src/app/services/secure-local-storage.service';
import { TableOrderService } from 'src/app/services/table-order.service';

@Component({
  selector: 'app-ongoing',
  templateUrl: './ongoing.component.html',
  styleUrls: ['./ongoing.component.css'],

})
export class OngoingComponent implements OnInit {


  tmpOrderList: any = []
  OrderList: any = []
  searchField: any;
  vender: any
  OrdersMap: Map<any, any> = new Map()


  constructor(private orderService: OrderServiceService,
    private rxStompService: RxStompService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private tableService:TableOrderService,
    private storageService: SecureLocalStorageService) {
  }
  ngOnInit(): void {
    this.getOrderList()
    this.watchOrderClosureQueue()
    this.rxStompService.watch('/queue/' + this.vender?.vendorId + '/messages').subscribe((res: any) => {
      const tmp = JSON.parse(res.body)
      // this.OrderList.push(tmp);
      
      this.messageService.add({
        severity: 'info',         // Notification type (success, info, warn, error)
        summary: 'New item Added',
        detail: 'New Item Added at Order ID ' + tmp.orderId.substring(0, 7),
        sticky: true              // Keeps the notification visible until manually closed
      });

      this.updateOrderList(tmp)

      // this.tmpOrderList.push(tmp)
      // this.tmpOrderList.push(JSON.parse(res.body));
      // this.tmpcashOrderList = this.cashOrderList
    })
  }


  getOrderList() {
    this.getVenderDetails()
    this.orderService.getOrdersCurruntDate(this.vender?.vendorId).subscribe((res: any) => {
      if (res.status === RequestStatus.success) {
        this.OrderList = res?.data
        this.tmpOrderList = res?.data
         for (let item of this.OrderList) {
          this.OrdersMap.set(item?.orderId, item);
        }
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

  generateInvoice(item: any) {

  }
  MarkAsCompleted(object: any) {

    // this.rxStompService.publish({ destination: '/app/orderStatus', body: JSON.stringify(data) })

  }

  updateOrderList(newOrder: any) {
    this.OrdersMap.set(newOrder?.orderId, newOrder);
    this.OrderList = Array.from(this.OrdersMap.values());  
    this.tmpOrderList = this.OrderList;
    this.cdr.detectChanges();
  }

  private watchOrderClosureQueue(): void {
  const queuePath = '/queue/closeOrder' + this.vender?.vendorId;

  this.rxStompService.watch(queuePath).subscribe({
    next: (res: any) => {
      const tmp = JSON.parse(res.body);

      this.messageService.add({
        severity: 'info',
        summary: 'Order Closed',
        detail: 'Table: ' + tmp?.tableOrder?.tableName + ' has been closed.',
        sticky: true
      });

      this.removeFromList(tmp);
    },
    error: (err) => {
      console.error('WebSocket subscription error:', err);
    }
  });
}

removeFromList(data:any){
  this.OrdersMap.delete(data?.orderId)
  //  this.OrdersMap.(newOrder?.orderId, newOrder);
    this.OrderList = Array.from(this.OrdersMap.values());  
    this.tmpOrderList = this.OrderList;
    this.cdr.detectChanges();
}
}
