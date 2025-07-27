import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { MessageService } from 'primeng/api';
import { RequestStatus } from 'src/app/constent/request-status';
import { StorageKey } from 'src/app/constent/storage-key';
import { OrderServiceService } from 'src/app/services/order-service.service';
import { RxStompService } from 'src/app/services/rx-stomp.service';
import { SecureLocalStorageService } from 'src/app/services/secure-local-storage.service';

@Component({
  selector: 'app-kitchen',
  templateUrl: './kitchen.component.html',
  styleUrls: ['./kitchen.component.css']
})
export class KitchenComponent{
  tmpOrderList: any = []
  OrderList: any[] = []
  OrdersMap:Map<any,any> = new Map()
  searchField: any;
  vender: any


  constructor(private orderService: OrderServiceService,
    private rxStompService: RxStompService,
    private messageService: MessageService,
    private storageService: SecureLocalStorageService) {
  }
  // ngOnChanges(changes: SimpleChanges): void {
  //   this.getOrderList()
  // }
  ngOnInit(): void {
    this.getOrderList()

    this.rxStompService.watch('/queue/' + this.vender?.vendorId + '/messages').subscribe((res: any) => {
      const tmp = JSON.parse(res.body)
      this.messageService.add({
        severity: 'info',         // Notification type (success, info, warn, error)
        summary: 'New item Added',
        detail: 'New Item Added at Table:  ' + tmp?.tableOrder?.tableName,
        sticky: true              // Keeps the notification visible until manually closed
      });

      this.updateOrderList(tmp)
    })
  }


  getOrderList() {
    this.getVenderDetails()
    this.orderService.getOrdersCurruntDate(this.vender?.vendorId).subscribe((res: any) => {
      if (res.status === RequestStatus.success) {
        this.OrderList = res.data

        for(let item of this.OrderList){
          this.OrdersMap.set(item?.orderId , item);
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


  updateOrderList(newOrder: any) {
    // Check if order already exists in tmpcashOrderList
    this.OrdersMap.set(newOrder?.orderId , newOrder);

    this.OrderList = Array.from(this.OrdersMap.values());

    // const index = this.OrderList.findIndex((order: { orderId: any; }) => order.orderId === newOrder.orderId);
    // if (index !== -1) {
    //   this.OrderList[index] = newOrder
    //   // this.tmpOrderList[tmpOrderIndex] = newOrder;
    // } else {
    //   this.OrderList.push(newOrder)
    //   // this.tmpOrderList.push(newOrder);
    // }

  }
}

