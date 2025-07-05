import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FeedbackServiceService {
  constructor(private http:HttpClient) { }

  saveQuestion(data:any){
    return this.http.post('question/save' , data);
  }

  getFeedback(vendorId: any) {
    return this.http.get('question/getFeedback/'+vendorId);
  }

  feedbackQuestionDisable(data:any){
    return this.http.post('question/feedbackQuestionDisable' , data);
  }
}
