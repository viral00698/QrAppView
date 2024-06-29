import { Component } from '@angular/core';


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
  styleUrls: ['./ongoing.component.css']
})
export class OngoingComponent {
  cities!: City[];
  selectedCities: any=[];

  order!:item[];

  constructor() {
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
}
