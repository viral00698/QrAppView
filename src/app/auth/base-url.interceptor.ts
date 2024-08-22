import { inject, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class BaseUrlInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const authService = inject(AuthenticationService)

    // console.log('Original URL:', request.url);
    const apiReq = request.url.startsWith('http')
      ? request
      : request.clone({ url: `${environment.apiUrl}/${request.url}`});
  
    // console.log('Modified URL:', apiReq.url);


    if(authService.getJwtToken() && authService.getLogedIn()){
      const header = new HttpHeaders({
        'Authorization': `${authService.getJwtToken()}`
      });
      const jwtReq = apiReq.clone({
        headers:header
      }) 
      return next.handle(jwtReq);
    }

    return next.handle(apiReq);
  }
}
