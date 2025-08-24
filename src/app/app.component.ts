import { Component, OnInit } from '@angular/core';
import { Message } from '@stomp/stompjs';
import { Subscription } from 'rxjs';
import { myRxStompConfig } from './services/my-rx-stomp.config.service';
import { RxStompService } from './services/rx-stomp.service';
import { SocketConfigService } from './services/socket-config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  flag: boolean = false
  title = 'Vitts.in';
  constructor(private stompService: RxStompService, private stompConfigService: SocketConfigService) {
    // this.stompService.configure(this.stompConfigService.getRxStompConfig());
    // this.stompService.activate();

    // Configure only once
    this.stompService.configureOnce(this.stompConfigService.getRxStompConfig());

    // Connect only if not already connected
    this.stompService.connectIfNeeded();
  }

}
