import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SecureLocalStorageService } from '../services/secure-local-storage.service';
import { StorageKey } from '../constent/storage-key';
import { MessageService } from 'primeng/api';
import { RequestStatus } from '../constent/request-status';
import { TableOrderService } from '../services/table-order.service';
import { TableStatus } from '../constent/table-status';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-table-orders',
  templateUrl: './table-orders.component.html',
  styleUrls: ['./table-orders.component.css']
})
export class TableOrdersComponent implements OnInit {

  addTableDialogFlag = false
  formGroup!: FormGroup;
  formGroup_update!: FormGroup
  searchField: any;
  vender: any;
  updateDilog: boolean = false
  tableTypes: any;
  tables: any = [];
  tmpTables: any = [];
  viewOptions: any = []
  viewFalg: boolean = false;
  selectedView: any;
  tableOrder: any
  Order: any
  viewTableType: boolean = false
  viewOrder: boolean = false
  tableStatuses: any
  selectedtable: any;
  constructor(private fb: FormBuilder,
    private storageService: SecureLocalStorageService,
    private messageService: MessageService, private tableOrderService: TableOrderService) {

    this.tableTypes = [
      { name: 'AC', code: 'AC' },
      { name: 'Normal', code: 'NOR' },
      { name: 'Garden', code: 'GRD' },
      { name: 'Candle Light', code: 'CND' },
    ];

    this.tableStatuses = [
      { label: 'Available', value: 'AVAILABLE' },
      { label: 'Booked', value: 'BOOKED' },
      // { label: 'Occupied', value: 'OCCUPIED' },
      // { label: 'In Use', value: 'IN_USE' },
      { label: 'Closed', value: 'CLOSED' },
      {label:'Remove' , value:'REMOVE'},
      // { label: 'Cleaning', value: 'CLEANING' },
      // { label: 'Reserved', value: 'RESERVED' },
    ];

  }
  async ngOnInit(): Promise<void> {
    this.addTableFormInit()
    this.getVenderDetails()
    await this.getTables()

  }

  async getTableOrdes(table: any): Promise<void> {

    if (table?.tableStatus !== 'BOOKED') return;
    try {
      const res: any = await firstValueFrom(
        this.tableOrderService.getbyTableOrders(table.vendorId, table.tableId)
      );

      if (res.status === RequestStatus.success) {
        this.Order = res.data;

      }

      this.viewOrder = true;
    } catch (error) {
      console.error('Error fetching table orders:', error);
    }
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

  async getTables(): Promise<void> {
    if (this.vender) {
      try {
        const res: any = await firstValueFrom(
          this.tableOrderService.getTableByVendor(this.vender.vendorId)
        );

        if (res.status === RequestStatus.success) {
          this.tables = res.data;
          this.tmpTables = res.data;
        }
      } catch (error) {
        console.error('Error fetching tables:', error);
      }
    }
  }
  addTableFormInit() {
    this.formGroup = this.fb.group({
      tableName: [null, [Validators.required, Validators.pattern('^[1-9][0-9]*$')]],
      type: [null, Validators.required],
    })

    this.formGroup_update = this.fb.group({
      type: [null, Validators.required]
    })
  }

  viewSelect(event: any) {
    if (event.value === 'Table') {
      this.viewFalg = false
    } else {
      this.viewFalg = true
    }
  }

  updateModel(product: any) {
    if (this.updateDilog === true) {
      this.selectedtable = product
      this.updateDilog = false
    } else {
      this.updateDilog = true
      this.selectedtable = product

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


  uiView() {
    if (this.viewTableType === false) {
      this.viewTableType = true
    } else {
      this.viewTableType = false
    }
  }

  onSubmit_update() {

    if (this.formGroup_update.valid) {
      const json = {
        'tableStatus': this.formGroup_update.get('type')?.value?.value,
        'vendorId': this.vender.vendorId,
        'tableId': this.selectedtable?.tableId
      }

      this.tableOrderService.updateTableStatus(json).subscribe((res: any) => {

        if (res?.status === RequestStatus.success) {
          this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: res?.message });
          this.updateDilog = false
        } else {
          this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: res?.message });
          this.updateDilog = false
        }
      })

    }
  }

  deleteTable(table: any) {

    this.tableOrderService.deleteTableByVendor(table?.tableId).subscribe((res: any) => {
      if (res?.status === RequestStatus.success) {
        this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: res?.message });
        this.updateDilog = false
      } else {
        this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: res?.message });
        this.updateDilog = false
      }
    })
  }

  MarkAsCompleted(item: any) { }
  generateInvoice(item: any) { }

}
