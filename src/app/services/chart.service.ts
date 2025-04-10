import { Injectable } from '@angular/core';
import { timeInterval } from 'rxjs';
import { TimeIntrval } from '../constent/time-intrval';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  constructor() { }

  getDateIntervals(startDate: Date, endDate: Date): Date[] {
    let intervals: Date[] = [];
  
    const hoursDifference = this.differenceInHours(startDate, endDate);
    const yearDifference = endDate.getFullYear() - startDate.getFullYear();
    const dayDifference = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
    const weekDifference = Math.floor(dayDifference / 7);
    const isSameMonth = startDate.getFullYear() === endDate.getFullYear() && startDate.getMonth() === endDate.getMonth();

     // Check if the dates are within the same year and have a difference of 52 weeks or less
    const isSameYearWithWeeklyThreshold = yearDifference === 0 && weekDifference <= 52;

    // Choose interval type based on specificity, only one will apply
    if (hoursDifference <= 24) {
      // Apply hourly if the difference is within 24 hours
      intervals = this.Hourly(startDate, endDate);
    }else if(isSameMonth) {
      // Apply daily interval if startDate and endDate are within the same month
      intervals = this.Daily(startDate, endDate);
    } 
    else if (isSameYearWithWeeklyThreshold) {
      // Apply weekly if the difference is within 1 year
      intervals = this.Weekly(startDate, endDate);
    } else if (yearDifference <= 1) {
      // Apply monthly if the difference is within 1 year but greater than 52 weeks
      intervals = this.Monthly(startDate, endDate);
    } else {
      // Otherwise, apply yearly
      intervals = this.Yearly(startDate, endDate);
    }
  
    return intervals;
  }


  Hourly(startDate: Date, endDate: Date){
    
    const intervals: Date[] = [];
    let currentDate = new Date(startDate);
    const endTime = endDate.getTime();
    while(currentDate.getTime() <= endTime){
      intervals.push(new Date(currentDate));
      currentDate.setHours(currentDate.getHours() + 1);
    }
    return intervals
  }

  Weekly(startDate: Date, endDate: Date){
    
    const intervals: Date[] = [];
    let currentDate = new Date(startDate);
    const endTime = endDate.getTime();
    while(currentDate.getTime() <= endTime){
      intervals.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 7);
    }
    return intervals
  }

  Monthly(startDate: Date, endDate: Date){
    
    const intervals: Date[] = [];
    let currentDate = new Date(startDate);
    const endTime = endDate.getTime();
    while(currentDate.getTime() <= endTime){
      intervals.push(new Date(currentDate));
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    

    return intervals
  }

  Yearly(startDate: Date, endDate: Date){
    
    const intervals: Date[] = [];
    let currentDate = new Date(startDate);
    const endTime = endDate.getTime();
    while(currentDate.getTime() <= endTime){
      intervals.push(new Date(currentDate));
      currentDate.setFullYear(currentDate.getFullYear() + 1);
    }
    return intervals
  }

  Daily(startDate: Date, endDate: Date){
    
    const intervals: Date[] = [];
    let currentDate = new Date(startDate);

    while(currentDate <= endDate){
      intervals.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return intervals
  }

  private differenceInHours(date1: Date, date2: Date): number {
    return Math.abs(date2.getTime() - date1.getTime()) / (1000 * 60 * 60);
  }


}
