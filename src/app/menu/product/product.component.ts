import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { RequestStatus } from 'src/app/constent/request-status';
import { StorageKey } from 'src/app/constent/storage-key';
import { ProductService } from 'src/app/services/product.service';
import { RxStompService } from 'src/app/services/rx-stomp.service';
import { SecureLocalStorageService } from 'src/app/services/secure-local-storage.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  // encapsulation: ViewEncapsulation.
})
export class ProductComponent implements OnInit {

  dialogTitel = "Add Product"
  searchField: any;
  products: any = []
  formGroup!: FormGroup;
  visible: boolean = false
  vender: any;
  productsList: any = [];
  imageBase64!: string | ArrayBuffer | null;
  maxFileSize: number = 1000000;
  tmpImg: any;
  productId: any;
  tmpProductList: any;
  constructor(private rxStompService: RxStompService, private productService: ProductService, private fb: FormBuilder,
    private storageService: SecureLocalStorageService, private messageService: MessageService) { }

  ngOnInit(): void {
    // this.getProductList()
    this.getVendorProducts()
    this.addProductFormInit();
    this.getVenderDetails()
  }

  serarchByTokenAndMobile() {

    if (this.searchField) {
      const search = this.searchField.toLowerCase();
      this.tmpProductList = this.productsList.filter((item: any) => {
        return item.itemName.toLowerCase().includes(search)
      })
    } else {
      this.tmpProductList = this.productsList;
    }

    if (this.tmpProductList === null) {
      this.tmpProductList = this.productsList;
    }
  }

  getVenderDetails() {
    const tmp = this.storageService.decryptAndGet(StorageKey.USER);
    if (tmp) {
      this.vender = JSON.parse(tmp)
    }
  }
  getProductList() {
    this.productsList = this.productService.getProductList().subscribe((res: any) => {
      if (res.status === RequestStatus.success) {
        this.products = res.data
      }
    })
  }

  getVendorProducts() {
    this.getVenderDetails();
    if (this.vender) {
      this.productService.getVendorProduts(this.vender?.vendorId).subscribe((res: any) => {
        if (res.status === RequestStatus.success) {
          this.productsList = res.data
          this.tmpProductList = res.data
        }
      })
    }
  }

  addProductFormInit() {
    this.formGroup = this.fb.group({
      itemName: [null, Validators.required],
      amount: [null, [Validators.required, Validators.min(0)]],
      quantity: [null, Validators.min(0)],
      gram: [null, Validators.min(0)],
      jain: [false],
      vegNonVeg: [false, Validators.required],
      description: [null, Validators.required],
      // file : [null, [Validators.required, this.fileValidator.bind(this)]],
    })

  }

  onUpload(event: Event) {
    const target = event.target as HTMLInputElement;

    if (target.files && target.files.length) {
      const file = target.files[0];
      // Check if the selected file is an image
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.readAsDataURL(file); // Read the file as a Data URL (Base64)

        reader.onload = () => {
          this.imageBase64 = reader.result; // Store the Base64 string
          this.tmpImg = this.imageBase64
        };

        reader.onerror = (error) => {
          console.error('Error reading file:', error);
        };
      } else {
        console.error('Please select an image file.');
      }


    }
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      console.log('Form Submitted', this.formGroup.value);
      let venderData = null;
      if (this.vender) {
        venderData = {
          'vendorId': this.vender.vendorId
        }
      }
      //   if (this.imageBase64 && typeof this.imageBase64 === 'string') {
      //     // If the image is in the form of data URI, strip the metadata part
      //     this.imageBase64 = this.imageBase64.split(",")[1];
      // }
      const obj = {
        "itemName": this.formGroup.get('itemName')?.value,
        "amount": this.formGroup.get('amount')?.value,
        "quantity": this.formGroup.get('quantity')?.value,
        "gram": this.formGroup.get('gram')?.value,
        "jain": this.formGroup.get('jain')?.value,
        "vegNonVeg": this.formGroup.get('vegNonVeg')?.value,
        "description": this.formGroup.get('description')?.value,
        "status": true,
        "image": this.imageBase64,
        "vendor": venderData,
        "productId": this.productId
      }

      this.productService.addProduct(obj).subscribe((res: any) => {
        if (res.status === RequestStatus.success) {
          this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: 'Product added successfully' });
          this.visible = false
        } else {
          this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Failed to add product. Please try again!' });
        }
      })

    }
  }

  fileValidator(control: any) {
    const file = control.value;
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        return { invalidFileType: true };
      }

      // Validate file size
      if (file.size > this.maxFileSize) {
        return { fileTooLarge: true };
      }
    }
    return null; // No error
  }

  editProduct(product: any) {
    this.imageBase64 = null
    this.dialogTitel = "Edit Product";
    this.visible = true
    this.formGroup.setValue({
      itemName: product.itemName,
      amount: product.amount,
      quantity: product.quantity,
      gram: product.gram,
      jain: product.jain,
      vegNonVeg: product.vegNonVeg,
      description: product.description
    });
    this.tmpImg = product.image
    this.imageBase64 = product.image
    this.productId = product.productId


  }



  addProduct() {
    this.tmpImg = null
    this.productId = null
    this.dialogTitel = "Add Product"
    this.visible = true
  }

  onSwitchChange(product: any) {
    if (product.status) {

      const data = {
        'status': false,
        'productId': product.productId,
        'vendor': { 'vendorId': product.vendor }
      }
      this.productService.updateProductStatus(data).subscribe((res: any) => {
        if (res.status === RequestStatus.success) {

          this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: 'Product status successfully updated to Active.' });
        } else {
          this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: 'Product status update failed. Please try again.' });
        }
      })
    } else {

      const data = {
        'status': true,
        'productId': product.productId,
        'vendor': { 'vendorId': product.vendor }
      }

      this.productService.updateProductStatus(data).subscribe((res: any) => {
        if (res.status === RequestStatus.success) {
          this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: 'Product status successfully updated to In-Active.' });
        } else {
          this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: 'Product status update failed. Please try again.' });
        }
      })
    }
  }


  deleteProduct(product: any) {
    const data = {
      'status': true,
      'productId': product.productId,
      'vendor': { 'vendorId': product.vendor }
    }

    this.productService.deleteProductByid(data).subscribe((res: any) => {
      if (res.status === RequestStatus.success) {
        this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: res.message });
      } else {
        this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: res.message });
      }
    })
  }



}



