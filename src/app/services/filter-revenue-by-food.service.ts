import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilterRevenueByFoodService {

  allCategoryData: any[] = [];
  filteredCategoryData: any[] = [];

  constructor() { }


  applyCategoryFilter(range: string, data: any): any {

    this.allCategoryData = data

    const now = new Date();
    const startDate = new Date();

    switch (range) {
      case 'weekly':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'monthly':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90days':
        startDate.setDate(now.getDate() - 90);
        break;
      case '6months':
        startDate.setMonth(now.getMonth() - 6);
        break;
      case 'yearly':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setTime(0); // no filter
        break;
    }

    this.filteredCategoryData = this.allCategoryData.filter(item => {
      const itemDate = new Date(item[0]);
      return itemDate >= startDate && itemDate <= now;
    });

    return this.prepareAxisData(this.filteredCategoryData)
  }

  prepareAxisData(raw: any[]): any {
    const categoryMap = new Map<string, { count: number, revenue: number }>();
  
    for (const item of raw) {
      const category = item[1];              // e.g., 'BREADS'
      const count = Number(item[2]);         // Order count for that row
      const revenue = Number(item[3]);       // Revenue for that row
  
      if (categoryMap.has(category)) {
        const existing = categoryMap.get(category)!;
        existing.count += count;             // Sum up order count
        existing.revenue += revenue;         // Sum up revenue
      } else {
        categoryMap.set(category, { count, revenue });
      }
    }
  
    const categories: string[] = [];
    const counts: number[] = [];
    const revenues: number[] = [];
  
    for (const [category, data] of categoryMap.entries()) {
      categories.push(category);
      counts.push(data.count);
      revenues.push(data.revenue);
    }
  
    return {
      category: categories,
      count: counts,
      revenue: revenues
    };
  }
  

}
