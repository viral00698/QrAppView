import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaymentMethodAnalyticsService {

  constructor() { }


  filterAndSummarize(
    range: 'WEEKLY' | 'MONTHLY' | 'NINETY_DAYS' | 'SIX_MONTHS' | 'YEARLY' | 'Today',
    allData: any[]
  ) {
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

    let cashPayment = 0.0;
    let onlinePayment = 0.0;

    const nowMillis = new Date().getTime();
    const startMillis = new Date(startDate).getTime();
    for (let item of allData) {

      const orderAtMillis = new Date(item.orderAt).getTime();
      if (orderAtMillis >= startMillis && orderAtMillis <= nowMillis) {
        if (item?.payment_mode === 'CASH') {
          cashPayment += item?.totelAmount;
        }
        else if (item?.payment_mode === 'ONLINE') {
          onlinePayment += item?.totelAmount;
        }
      }
    }

    const json = {
      'CASH':cashPayment,
      'ONLINE':onlinePayment
    }

    return json

  }
}
