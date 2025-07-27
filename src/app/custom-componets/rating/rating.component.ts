import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent  implements OnChanges  {

  @Input() rating: number = 0;
  @Input() maxStars: number = 5;

  
  stars: ('full' | 'half' | 'empty')[] = [];

  ngOnChanges(): void {
    this.generateStars();
  }

  private generateStars() {
    this.stars = [];

    for (let i = 0; i < this.maxStars; i++) {
      if (i < Math.floor(this.rating)) {
        this.stars.push('full');
      } else if (i === Math.floor(this.rating) && this.rating % 1 !== 0) {
        this.stars.push('half');
      } else {
        this.stars.push('empty');
      }
    }
  }
}
