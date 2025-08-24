
// import { myRxStompConfig } from './my-rx-stomp.config.service';
import { RxStompService } from './rx-stomp.service';
let rxStompInstance: RxStompService;

export function rxStompServiceFactory(): RxStompService {
  // const rxStomp = new RxStompService();
  // // rxStomp.configure(myRxStompConfig.getRxStompConfig);
  // rxStomp.activate();
  // return rxStomp;

  if (!rxStompInstance) {
    rxStompInstance = new RxStompService();
    rxStompInstance.connectIfNeeded();
  }
  return rxStompInstance;
}