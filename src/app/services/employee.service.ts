import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employee } from '../model/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

 
  constructor(private http:HttpClient) { }

  createEmployee(data:any){
    return this.http.post('employee/create',data);
  }

  getEmployeeByVendor(vendor: Employee) {
    return this.http.post('employee/employees', vendor);
  }

  changeEmployeeStatus(emp: Employee) {
    return this.http.post('employee/changeEmployeeStatus', emp);
  }

  getEmployeeAddress(emp: any) {
    const empId = emp?. empId
    return this.http.get('employee/getAddress/'+empId);
  }

  getEmailByVid(vid:string){
     return this.http.get('employee/getEmail/'+vid);
  }

}
