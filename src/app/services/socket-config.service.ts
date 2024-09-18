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
    console.log(authService.getJwtToken);
    this.jwtToken = this.authService.getJwtToken(); 
  }

 
  getRxStompConfig(): RxStompConfig {
    return {
      brokerURL: 'ws://localhost:8080/ws',

      heartbeatIncoming: 0,
      heartbeatOutgoing: 20000,
      reconnectDelay: 200,
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      debug: (msg: string): void => {
        console.log(new Date(), msg);
      },
    };
  }

  

}
