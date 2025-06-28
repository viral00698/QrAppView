import { Component, OnInit } from '@angular/core';
import { RequestStatus } from 'src/app/constent/request-status';
import { StorageKey } from 'src/app/constent/storage-key';
import { OrderServiceService } from 'src/app/services/order-service.service';
import { SecureLocalStorageService } from 'src/app/services/secure-local-storage.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit{

orderDetails:boolean = false
tmpOrderList!: any[];
orderList!:any[]
  vender: any;
  tmpProduct: any;
  
constructor(private secureLocalStoregeService:SecureLocalStorageService, 
            private orderService:OrderServiceService
){}
ngOnInit(): void {
   this.getVenderDetails();
   this.getOrderHistory();
}


getVenderDetails() {
  const tmp = this.secureLocalStoregeService.decryptAndGet(StorageKey.USER);
  if (tmp) {
    this.vender = JSON.parse(tmp)
  }
}
getOrderHistory(){
  this.orderService.findByVendorId(this.vender?.vendorId).subscribe((res:any)=>{
    if(res.status === RequestStatus.success){
        this.tmpOrderList = res.data
        this.orderList = res.data
    }
  })
  
}
getOrderDetails(data:any){

  this.tmpProduct = data
  if(this.orderDetails === false)
    this.orderDetails = true;
  else
    this.orderDetails = false
}
serarchByTokenAndMobile() {

}
searchField: any;

}
