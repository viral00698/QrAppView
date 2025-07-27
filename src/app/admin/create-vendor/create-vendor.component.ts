import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { RequestStatus } from 'src/app/constent/request-status';
import { Address } from 'src/app/model/address';
import { Vendor } from 'src/app/model/vendor';
import { CreateVendorService } from 'src/app/services/create-vendor.service';
import { FileUploadService } from 'src/app/services/file-upload.service';

@Component({
  selector: 'app-create-vendor',
  templateUrl: './create-vendor.component.html',
  styleUrls: ['./create-vendor.component.css']
})
export class CreateVendorComponent implements OnInit {

  jsonData: any = []
  formGroup!: FormGroup
  aadhaarFile: any;
  panFile: any;
  fssiFile: any;
  restroFile: any
  gstFile: any;
  vendorData: any;

  constructor(private createService: CreateVendorService,
              private fb: FormBuilder,
              private fileUpload: FileUploadService,
              private messageService: MessageService) { 
                 this.formInit()
              }


  ngOnInit(): void {
     this.vendorData = history.state.vendor;
     this.fromEdit()
  }


  formInit() {
    this.formGroup = this.fb.group({
      'restaurant': [null, [Validators.required]],
      'onwer': [null, [Validators.required]],
      'gst': [null],
      'fssi': [null],
      'pan': [null],
      'aadhaar': [null, [Validators.required, Validators.minLength(12), Validators.maxLength(12)]],
      'upi': [null, [Validators.required]],
      'mobile': [null, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      'rk': [null],
      'rsk': [null],
      'state': [null, [Validators.required]],
      'district': [null, [Validators.required]],
      'taluka': [null, [Validators.required]],
      'street': [null, [Validators.required]],
      'pincode': [null, [Validators.maxLength(6), Validators.minLength(6)]]
    });

  }

  onSubmit() {
    if (this.formGroup.valid) {
      let json = new Vendor();
      let address = new Address();
      address.dist = this.formGroup.get('district')?.value,
        address.state = this.formGroup.get('state')?.value,
        address.taluka = this.formGroup.get('taluka')?.value,
        address.villageStreet = this.formGroup.get('street')?.value,
        address.pincode = this.formGroup.get('pincode')?.value,
        json.mobileNo = this.formGroup.get('mobile')?.value,
        json.aadharDoc = this.aadhaarFile,
        json.aadharNo = this.formGroup.get('aadhaar')?.value,
        json.fssiDoc = this.fssiFile,
        json.fssiNo = this.formGroup.get('fssi')?.value,
        json.panNo = this.formGroup.get('pan')?.value,
        json.panDoc = this.panFile,
        json.gstDoc = this.gstFile,
        json.gstNo = this.formGroup.get('gst')?.value,
        json.photo = this.restroFile,
        json.ownerName = this.formGroup.get('onwer')?.value,
        json.storeName = this.formGroup.get('restaurant')?.value,
        json.rk = this.formGroup.get('rk')?.value,
        json.sk = this.formGroup.get('rsk')?.value,
        json.upa = this.formGroup.get('upi')?.value
      json.address = address;

      this.createService.createVendor(json).subscribe((res: any) => {
        if (res.status === RequestStatus.success) {
          this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: res?.message });
        } else {
          this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: res?.message });
        }
      })
    }
  }

  async onUpload($event: Event, fileType: any) {

    if (fileType === 'RESTAURANT') {
      this.restroFile = await this.fileUpload.onUpload($event);
      console.log('restro ' + this.restroFile);
    }
    else if (fileType === 'AADHAAR') {
      this.aadhaarFile = await this.fileUpload.onUpload($event);
      console.log('adhaar ' + this.aadhaarFile);
    }
    else if (fileType === 'FSSI') {
      this.fssiFile = await this.fileUpload.onUpload($event);
      console.log('fssi ' + this.fssiFile);
    }
    else if (fileType === 'GST') {
      this.gstFile = await this.fileUpload.onUpload($event);
      console.log('gst ' + this.gstFile);
    }
    else if (fileType === 'PAN') {
      this.panFile = await this.fileUpload.onUpload($event);
      console.log('pan ' + this.panFile);
    }
  }


  fromEdit(){
    if(this.vendorData){

      this.formGroup.patchValue({
      'restaurant': this.vendorData?.storeName,
      'onwer':  this.vendorData?.ownerName,
      'gst':  this.vendorData?.gstNo,
      'fssi': this.vendorData?.fssiNo,
      'pan':  this.vendorData?.panNo,
      'aadhaar':  this.vendorData?.aadharNo,
      'upi': this.vendorData?.upa,
      'mobile':  this.vendorData?.mobileNo,
      'rk':  this.vendorData?.rs,
      'rsk': this.vendorData?.sk
      })
    }
  }

}
