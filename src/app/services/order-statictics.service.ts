import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderStaticticsService {

  constructor() { }



  filterAndSummarize(range: 'WEEKLY' | 'MONTHLY' | 'NINETY_DAYS' | 'SIX_MONTHS' | 'YEARLY' | 'Today' , allData:any) {
  const now = new Date();
  let fromDate: Date;

  switch (range) {
    case 'Today':
      fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 0);
      break;
    case 'WEEKLY':
      fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
      break;
    case 'MONTHLY':
      fromDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      break;
    case 'NINETY_DAYS':
      fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 90);
      break;
    case 'SIX_MONTHS':
      fromDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
      break;
    case 'YEARLY':
      fromDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      break;
    default:
      fromDate = new Date('1970-01-01');
  }

  // Filter and sum
  let totalAmount = 0;
  let totalOrders = 0;
  let ongoingOrders = 0;

  const filtered = allData.filter(([dateStr]:any) => {
    const date = new Date(dateStr);
    return date >= fromDate;
  });

  filtered.forEach(([_, totel_amount, total_orders, active_orders]:any) => {
    
    totalAmount += totel_amount;
    totalOrders += total_orders;
    ongoingOrders += active_orders;
  });

  totalAmount = totalAmount /(totalOrders - ongoingOrders)

  console.log({
    totalAmount,
    totalOrders,
    ongoingOrders
  });

  return {
    totalAmount,
    totalOrders,
    ongoingOrders
  };
}

}
