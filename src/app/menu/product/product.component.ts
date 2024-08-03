import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SocketConfigService } from 'src/app/services/socket-config.service';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  // encapsulation: ViewEncapsulation.
})
export class ProductComponent implements OnInit{
  receivedMessages: string[] = [];
  products:any =[]
  message!: string;
  messages: string[] = [];
  visible: boolean = false;

//  constructor(private rxStompService: RxStompService) { }
constructor(private webSocketService: SocketConfigService) {}

  showDialog() {
      this.visible = true;

  }
  
  ngOnInit(): void {
  
    this.webSocketService.getMessages().subscribe((message) => {
      this.messages.push(message);
    });
 
    const prod = {
      id: '1000',
      ProductName: 'f230fh0g3',
      ByGram: 'Bamboo Watch',
      ByQty: 'Product Description',
      image: 'bamboo-watch.jpg',
      price: 65,
      category: 'Accessories',
      quantity: 24,
      inventoryStatus: 'INSTOCK',
      status: 5
  }
  const prod1 = {
    id: '1000',
    ProductName: 'f230fh0g3',
    ByGram: 'Bamboo Watch',
    ByQty: 'Product Description',
    image: 'bamboo-watch.jpg',
    price: 65,
    category: 'Accessories',
    quantity: 24,
    inventoryStatus: 'INSTOCK',
    status: 5
}
  this.products.push(prod)
  this.products.push(prod1)
}


  sendMessage() {
    this.webSocketService.sendMessage(this.message);
    this.message = '';
  }

  onBasicUploadAuto(t:any){

  }
}
