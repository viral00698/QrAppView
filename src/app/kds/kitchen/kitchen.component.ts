import { ChangeDetectorRef, Component, OnChanges, SimpleChanges } from '@angular/core';
import { MessageService } from 'primeng/api';
import { OrderStatus } from 'src/app/constent/order-status';
import { RequestStatus } from 'src/app/constent/request-status';
import { StorageKey } from 'src/app/constent/storage-key';
import { TableStatus } from 'src/app/constent/table-status';
import { OrderDetails } from 'src/app/model/OrderDetails';
import { OrderServiceService } from 'src/app/services/order-service.service';
import { ProductService } from 'src/app/services/product.service';
import { RxStompService } from 'src/app/services/rx-stomp.service';
import { SecureLocalStorageService } from 'src/app/services/secure-local-storage.service';

@Component({
  selector: 'app-kitchen',
  templateUrl: './kitchen.component.html',
  styleUrls: ['./kitchen.component.css']
})
export class KitchenComponent {
  tmpOrderList: any = []
  OrderList: any[] = []
  OrdersMap: Map<any, any> = new Map()
  searchField: any;
  vender: any


  constructor(private orderService: OrderServiceService,
    private rxStompService: RxStompService,
    private messageService: MessageService,
    private productService: ProductService,
    private cdr: ChangeDetectorRef,
    private storageService: SecureLocalStorageService) {
  }
  // ngOnChanges(changes: SimpleChanges): void {
  //   this.getOrderList()
  // }
  ngOnInit(): void {
    this.getOrderList()
    this.watchOrderClosureQueue()

    this.rxStompService.watch('/queue/' + this.vender?.vendorId + '/messages').subscribe((res: any) => {
      const tmp = JSON.parse(res.body)
      let m = ''
      if(tmp?.tableOrder?.tableName){
        if(tmp?.tableOrder?.tableStatus === TableStatus.AVAILABLE){
          return;
        }
        m + 'at Table :'+tmp?.tableOrder?.tableName
      }

      this.messageService.add({
        severity: 'info',         // Notification type (success, info, warn, error)
        summary: 'New item Added',
        detail: 'New Item Added' + m,
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


  updateOrderList(newOrder: any) {

    if(newOrder?.orderStatus !== OrderStatus.Ongoing || newOrder?.orderStatus === OrderStatus.WaitForApprove){
      return;
    }

    this.OrdersMap.set(newOrder?.orderId, newOrder);
    this.OrderList = Array.from(this.OrdersMap.values());  
    this.cdr.detectChanges();

  }

  updateItemStatus(product: any, item: any, orderDetails: any) {

    const data = new OrderDetails()
    data.orderDetailsId = product?.orderDetailsId;
    data.isDelivered = !product?.isDelivered;

    this.productService.updateItemStatus(data).subscribe((res: any) => {
      if (res?.status === RequestStatus.success) {

        for(let i = 0; i < orderDetails.length; i++){
          if(product?.orderDetailsId === orderDetails[i]?.orderDetailsId){
            product.isDelivered = res?.data  
            orderDetails[i] = product;
            break;
          }
        }
        item.orderDetails = orderDetails;

        for(let i = 0; i < this.OrderList.length;i++){
          if(item?.orderId === this.OrderList[i].orderId){
            this.OrderList[i] = item;
            break;
          }
        }
        this.cdr.detectChanges();
      }
    });
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
    this.cdr.detectChanges();
}

}

