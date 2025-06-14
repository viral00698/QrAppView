import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OfferService {

  constructor(private http:HttpClient) { }


  createOffer(data:any){
    return this.http.post('offer/create' , data);
  }

  getOfferByVendor(vendorId:any){
    return this.http.get('offer/getOfferByVendor/'+vendorId);
  }
}
