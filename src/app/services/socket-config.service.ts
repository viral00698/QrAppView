import { Injectable } from '@angular/core';
import { Client, Message } from '@stomp/stompjs';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import * as Stomp from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
@Injectable({
  providedIn: 'root'
})
export class SocketConfigService {

  private client!: Client;
  private messageSubject: Subject<string> = new Subject<string>();


  constructor() {
    this.initializeWebSocketConnection();
  }

  initializeWebSocketConnection() {
    this.client = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      connectHeaders: {
        // Add any necessary headers here
        // Authorization:'eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6ImFkbWluQGdtYWlsLmNvbSIsImF1dGhvcml0aWVzIjoiUk9MRV9BRE1JTiIsInN1YiI6IkpXVCBUb2tlbiIsImlzcyI6IkxlZ2lvbiIsImlhdCI6MTcyMDI4NTQ5MCwiZXhwIjoxNzIwMjg2MzkwfQ.ZRe8jYiUIf8z1XcNJ5GmOdGlkIt0TCDark3DTwZiHB0NYt7MIGrqIBFcNjyX5k3djU-UJFheGYv3BooxGkp3TA'
      },
      debug: function (str) {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      webSocketFactory: () => new SockJS('http://localhost:8080/ws')
    });
    this.client.onConnect = (frame) => {
      this.client.subscribe('/topic/messages', (message: Message) => {
        if (message.body) {
          this.messageSubject.next(message.body);
        }
      });
    };

    this.client.activate();
  }

  sendMessage(message: string) {
    this.client.publish({ destination: '/app/sendMessage', body: message });
  }

  getMessages() {
    return this.messageSubject.asObservable();
  }

}
