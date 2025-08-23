import { Injectable } from '@angular/core';


export type barChart = {
  new: any,
  repeat: any,
  lable: any
};

@Injectable({
  providedIn: 'root'
})
export class BarchartFilterService {
  barChartData!: barChart;

  constructor() { }


  // Last30Days(orderStats: any[] , month:number):barChart {

  //   const now = new Date();
  //   const startDate = new Date(now);
  //   startDate.setMonth(startDate.getMonth() - month); // covers last 3 months including current
  
  //   const customerFirstSeen = new Map<string, Date>();
  //   const monthWiseOrders: Record<string, Set<string>> = {};
  //   const result: Record<string, { new: string; repeat: string }> = {};
  
  //   // Sort orders chronologically
  //   const sortedOrders = [...orderStats].sort((a, b) => new Date(a[1]).getTime() - new Date(b[1]).getTime());
  
  //   for (let [phone, dateStr] of sortedOrders) {
  //     const date = new Date(dateStr);
  //     const key = `${date.toLocaleString('default', { month: 'short' })}-${date.getFullYear()}`;
  
  //     if (!monthWiseOrders[key]) {
  //       monthWiseOrders[key] = new Set();
  //     }
  
  //     // Track the month-wise customers
  //     monthWiseOrders[key].add(phone);
  
  //     // Keep track of first order date per customer
  //     if (!customerFirstSeen.has(phone)) {
  //       customerFirstSeen.set(phone, date);
  //     }
  //   }
  
  //   // Now calculate per month
  //   let KeyList = []
  //   let newList = []
  //   let repeatList = []


  //   for (let key of Object.keys(monthWiseOrders)) {
  //     const customers = monthWiseOrders[key];
  //     let newCount = 0;
  //     let repeatCount = 0;
  //     for (let phone of customers) {
  //       const firstOrderDate = customerFirstSeen.get(phone)!;
  //       const firstKey = `${firstOrderDate.toLocaleString('default', { month: 'short' })}-${firstOrderDate.getFullYear()}`;
  
  //       if (firstKey === key) {
  //         newCount++;
  //       } else {
  //         repeatCount++;
  //       }
  //     }
  
  //     const total = newCount + repeatCount;
  //     const newPercent = total > 0 ? ((newCount / total) * 100).toFixed(2) : "0.00";
  //     const repeatPercent = total > 0 ? ((repeatCount / total) * 100).toFixed(2) : "0.00";
      
     
  //     result[key] = {
  //       new: `${newPercent}%`,
  //       repeat: `${repeatPercent}%`,
  //     };
  //     newList.push(newPercent);
  //     repeatList.push(repeatPercent)
  //     KeyList.push(key)
  //   }
  
  //   console.log(result);

  //  this.barChartData = {
  //     new: newList,
  //     repeat: repeatList,
  //     lable: KeyList
  //   };
      
  //   return this.barChartData;
  // }
  

  filterAndSummarize(
  range: 'WEEKLY' | 'MONTHLY' | 'NINETY_DAYS' | 'SIX_MONTHS' | 'YEARLY' | 'Today',
  allData: any[]
): barChart {
  const now = new Date();
  let startDate = new Date();

  switch (range) {
    case 'WEEKLY':
      startDate.setDate(now.getDate() - 7);
      break;
    case 'MONTHLY':
      startDate.setMonth(now.getMonth() - 1);
      break;
    case 'NINETY_DAYS':
      startDate.setMonth(now.getMonth() - 3);
      break;
    case 'SIX_MONTHS':
      startDate.setMonth(now.getMonth() - 6);
      break;
    case 'YEARLY':
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    case 'Today':
      startDate.setHours(0, 0, 0, 0);
      break;
  }

  const customerFirstSeen = new Map<string, Date>();
  const monthWiseOrders: Record<string, Set<string>> = {};
  const result: Record<string, { new: string; repeat: string }> = {};

  // Sort and filter data
  const sortedOrders = [...allData]
    .filter(([_, dateStr]) => new Date(dateStr) >= startDate)
    .sort((a, b) => new Date(a[1]).getTime() - new Date(b[1]).getTime());

  for (let [phone, dateStr] of sortedOrders) {
    const date = new Date(dateStr);

    const key = range === 'WEEKLY' || range === 'Today'
      ? `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
      : `${date.toLocaleString('default', { month: 'short' })}-${date.getFullYear()}`;

    if (!monthWiseOrders[key]) {
      monthWiseOrders[key] = new Set();
    }

    monthWiseOrders[key].add(phone);

    if (!customerFirstSeen.has(phone)) {
      customerFirstSeen.set(phone, date);
    }
  }

  let KeyList: string[] = [];
  let newList: string[] = [];
  let repeatList: string[] = [];

  for (let key of Object.keys(monthWiseOrders)) {
    const customers = monthWiseOrders[key];
    let newCount = 0;
    let repeatCount = 0;

    for (let phone of customers) {
      const firstOrderDate = customerFirstSeen.get(phone)!;
      const firstKey = range === 'WEEKLY' || range === 'Today'
        ? `${firstOrderDate.getDate()}-${firstOrderDate.getMonth() + 1}-${firstOrderDate.getFullYear()}`
        : `${firstOrderDate.toLocaleString('default', { month: 'short' })}-${firstOrderDate.getFullYear()}`;

      if (firstKey === key) {
        newCount++;
      } else {
        repeatCount++;
      }
    }

    const total = newCount + repeatCount;
    const newPercent = total > 0 ? ((newCount / total) * 100).toFixed(2) : "0.00";
    const repeatPercent = total > 0 ? ((repeatCount / total) * 100).toFixed(2) : "0.00";

    result[key] = {
      new: `${newPercent}%`,
      repeat: `${repeatPercent}%`,
    };

    newList.push(newPercent);
    repeatList.push(repeatPercent);
    KeyList.push(key);
  }

  this.barChartData = {
    new: newList,
    repeat: repeatList,
    lable: KeyList
  };

  return this.barChartData;
}


 
}
