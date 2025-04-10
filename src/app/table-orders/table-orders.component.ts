import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SecureLocalStorageService } from '../services/secure-local-storage.service';
import { StorageKey } from '../constent/storage-key';
import { MessageService } from 'primeng/api';
import { RequestStatus } from '../constent/request-status';
import { TableOrderService } from '../services/table-order.service';
import { TableStatus } from '../constent/table-status';

@Component({
  selector: 'app-table-orders',
  templateUrl: './table-orders.component.html',
  styleUrls: ['./table-orders.component.css']
})
export class TableOrdersComponent implements OnInit {

  addTableDialogFlag = false
  formGroup!: FormGroup;
  searchField: any;
  vender: any;
  tableTypes: any;
  tables:any = [];
  tmpTables: any = [];
  viewOptions:any=[]
  viewFalg: boolean = false;
  selectedView:any;
  tableOrder:any
  Order:any
  viewOrder:boolean = false

  constructor(private fb: FormBuilder,
    private storageService: SecureLocalStorageService,
    private messageService: MessageService, private tableOrderService: TableOrderService) {

    this.tableTypes = [
      { name: 'AC', code: 'AC' },
      { name: 'Normal', code: 'NOR' },
      { name: 'Garden', code: 'GRD' },
      { name: 'Candle Light', code: 'CND' },
    ];

    this.viewOptions = [
      { name: 'Table', icon: 'bi bi-tablet' },
      { name: 'Card', icon: 'bi bi-table' },
    ];

    this.selectedView={ name: 'Card', icon: 'bi bi-table' }
  }
  ngOnInit(): void {
    this.addTableFormInit()
    this.getVenderDetails()
    this.getTables()
  }
  addProduct() {
  }
  serarchByTokenAndMobile() {
  }


  getTableOrdes(table:any){
      this.tableOrderService.getbyTableOrders(table.vendorId ,table.tableId).subscribe((res:any)=>{
        if(res.status === RequestStatus.success){
          this.Order = res.data[0]
        
        }
      }) 
      this.viewOrder = true
  
  }

  showDialog() {
    this.addTableDialogFlag = true;
  }

  getVenderDetails() {
    const tmp = this.storageService.decryptAndGet(StorageKey.USER);
    if (tmp) {
      this.vender = JSON.parse(tmp)
    }
  }

  getTables(){
    if(this.vender){
        this.tableOrderService.getTableByVendor(this.vender.vendorId).subscribe((res:any)=>{
          if(res.status === RequestStatus.success){
            this.tables = res.data;
            this.tmpTables = res.data;
            
          }
        })
    }
  }
  addTableFormInit() {
    this.formGroup = this.fb.group({
      tableName: [null, [Validators.required, Validators.pattern('^[1-9][0-9]*$')]],
      type: [null, Validators.required],
    })

  }

  viewSelect(event:any){
    if(event.value === 'Table'){
      this.viewFalg = false
    }else{
      this.viewFalg = true
    }
  }


  onSubmit(): void {
    if (this.formGroup.valid) {
      console.log('Form Submitted', this.formGroup.value);
      if (this.vender) {
        const obj = {
          "tableName": this.formGroup.get('type')?.value?.code + "-" + this.formGroup.get('tableName')?.value,
          "vendorId": this.vender.vendorId,
          "tableStatus": TableStatus.CLOSED
        }

        this.tableOrderService.addTable(obj).subscribe((res: any) => {
          if (res.status === RequestStatus.success) {
            this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: res?.message });
            this.addTableDialogFlag = false
          } else {
            this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: res?.message });
          }
        })
      }
    }
  }

}
