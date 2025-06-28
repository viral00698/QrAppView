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


  Last30Days(orderStats: any[] , month:number):barChart {

    const now = new Date();
    const startDate = new Date(now);
    startDate.setMonth(startDate.getMonth() - month); // covers last 3 months including current
  
    const customerFirstSeen = new Map<string, Date>();
    const monthWiseOrders: Record<string, Set<string>> = {};
    const result: Record<string, { new: string; repeat: string }> = {};
  
    // Sort orders chronologically
    const sortedOrders = [...orderStats].sort((a, b) => new Date(a[1]).getTime() - new Date(b[1]).getTime());
  
    for (let [phone, dateStr] of sortedOrders) {
      const date = new Date(dateStr);
      const key = `${date.toLocaleString('default', { month: 'short' })}-${date.getFullYear()}`;
  
      if (!monthWiseOrders[key]) {
        monthWiseOrders[key] = new Set();
      }
  
      // Track the month-wise customers
      monthWiseOrders[key].add(phone);
  
      // Keep track of first order date per customer
      if (!customerFirstSeen.has(phone)) {
        customerFirstSeen.set(phone, date);
      }
    }
  
    // Now calculate per month
    let KeyList = []
    let newList = []
    let repeatList = []


    for (let key of Object.keys(monthWiseOrders)) {
      const customers = monthWiseOrders[key];
      let newCount = 0;
      let repeatCount = 0;
      for (let phone of customers) {
        const firstOrderDate = customerFirstSeen.get(phone)!;
        const firstKey = `${firstOrderDate.toLocaleString('default', { month: 'short' })}-${firstOrderDate.getFullYear()}`;
  
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
      repeatList.push(repeatPercent)
      KeyList.push(key)
    }
  
    console.log(result);

   this.barChartData = {
      new: newList,
      repeat: repeatList,
      lable: KeyList
    };
      
    return this.barChartData;
  }
  

 
}
