import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TopAndLowestSellingService {

  constructor() { }


  transform(rawData: any[][]): {
    itemNames: string[],
    itemCounts: number[],
    totalAmounts: number[]
  } {
    const itemNames: string[] = [];
    const itemCounts: number[] = [];
    const totalAmounts: number[] = [];

    rawData.forEach(row => {
      itemNames.push(row[0]);
      itemCounts.push(+row[1]);
      totalAmounts.push(+row[2]);
    });

    return { itemNames, itemCounts, totalAmounts };
  }


}
