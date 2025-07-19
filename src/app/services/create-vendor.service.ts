import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CreateVendorService {


  constructor(private http: HttpClient ) { }

  createVendor(data:any){
    return this.http.post('cv/create' , data);
  }

  getVendors() {
    return this.http.get('cv/getVendors');
  }

  chnageVendorStatus(data:any){
    return this.http.post('cv/chnageVendorStatus' , data);
  }
}
