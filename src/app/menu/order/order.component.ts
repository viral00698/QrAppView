import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RxStompConfig } from '@stomp/rx-stomp';
import { OrderStatus } from 'src/app/constent/order-status';
import { Orders } from 'src/app/model/orders';
import { OrderServiceService } from 'src/app/services/order-service.service';
import { RxStompService } from 'src/app/services/rx-stomp.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})

export class OrderComponent implements OnInit{

  cashOrderList:any =[]
  constructor(private rxStompService:RxStompService , private OrderSrvice:OrderServiceService ) {}

  ngOnInit(): void {   
    this.getWaitForAproveOrders();
    this.rxStompService.watch('/queue/viral/messages').subscribe((res:any)=>{
      this.cashOrderList.push(JSON.parse(res.body));
    })
  }

  getWaitForAproveOrders(){
    this.OrderSrvice.getWAIT_FOR_APPROVE_Order().subscribe((res:any)=>{
      if(res.status === 'success'){
         this.cashOrderList=res.data;
      }
    })
  }

  OrderApprove(status:string , object:any){
       let data: Orders = new Orders();
      debugger
      
      if(status ==='Approved'){
        data.orderId = object.orderId;
        data.vendorId = object.vendorId;
        data.orderStatus = OrderStatus.Approved;
        this.rxStompService.publish({destination:'/app/orderStatus' ,body:JSON.stringify(data)})
      }else if(status === 'NotApproved'){
        data.orderId = object?.orderId;
        data.vendorId = object?.vendorId;
        data.orderStatus = OrderStatus.NotApproved
        this.rxStompService.publish({destination:'/app/orderStatus' ,body:JSON.stringify(data)})
      }
  }
}
