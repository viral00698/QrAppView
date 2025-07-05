import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { RequestStatus } from 'src/app/constent/request-status';
import { StorageKey } from 'src/app/constent/storage-key';
import { FeedbackServiceService } from 'src/app/services/feedback-service.service';
import { SecureLocalStorageService } from 'src/app/services/secure-local-storage.service';

@Component({
  selector: 'app-feedback-page',
  templateUrl: './feedback-page.component.html',
  styleUrls: ['./feedback-page.component.css']
})
export class FeedbackPageComponent implements OnInit{
  searchField: any
  visible: boolean = false
  formGroup!: FormGroup
  vender: any;
  feedbackList:any =[]



  constructor(private fb: FormBuilder , private storageService: SecureLocalStorageService , private messageService:MessageService,private feedbackService:FeedbackServiceService) {
    this.formInit()
  }
  ngOnInit(): void {
    this.getVenderDetails()
    this.getFeedback()
  }

  dailogVisible() {
    if (this.visible === true)
      this.visible = false
    else
      this.visible = true
  }

  onSubmit(){
    if(this.formGroup.valid){
        const json = {
          'text':this.formGroup.get('question')?.value,
          'vendorId':this.vender?.vendorId
        }

      this.feedbackService.saveQuestion(json).subscribe((res:any)=>{
        if(RequestStatus.success === res?.status){
          this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: res?.message});
        }else{
          this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Failed to add Question. Please try again!' });
        }
      })
        
    }
  }

  formInit(){
    this.formGroup = this.fb.group({
      question:[null , [Validators.required , Validators.minLength(20)]]
    })
  }

   getVenderDetails() {
      const tmp = this.storageService.decryptAndGet(StorageKey.USER);
      if (tmp) {
        this.vender = JSON.parse(tmp)
      }
    }

    getFeedback(){
        this.feedbackService.getFeedback(this.vender?.vendorId).subscribe((res:any)=>{
          this.feedbackList = res?.data
        })
    }

    onSwitchChange(qid:any , status:boolean){
        const json = {
          'vendorId':this.vender?.vendorId,
          'id':qid,
          'status':!status,
        }

        this.feedbackService.feedbackQuestionDisable(json).subscribe((res:any)=>{
          if(res?.status === RequestStatus.success){
          this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: res?.message});
          }else{
          this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: res?.message });
          }
        })
    }


}
