import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TopAndLowestSellingService {

  constructor() { }


  // transform(rawData: any[][]): {
  //   itemNames: string[],
  //   itemCounts: number[],
  //   totalAmounts: number[]
  // } {
  //   const itemNames: string[] = [];
  //   const itemCounts: number[] = [];
  //   const totalAmounts: number[] = [];

  //   rawData.forEach(row => {
  //     itemNames.push(row[0]);
  //     itemCounts.push(+row[1]);
  //     totalAmounts.push(+row[2]);
  //   });

  //   return { itemNames, itemCounts, totalAmounts };
  // }

  filterAndSummarize(
  range: 'WEEKLY' | 'MONTHLY' | 'NINETY_DAYS' | 'SIX_MONTHS' | 'YEARLY' | 'Today',
  allData: any[]
) {
  const now = new Date();
  let fromDate: Date;

  switch (range) {
    case 'Today':
      fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
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

  // Step 1: Filter data within the date range
  const filteredData = allData.filter((row) => {
    const orderDate = new Date(row[1]);
    return orderDate >= fromDate;
  });

  // Step 2: Calculate total revenue and order count
  let totalRevenue = 0;
  let totalOrders = filteredData.length;

  // Step 3: Track item stats
  const itemStats = new Map<string, { quantity: number; revenue: number }>();

  for (let row of filteredData) {
    const itemName = row[0];
    const quantity = Number(row[2]);
    const revenue = Number(row[3]);

    totalRevenue += revenue;

    if (itemStats.has(itemName)) {
      const existing = itemStats.get(itemName)!;
      itemStats.set(itemName, {
        quantity: existing.quantity + quantity,
        revenue: existing.revenue + revenue,
      });
    } else {
      itemStats.set(itemName, { quantity, revenue });
    }
  }

  // Step 4: Convert item stats to array and sort by quantity descending
  const topSellingItems = Array.from(itemStats.entries())
    .sort((a, b) => b[1].quantity - a[1].quantity)
    .map(([item, stats]) => ({
      item,
      totalQuantity: stats.quantity,
      totalRevenue: stats.revenue,
    }));

  // Optional: Top 10 only
  // const topSellingItems = sortedItems.slice(0, 10);

  // Final summary return

  let lable = []
  let revenue = []
  let qty = []
  let i = 0
  for(let item of topSellingItems){
    lable.push(item?.item)
    revenue.push(item.totalRevenue)
    qty.push(item?.totalQuantity)

    if(i == 10){
      break;
    }
    i++;
  }

  return {
    'item':lable,
    'totalRevenue':revenue,
    'totalQuantity':qty
  };
  // return {
  //   totalOrders,
  //   totalRevenue,
  //   topSellingItems,
  //   filteredData,
  // };
}

}