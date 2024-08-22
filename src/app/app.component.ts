import { Component, OnInit } from '@angular/core'; 
import { Message } from '@stomp/stompjs';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

flag:boolean = false
  title = 'MyQrApp';
  constructor() { }

}
