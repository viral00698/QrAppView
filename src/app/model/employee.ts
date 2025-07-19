import { Designation } from "../constent/designation";
import { EmploymentType } from "../constent/employment-type";
import { Address } from "./address";

export class Employee {
    empId:any;
    name!:string
    mobileNo!:number;
    aadharNo!:any;
    aadharDoc!:any;
    panNo!:any;
    panDoc!:any;
    upi:any;
    vendorId!:any;
    status:any
    designation!:Designation;
    address!:Address;
    empImage!:any;
    employmentType!:EmploymentType;
    salary!:number
}
