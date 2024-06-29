import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit{

  products:any =[]
  
  visible: boolean = false;

  showDialog() {
      this.visible = true;
  }
  

  ngOnInit(): void {
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



}
