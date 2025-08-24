import { Injectable } from '@angular/core';
import { RxStompConfig } from '@stomp/rx-stomp';
import SockJS from 'sockjs-client';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class SocketConfigService {
  jwtToken:string | undefined;
  constructor(private authService: AuthenticationService) {
    this.jwtToken = this.authService.getJwtToken(); 
  }

 
  getRxStompConfig(): RxStompConfig {
    return {
      // brokerURL: 'wss://back.vitts.in/app/ws',

      // brokerURL: 'ws://https://back.vitts.in/app/:8080/ws',

      heartbeatIncoming: 0,
      heartbeatOutgoing: 300000,
      reconnectDelay: 300000,
      webSocketFactory: () => new SockJS('https://back.vitts.in/app/ws'),
      debug: (msg: string): void => {
        console.log(new Date(), msg);
      },
    };
  }

  

}
