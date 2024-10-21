import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { OrderStatus } from 'src/app/constent/order-status';
import { StorageKey } from 'src/app/constent/storage-key';
import { Orders } from 'src/app/model/orders';
import { OrderServiceService } from 'src/app/services/order-service.service';
import { RxStompService } from 'src/app/services/rx-stomp.service';
import { SecureLocalStorageService } from 'src/app/services/secure-local-storage.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})

export class OrderComponent implements OnInit {

  cashOrderList: any = []
  tmpcashOrderList: any = []
  searchField: any;
  orderStatusOption: any = []
  selectedValue: any;
  createOrderDiallog: boolean = true
  vender:any
  constructor(private rxStompService: RxStompService, private OrderSrvice: OrderServiceService,
     private cdr: ChangeDetectorRef,
     private storageService: SecureLocalStorageService) {

  }

  ngOnInit(): void {
    this.getWaitForAproveOrders();
    this.getVenderDetails()

    this.rxStompService.watch('/queue/'+ this.vender?.vendorId +'/messages').subscribe((res: any) => {
      this.tmpcashOrderList.push(JSON.parse(res.body));
      this.cashOrderList.push(JSON.parse(res.body));
      // this.tmpcashOrderList = this.cashOrderList
    })
    // this.rxStompService.deactivate();
  }


  getVenderDetails() {
    const tmp = this.storageService.decryptAndGet(StorageKey.USER);
    if (tmp) {
      this.vender = JSON.parse(tmp)
    }
  }
  getWaitForAproveOrders() {
    this.getVenderDetails()
    this.OrderSrvice.getWAIT_FOR_APPROVE_Order(this.vender?.vendorId).subscribe((res: any) => {
      if (res.status === 'success') {
        this.cashOrderList = res.data;
        this.tmpcashOrderList = res.data
      }
    })
  }

  updateCashOrderList(item: any) {
    this.tmpcashOrderList = this.tmpcashOrderList.filter((t: any) => { return t.orderId !== item.orderId });
  }

  OrderApprove(status: string, object: any) {
    let data: Orders = new Orders();

    if (status === 'Approved') {
      data.orderId = object.orderId;
      data.vendorId = object.vendorId;
      data.customerUUID = object.customerUUID
      data.orderStatus = OrderStatus.Confirmed;

      this.updateCashOrderList(object);
      this.rxStompService.publish({ destination: '/app/orderStatus', body: JSON.stringify(data) })
    } else if (status === 'NotApproved') {
      data.orderId = object?.orderId;
      data.vendorId = object?.vendorId;
      data.customerUUID = object.customerUUID
      data.orderStatus = OrderStatus.NotApproved
      this.updateCashOrderList(object);

      this.rxStompService.publish({ destination: '/app/orderStatus', body: JSON.stringify(data) })
    }
  }

  serarchByTokenAndMobile() {

    if (this.searchField) {
      const search = this.searchField.toLowerCase();
      this.tmpcashOrderList = this.cashOrderList.filter((item: any) => {
        return item.customerMobileNo.toLowerCase().includes(search) || item.token_no.toLowerCase().includes(search) ||
          item.orderId.toLowerCase().includes(search)
      })
    } else {
      this.tmpcashOrderList = this.cashOrderList;
    }

    if (this.tmpcashOrderList === null) {
      this.tmpcashOrderList = this.cashOrderList;
    }
  }
}

