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
onSwitchChange(_t26: any) {
throw new Error('Method not implemented.');
}
  colors!: { name: string; code: string; }[];
  formGroup!: FormGroup;
  dilogView: boolean = false
  discountOptions: { label: string; value: string; }[];
  offerTypes: { label: string; value: string; }[];
  vender: any;
  productsList: any;
  tmpProductList: any;
  selectOfferType: any
  isSubmitting = false;
  offerList: any;
  constructor(private fb: FormBuilder, private productService: ProductService, private storageService: SecureLocalStorageService, private offerService: OfferService, private messageService: MessageService) {

    this.discountOptions = [
      { label: 'Percentage Discount', value: 'discountBypercentage' },
      { label: 'Fixed Amount Off', value: 'fixAmount' },
      { label: 'Flat Discount', value: 'flatDiscount' },

    ];

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

  colorCode() {
    this.colors = [
      { name: 'Electric Violet', code: '#8F00FF' },
      { name: 'Neon Pink', code: '#FF6EC7' },
      { name: 'Aqua Blue', code: '#00FFFF' },
      { name: 'Lime Green', code: '#32CD32' },
      { name: 'Sunset Orange', code: '#FF5E3A' },
      { name: 'Royal Blue', code: '#4169E1' },
      { name: 'Crimson Red', code: '#DC143C' },
      { name: 'Coral', code: '#FF7F50' },
      { name: 'Turquoise', code: '#40E0D0' },
      { name: 'Gold', code: '#FFD700' },
      { name: 'Deep Sky Blue', code: '#00BFFF' },
      { name: 'Hot Pink', code: '#FF69B4' },
      { name: 'Medium Slate Blue', code: '#7B68EE' },
      { name: 'Magenta', code: '#FF00FF' },
      { name: 'Sea Green', code: '#2E8B57' },
      { name: 'Orange Red', code: '#FF4500' },
      { name: 'Mint Green', code: '#98FF98' },
      { name: 'Peach', code: '#FFE5B4' },
      { name: 'Sky Magenta', code: '#CF71AF' },
      { name: 'Light Coral', code: '#F08080' }
    ];

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
      FlatDiscount: [null, [Validators.required]],
      IsActive: [false],
      message: [null, [Validators.required]],
    })

  }

  getVendorProducts() {
    this.getVenderDetails();
    if (this.vender) {
      this.productService.getVendorProduts(this.vender?.vendorId).subscribe((res: any) => {
        if (res.status === RequestStatus.success) {
          this.productsList = res.data
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

  onOfferTypeChange(event: any) {
    console.log(this.selectOfferType);
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

copyToClipboard(text: string | null): void {
  if (text) {
    navigator.clipboard.writeText(text);
  }
}


}
