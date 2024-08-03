import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-analytics',
  templateUrl: './product-analytics.component.html',
  styleUrls: ['./product-analytics.component.css']
})
export class ProductAnalyticsComponent implements OnInit {

  minDate!: Date;
  date!:Date;
  data: any;
  options: any;
  orderKhobValue = 250
  revenuekhobValue = 4766.00
  onlinekhobValue = 23750
  cashkhobValue = 565
  cities:any=[]

  ngOnInit(): void {
    this.ordersChart()
    this.linechart()
    this.cities.push('A')
    this.cities.push('B')
    this.cities.push('C')
    this.cities.push('D')
    this.cities.push('E')

  }
  ordersChart(){
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.data = {
         labels: ['A', 'B', 'C'],
        datasets: [
            {
                data: [300, 50, 100],
                backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--green-500')],
                hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400')]
            }
        ]
    };


    this.options = {
        cutout: '60%',
        plugins: {
            legend: {
                position:'left',
                labels: {
                    color: textColor
                }
            }
        }
    };
    
}

linechart(){
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    
    this.data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July','Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'My First dataset',
                backgroundColor: documentStyle.getPropertyValue('--blue-500'),
                borderColor: documentStyle.getPropertyValue('--blue-500'),
                data: [65, 59, 80, 81, 56, 55, 40,87,88,99,45,88],
                borderWidth: 2, // Set the line width here
                barThickness: 10, // Set the bar width here
                maxBarThickness: 30,
                minBarThickness: 10
            },
            
        ]
    };

    this.options = {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary,
                    font: {
                        weight: 500
                    }
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            },
            y: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false,
                    
                }
            }

        }
    };
}
}



