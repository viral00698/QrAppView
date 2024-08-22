import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';


interface City {
  name: string,
  code: string
}

interface item {
  id: string,
  Name: string,
  Qty:number,
  Amount:number
}


@Component({
  selector: 'app-ongoing',
  templateUrl: './ongoing.component.html',
  styleUrls: ['./ongoing.component.css'],
 
})
export class OngoingComponent  implements OnInit{
  cities!: City[];
  selectedCities: any=[];

  order!:item[];

  constructor(private http:HttpClient) {
      this.cities = [
          {name: 'New York', code: 'NY'},
          {name: 'Rome', code: 'RM'},
          {name: 'London', code: 'LDN'},
          {name: 'Istanbul', code: 'IST'},
          {name: 'Paris', code: 'PRS'}
      ];

      this.order = [
        { id:'1',Name: 'Gathiya', Qty: 1,Amount:23.43},
        { id:'1',Name: 'Gathiya', Qty: 1,Amount:23.43},
    ];
  }
  ngOnInit(): void {
    this.http.get('testSecureAdmin1/viral').subscribe((res:any)=>{
      debugger
      console.log(res);
    })
  }
}
