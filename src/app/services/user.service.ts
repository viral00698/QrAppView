import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Signup } from '../model/signup';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  

  constructor(private http:HttpClient) { }


  createUser(data:any){
    return this.http.post('signup', data);
  }

  forgotPassword(json: Signup) {
    return this.http.post('forgotPassword',json)
  }

  getEmailbyMobile(mobile:string , vid:string) {
    return this.http.get('cv/getEmailbyMobile/'+mobile+"/"+vid)
  }
}
