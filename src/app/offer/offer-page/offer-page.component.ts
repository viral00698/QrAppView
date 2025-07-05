import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { RequestStatus } from 'src/app/constent/request-status';
import { StorageKey } from 'src/app/constent/storage-key';
import { OfferService } from 'src/app/services/offer.service';
import { ProductService } from 'src/app/services/product.service';
import { SecureLocalStorageService } from 'src/app/services/secure-local-storage.service';

@Component({
  selector: 'app-offer-page',
  templateUrl: './offer-page.component.html',
  styleUrls: ['./offer-page.component.css']
})
export class OfferPageComponent implements OnInit {

  colors!: { name: string; code: string; }[];
  formGroup!: FormGroup;
  dilogView: boolean = false
  offerTypes: { label: string; value: string; }[];
  vender: any;
  productsList: any;
  tmpProductList: any;
  selectOfferType: any
  isSubmitting = false;
  offerList: any;
  productMap:Map<any,any> = new Map()
  constructor(private fb: FormBuilder, private productService: ProductService, private storageService: SecureLocalStorageService, private offerService: OfferService, private messageService: MessageService) {

  
    this.offerTypes = [
      { label: 'Flat Discount', value: 'FLAT_DISCOUNT' },
      { label: 'Buy One Get One (BOGO)', value: 'BOGO' },
      { label: 'Buy X Get Y', value: 'BUY_X_GET_Y' },
      // { label: 'Combo Deal', value: 'COMBO' },
      // { label: 'Returning Customer Offer', value: 'RETURNING_CUSTOMER' },

    ]
  }

  ngOnInit(): void {
    this.getVenderDetails()
    this.addOfferInit()
    this.getVendorProducts();
    this.getOfferByVendor();
  }



  showDiloag() {
    if (this.dilogView)
      this.dilogView = false
    else
      this.dilogView = true
  }

  getVenderDetails() {
    const tmp = this.storageService.decryptAndGet(StorageKey.USER);
    if (tmp) {
      this.vender = JSON.parse(tmp)
    }
  }


  addOfferInit() {
    this.formGroup = this.fb.group({
      offerName: [null, [Validators.required, Validators.pattern('^[a-zA-Z0-9()_&*@ ]+$')]],
      offerTypes: [null, [Validators.required]],
      Expires: [null, [Validators.required]],
      FlatDiscount: [null],
      IsActive: [true],
      message: [null, [Validators.required]],
      minOrderAmount:[null],
      discountBypercentage:[null],
      freeItem:[null]
    })


    this.formGroup.get('offerTypes')?.valueChanges.subscribe(selectedType => {
      const flatDiscountCtrl = this.formGroup.get('FlatDiscount');

      if (selectedType.value === 'FLAT_DISCOUNT') {
        flatDiscountCtrl?.setValidators([Validators.required]);
      } else {
        flatDiscountCtrl?.clearValidators();
      }
      flatDiscountCtrl?.updateValueAndValidity();
    });

     this.formGroup.get('offerTypes')?.valueChanges.subscribe(selectedType => {

      const flatDiscountCtrl = this.formGroup.get('minOrderAmount');
      const freeItem = this.formGroup.get('freeItem');
      if (selectedType?.value === 'BUY_X_GET_Y' || selectedType?.value === 'BOGO') {
        flatDiscountCtrl?.clearValidators();
      } else {
         flatDiscountCtrl?.setValidators([Validators.required]);
      }
      flatDiscountCtrl?.updateValueAndValidity();


      if (selectedType?.value === 'BUY_X_GET_Y') {
        flatDiscountCtrl?.setValidators([Validators.required]);
      } else {
        flatDiscountCtrl?.clearValidators();    
      }
      freeItem?.updateValueAndValidity();


    });
  }

  getVendorProducts() {
    // this.getVenderDetails();
    if (this.vender) {
      this.productService.getVendorProduts(this.vender?.vendorId).subscribe((res: any) => {
        if (res.status === RequestStatus.success) {
          this.productsList = res.data
          for(let item of res?.data){
            this.productMap.set(item?.productId , item?.itemName)
          }
        }
      })
    }
  }

  onSubmit(): void {

    if (this.formGroup.valid) {
      let venderData = null;
      if (this.vender) {
        venderData = {
          'vendorId': this.vender.vendorId
        }
      }

      const obj = {
        "offerName": this.formGroup.get('offerName')?.value,
        "isActive": this.formGroup.get('IsActive')?.value,
        "offerType": this.formGroup.get('offerTypes')?.value?.value,
        "expireDate": new Date(this.formGroup.get('Expires')?.value).getTime(),
        "flatDiscount": this.formGroup.get('FlatDiscount')?.value,
        "message": this.formGroup.get('message')?.value,
        "vendorId": this.vender.vendorId,
        "discountBypercentage": this.formGroup.get('discountBypercentage')?.value,
        "minOrderAmount": this.formGroup.get('minOrderAmount')?.value,
        "freeItem":this.formGroup.get('freeItem')?.value?.productId,
      }
    
      this.isSubmitting = true;
      this.offerService.createOffer(obj).subscribe((res: any) => {
        if (res.status === RequestStatus.success) {
          this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: res?.message });
        } else {
          this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: res?.message });
        }
      })

    }
  }

  getOfferByVendor() {
    if (this.vender) {

      this.offerService.getOfferByVendor(this.vender.vendorId).subscribe((res: any) => {
        if(res.status === RequestStatus.success){
          this.offerList = res.data;         
        }
      })
    }
  }

  onSwitchChange(offer: any) {
      const json = { 
        'isActive':!offer?.isActive,
        'vendorId':offer?.vendorId,
        'offerId':offer?.offerId
      }
      this.offerService.setOfferStatus(json).subscribe((res:any)=>{
        if(res?.status === RequestStatus.success){
          this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: res?.message });
        }else{
          this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: res?.message });
        }
      })
  }
}
