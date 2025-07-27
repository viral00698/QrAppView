import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { RequestStatus } from 'src/app/constent/request-status';
import { Signup } from 'src/app/model/signup';
import { Vendor } from 'src/app/model/vendor';
import { CreateVendorService } from 'src/app/services/create-vendor.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-view-vendors',
  templateUrl: './view-vendors.component.html',
  styleUrls: ['./view-vendors.component.css']
})
export class ViewVendorsComponent implements OnInit {
  vendors: any;
  visible: boolean = false;
  fromGroup!: FormGroup
  vendorId: any;
  forgotPasswordFrom!:FormGroup
  forgotPasswordVisible:boolean = false

  constructor(private createService: CreateVendorService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService) { this.initFrom() }

  ngOnInit(): void {
    this.getVendors()
    this.forgotCredentialsFormInit()

  }

  getVendors() {
    this.createService.getVendors().subscribe((res: any) => {
      this.vendors = res?.data
    })
  }

  createCredentials(vendor: any) {
    this.vendorId = vendor
    if (this.visible === true) {
      this.visible = false;
    } else {
      this.visible = true;
    }
  }
  changeStatus(vender: any) {


    this.confirmationService.confirm({
      message: 'Are you sure you want to update this vendor?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        if (vender) {
          const json = new Vendor()
          json.vendorId = vender?.vendorId
          json.status = !vender?.status

          this.createService.chnageVendorStatus(json).subscribe((res: any) => {
            if (res.status === RequestStatus.success) {
              this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: res?.message });
            } else {
              this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: res?.message });
            }
          })
        }

      },
      reject: () => { }
    });

  }
  editVendor(vendor: any) {
    this.router.navigate(['dashboard/admin/createVendor'], {
      state: { vendor: vendor }
    });
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

  initFrom() {
    this.fromGroup = this.fb.group({
      'name': [null, [Validators.required]],
      'username': [null, [Validators.required, Validators.minLength(5), Validators.maxLength(10)]],
      'password': [null, [Validators.required, Validators.minLength(10), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=\-[\]{};':"\\|,.<>/?]).+$/)]],
      'Conform_password': [null, [Validators.required, this.matchOtherValidator('password')]]
    });


  }

  onSubmit() {

    if (this.fromGroup.valid) {
      const json = new Signup(
        this.fromGroup.get('username')?.value,
        this.fromGroup.get('password')?.value,
        this.fromGroup.get('name')?.value,
        ['VENDER'],
        this.vendorId?.vendorId,
        'NULL'
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
