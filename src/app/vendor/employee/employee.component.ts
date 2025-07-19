import { Component, OnInit, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { firstValueFrom } from 'rxjs';
import { Designation } from 'src/app/constent/designation';
import { EmploymentType } from 'src/app/constent/employment-type';
import { RequestStatus } from 'src/app/constent/request-status';
import { StorageKey } from 'src/app/constent/storage-key';
import { Address } from 'src/app/model/address';
import { Employee } from 'src/app/model/employee';
import { Signup } from 'src/app/model/signup';
import { Vendor } from 'src/app/model/vendor';
import { EmployeeService } from 'src/app/services/employee.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { SecureLocalStorageService } from 'src/app/services/secure-local-storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  employeeAddress: any;
  seletedEmployee: any;
  forgotPasswordVisible:boolean = false
  employeeForm!: FormGroup
  forgotPasswordFrom!:FormGroup
  searchField: any;
  visible: boolean = false;
  formGroup!: FormGroup;
  designationEnum = Designation;
  designationOptions = Object.keys(Designation);
  employmentTypeEnum = Designation;
  employmentTypeOptions = Object.keys(EmploymentType);
  employeeImage: any;
  aadhaarFile: any;
  panFile: any;
  vender: any;
  employees: any;
  visibleCredentials: boolean = false;
  userRole: any
  employee: any;
  constructor(private employeeService: EmployeeService,
    private fb: FormBuilder,
    private fileUpload: FileUploadService,
    private messageService: MessageService,
    private userService: UserService,
    private storageService: SecureLocalStorageService) {
      this.formInit()
      this.forgotCredentialsFormInit()

    this.userRole = [
      { label: 'MANAGER', value: 'MANAGER' },
      { label: 'COOK', value: 'COOK' }
    ];


  }

  ngOnInit(): void {
    this.getVenderDetails()
    this.getEmployeeByVendor()
  }

  dailogVisible() {
    this.visible = !this.visible
  }

  matchOtherValidator(otherControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.parent) return null;

      const otherControl = control.parent.get(otherControlName);
      if (!otherControl) return null;

      return control.value === otherControl.value
        ? null
        : { passwordMismatch: true };
    };
  }

  formInit() {




    this.formGroup = this.fb.group({
      name: [null, Validators.required],
      mobile: [null, [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      designation: [null, Validators.required],
      salary: [null, Validators.required],
      employmentType: [null, Validators.required],
      upi: [null],
      state: [null, Validators.required],
      dist: [null, Validators.required],
      taluka: [null, Validators.required],
      village: [null, Validators.required],
      pincode: [null, [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
      aadhaar: [null, [Validators.required, Validators.pattern(/^[0-9]{12}$/)]],
      pan: [null],
      aadhaarDoc: [null],
      panDoc: [null]
    });

    this.employeeForm = this.fb.group({
      'name': [null, [Validators.required]],
      'role': [null, [Validators.required]],
      'username': [null, [Validators.required, Validators.minLength(5), Validators.maxLength(10)]],
      'password': [null, [Validators.required, Validators.minLength(10), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=\-[\]{};':"\\|,.<>/?]).+$/)]],
      'Conform_password': [null, [Validators.required, this.matchOtherValidator('password')]]
    })
  }

  onSubmit() {
    if (this.formGroup.valid) {

      const address = new Address();
      address.state = this.formGroup.get('state')?.value
      address.dist = this.formGroup.get('dist')?.value
      address.taluka = this.formGroup.get('taluka')?.value
      address.villageStreet = this.formGroup.get('village')?.value
      address.pincode = this.formGroup.get('pincode')?.value
      address.addressId = this.employeeAddress?.addressId

      const emp = new Employee()
      emp.empId = this.seletedEmployee?.empId
      emp.aadharDoc = this.aadhaarFile,
        emp.aadharNo = this.formGroup.get('aadhaar')?.value
      emp.designation = this.formGroup.get('designation')?.value
      emp.empImage = this.employeeImage,
        emp.panDoc = this.panFile,
        emp.panNo = this.formGroup.get('pan')?.value
      emp.employmentType = this.formGroup.get('employmentType')?.value
      emp.name = this.formGroup.get('name')?.value
      emp.mobileNo = this.formGroup.get('mobile')?.value
      emp.upi = this.formGroup.get('upi')?.value
      emp.address = address
      emp.salary = this.formGroup.get('salary')?.value
      emp.vendorId = this.vender?.vendorId

      this.employeeService.createEmployee(emp).subscribe((res: any) => {
        if (res.status === RequestStatus.success) {
          this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: res?.message });
        } else {
          this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: res?.message });
        }
      })

    }

  }

  async onUpload($event: Event, fileType: any) {

    if (fileType === 'empImage') {
      this.employeeImage = await this.fileUpload.onUpload($event);
      console.log('restro ' + this.employeeImage);
    }
    else if (fileType === 'AADHAAR') {
      this.aadhaarFile = await this.fileUpload.onUpload($event);
      console.log('adhaar ' + this.aadhaarFile);
    }
    else if (fileType === 'PAN') {
      this.panFile = await this.fileUpload.onUpload($event);
      console.log('pan ' + this.panFile);
    }
  }

  getVenderDetails() {
    const tmp = this.storageService.decryptAndGet(StorageKey.USER);
    if (tmp) {
      this.vender = JSON.parse(tmp)
    }
  }

  getEmployeeByVendor() {
    const vendor = new Employee();
    vendor.vendorId = this.vender?.vendorId
    this.employeeService.getEmployeeByVendor(vendor).subscribe((res: any) => {
      this.employees = res?.data
    })
  }

  changeStatus(employee: any) {
    const emp = new Employee()
    emp.empId = employee?.empId
    emp.vendorId = this.vender?.vendorId
    emp.status = !employee?.status

    this.employeeService.changeEmployeeStatus(emp).subscribe((res: any) => {
      if (res.status === RequestStatus.success) {
        this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: res?.message });
      } else {
        this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: res?.message });
      }
    })
  }


  editVendor(employee: any) {
    this.visible = !this.visible


    if (this.visible) {
      this.fetchEmployeeAddress(employee);
      this.seletedEmployee = employee;
      this.formGroup.patchValue({
        name: employee?.name,
        mobile: employee?.mobileNo,
        designation: employee?.designation,
        salary: employee?.salary,
        employmentType: employee?.employmentType,
        upi: employee?.upi,
        state: this.employeeAddress?.state,
        dist: this.employeeAddress?.dist,
        taluka: this.employeeAddress?.taluka,
        village: this.employeeAddress?.villageStreet,
        pincode: this.employeeAddress?.pincode,
        aadhaar: employee?.aadharNo,
        pan: employee?.panNo

      })
    }
  }

  async fetchEmployeeAddress(employee: any): Promise<void> {
    try {
      const res: any = await firstValueFrom(this.employeeService.getEmployeeAddress(employee));
      this.employeeAddress = res.data;
    } catch (error) {
      console.error('Failed to fetch employee address:', error);
    }
  }

  createCredentialsModel(employee:any) {
    this.employee = employee
    this.visibleCredentials = !this.visibleCredentials
  }
  createCredentials() {

    if (this.employeeForm.valid) {
      const json = new Signup(
        this.employeeForm.get('username')?.value,
        this.employeeForm.get('password')?.value,
        this.employeeForm.get('name')?.value,
       [ this.employeeForm.get('role')?.value?.value],
        this.vender?.vendorId,
        this.employee?.empId
        
      )
      
      this.userService.createUser(json).subscribe((res: any) => {
        if (res.status === RequestStatus.success) {
          this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: res?.message });
        } else {
          this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: res?.message });
        }
      })
    }
  }

  forgotCredentialsFormInit(){
    this.forgotPasswordFrom = this.fb.group({
      'username': [null, [Validators.required, Validators.minLength(5), Validators.maxLength(10)]],
      'password': [null, [Validators.required, Validators.minLength(10), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=\-[\]{};':"\\|,.<>/?]).+$/)]],
      'Conform_password': [null, [Validators.required, this.matchOtherValidator('password')]]
    })
  }

  forgotCredentials(){
    
    if(this.forgotPasswordFrom.value){
      const json = new Signup(
        this.forgotPasswordFrom.get('username')?.value,
        this.forgotPasswordFrom.get('Conform_password')?.value,
        'NULL',
        [],
        'NULL',
        'NULL'
      )

      this.userService.forgotPassword(json).subscribe((res:any)=>{
        if (res.status === RequestStatus.success) {
          this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: res?.message });
        } else {
          this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: res?.message });
        }
      })
    }
  }
  forgotPassword(){
      this.forgotPasswordVisible = !this.forgotPasswordVisible
  }

  viewProfile(){
    
  }
}


