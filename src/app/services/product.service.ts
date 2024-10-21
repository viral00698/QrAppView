import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http:HttpClient) { }

  getProductList(){
    return this.http.get('productlist/getAll')
  }

  getVendorProduts(venderId:any){
    return this.http.get("product/getVendorProduts/"+venderId)
  }

  addProduct(data:any){
    return this.http.post('product/addProduct' , data);
  }

  updateProductStatus(data:any){
    return this.http.post('product/updateProductStatus',data)
  }

  deleteProductByid(data:any){
    return this.http.post('product/deleteProductByid',data);
  }
}
