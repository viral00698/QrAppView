import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustomFilterService {

  constructor() { }


  groupByDay(data: { date: Date, count: number }[]) {
    return data.reduce((acc, curr) => {
      const day = curr.date.toDateString(); // groups by "Mon Apr 07 2025"
      acc[day] = (acc[day] || 0) + curr.count;
      return acc;
    }, {} as { [key: string]: number });
  }

  groupByMonth(data: any) {
    let monthMap = new Map<string, number>();  // Renamed to `monthMap` for better clarity
    
    for (let i of data) {
      const dateStr = i[1];  // Assuming the date is at index 1
      const count = i[2];    // Assuming the count is at index 2
  
      // Check if the date is valid
      const dateObj = new Date(dateStr);
      if (isNaN(dateObj.getTime())) {
        console.warn('Invalid date format or entry found:', i);
        continue;
      }
  
      // Define month names
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
      // Get the month number (0-based index, so 0 = January)
      const monthNum = dateObj.getMonth();
      const monthName = monthNames[monthNum]; // Convert to month name (e.g., Jan, Feb, etc.)
  
      // Get the year
      const year = dateObj.getFullYear();
      
      // Create a key combining month and year (e.g., "Jan-2024")
      const key = `${monthName}-${year}`;
  
      // Sum the counts for the same month
      if (monthMap.has(key)) {
        monthMap.set(key, monthMap.get(key)! + count);
      } else {
        monthMap.set(key, count);
      }
    }
  
    return monthMap;
  }
  
  


  groupByYear(data: any) {
    const yearlyMap = new Map<string, number>();  // Rename the map variable to `yearlyMap`
    
    for (let i of data) {
      const dateStr = i[1];  // Assuming the date is at index 1
      const count = i[2];    // Assuming the count is at index 2
      
      if (!dateStr || isNaN(new Date(dateStr).getTime())) {
        console.warn('Invalid date entry found:', i);
        continue;
      }
      
      const dateObj = new Date(dateStr);
      
      if (isNaN(dateObj.getTime())) {
        console.warn('Invalid date format:', dateStr);
        continue;
      }
  
      const key = dateObj.getFullYear().toString(); // Get year as a string
      if (yearlyMap.has(key)) {
        yearlyMap.set(key, yearlyMap.get(key)! + count);
      } else {
        yearlyMap.set(key, count);
      }
    }
    
    return yearlyMap;
  }
  
  groupByLast7Days(data: any) {
    const dayMap = new Map<string, number>();
  
    const istOffsetMinutes = 330; // IST = UTC +5:30
    const nowUTC = new Date();
    const nowIST = new Date(nowUTC.getTime() + istOffsetMinutes * 60 * 1000);
  
    const sevenDaysAgoIST = new Date(nowIST.getTime());
    sevenDaysAgoIST.setDate(nowIST.getDate() - 6); // Last 7 days including today
  
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
    for (let i of data) {
      const dateStr = i[1];
      const count = i[2];
  
      if (!dateStr || isNaN(new Date(dateStr).getTime())) {
        console.warn('Invalid date entry found:', i);
        continue;
      }
  
      const utcDate = new Date(dateStr);
      const istDate = new Date(utcDate.getTime() + istOffsetMinutes * 60 * 1000);
  
      if (istDate < sevenDaysAgoIST || istDate > nowIST) continue;
  
      const day = istDate.getDate().toString().padStart(2, '0');
      const month = monthNames[istDate.getMonth()];
      const key = `${day}-${month}`;
  
      if (dayMap.has(key)) {
        dayMap.set(key, dayMap.get(key)! + count);
      } else {
        dayMap.set(key, count);
      }
    }
  
    return dayMap;
  }
  

  groupByLast30Days(data: any) {
    const dayMap = new Map<string, number>();
  
    const now = new Date();
    const istOffsetMinutes = 330; // IST is UTC +5:30
    const todayIST = new Date(now.getTime() + istOffsetMinutes * 60 * 1000);
    
    const thirtyDaysAgoIST = new Date(todayIST.getTime());
    thirtyDaysAgoIST.setDate(todayIST.getDate() - 29); // Includes today
  
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
    for (let i of data) {
      const dateStr = i[1];
      const count = i[2];
  
      if (!dateStr || isNaN(new Date(dateStr).getTime())) {
        console.warn('Invalid date entry found:', i);
        continue;
      }
  
      // Convert to IST
      const utcDate = new Date(dateStr);
      const istDate = new Date(utcDate.getTime() + istOffsetMinutes * 60 * 1000);
  
      // Filter dates within the last 30 days in IST
      if (istDate < thirtyDaysAgoIST || istDate > todayIST) continue;
  
      const day = istDate.getDate().toString().padStart(2, '0');
      const month = monthNames[istDate.getMonth()];
      const key = `${day}-${month}`; // Example: 03-Apr
  
      if (dayMap.has(key)) {
        dayMap.set(key, dayMap.get(key)! + count);
      } else {
        dayMap.set(key, count);
      }
    }
  
    return dayMap;
  }
  

  groupByLast24Hours(data: any) {
    const hourMap = new Map<string, number>();
  
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
    for (let i of data) {
      const dateStr = i[1]; // datetime string
      const count = i[2];   // count value
  
      if (!dateStr || isNaN(new Date(dateStr).getTime())) {
        console.warn('Invalid date entry found:', i);
        continue;
      }
  
      const utcDate = new Date(dateStr);
  
      // Convert UTC to IST (UTC +5:30)
      const istOffsetInMinutes = 330;
      const istDate = new Date(utcDate.getTime() + istOffsetInMinutes * 60 * 1000);
  
      if (istDate < twentyFourHoursAgo || istDate > now) continue;
  
      let hours = istDate.getHours();
      const minutes = istDate.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
  
      hours = hours % 12;
      hours = hours ? hours : 12; // convert 0 to 12
      const hourStr = hours.toString().padStart(2, '0');
  
      const timeKey = `${hourStr}:${minutes} ${ampm}`;
  
      if (hourMap.has(timeKey)) {
        hourMap.set(timeKey, hourMap.get(timeKey)! + count);
      } else {
        hourMap.set(timeKey, count);
      }
    }
  
    return hourMap;
  }
  
  
  filterOrders(type: 'daily' | 'last7Days' | 'monthly' | 'yearly' | 'hourly'|'last30Days', orderStats: any) {
    switch (type) {
      case 'daily':
        return this.groupByDay(orderStats);
      case 'last7Days':
        return this.groupByLast7Days(orderStats);
      case 'monthly':
        return this.groupByMonth(orderStats);
      case 'yearly':
        return this.groupByYear(orderStats);
      case 'hourly':
        return this.groupByLast24Hours(orderStats);
      case 'last30Days':
        return this.groupByLast30Days(orderStats);
    }
  }



  


}
