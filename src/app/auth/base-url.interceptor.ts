// import { inject, Injectable } from '@angular/core';
// import {
//   HttpRequest,
//   HttpHandler,
//   HttpEvent,
//   HttpInterceptor,
//   HttpHeaders
// } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { environment } from '../environments/environments';
// import { AuthenticationService } from '../services/authentication.service';
// import { SecureLocalStorageService } from '../services/secure-local-storage.service';
// import { StorageKey } from '../constent/storage-key';

// @Injectable()
// export class BaseUrlInterceptor implements HttpInterceptor {

//   constructor(private authService: AuthenticationService , private localStrorage:SecureLocalStorageService) {}

//   jwt_Token:any;
//   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

//     // const authService = inject(AuthenticationService)
//     // console.log(authService.getJwtToken);

//     // console.log('Original URL:', request.url);
//     const apiReq = request.url.startsWith('http')
//       ? request
//       : request.clone({ url: `${environment.apiUrl}/${request.url}`});

//     // console.log('Modified URL:', apiReq.url);

//     const tt = this.localStrorage.decryptAndGet(StorageKey.JWT_TOKEN)
//     if(tt)
//       this.jwt_Token = JSON.parse(tt);
//     // ( this.authService.getJwtToken() && this.authService.getLogedIn())
//     if(this.jwt_Token){

//       const header = new HttpHeaders({
//         // 'Authorization': `${this.authService.getJwtToken()}`
//           'Authorization': `${this.jwt_Token}`
//       });
//       console.log(this.authService.getJwtToken());

//       const jwtReq = apiReq.clone({
//         headers:header
//       }) 

//       debugger
//       return next.handle(jwtReq);
//     }
//     return next.handle(apiReq);
//   }
// }

import { Injectable } from '@angular/core';
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
import { SecureLocalStorageService } from '../services/secure-local-storage.service';
import { StorageKey } from '../constent/storage-key';

@Injectable()
export class BaseUrlInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthenticationService,
    private localStorage: SecureLocalStorageService
  ) { }

  jwt_Token: any;

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // Clone the request and prepend the base URL if it's not already a full URL.

    const apiReq = request.url.startsWith('http')
      ? request
      : request.clone({ url: `${environment.apiUrl}/${request.url}` });

    if (request.url.startsWith('login')) {
      debugger
      return next.handle(apiReq);
    }
    // Retrieve JWT token from secure local storage.
    const tokenString = this.localStorage.decryptAndGet(StorageKey.JWT_TOKEN);

    if (tokenString) {
      try {
        this.jwt_Token = JSON.parse(tokenString);
      } catch (error) {
        console.error('Error parsing JWT token:', error);
      }
    }

    // If JWT token exists, clone the request and add the Authorization header.
    if (this.jwt_Token) {
      const headers = new HttpHeaders({
        'Authorization': `${this.jwt_Token}`
      });
      const jwtReq = apiReq.clone({
        headers: headers
      });

      console.log('JWT token found, request modified with Authorization header.');

      return next.handle(jwtReq);
    }

    console.log('No JWT token found, sending request without Authorization header.');
    return next.handle(apiReq);
  }
}

