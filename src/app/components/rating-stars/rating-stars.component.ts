import { Component, Input } from '@angular/core';
import { NgFor } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';

@Component({
  standalone: true,
  selector: 'app-rating-stars',
  imports: [NgFor, FaIconComponent],
  templateUrl: './rating-stars.component.html',
  styleUrl: './rating-stars.component.css'
})

export class RatingStarsComponent {
  @Input() ratingRate: number = 0;
  @Input() ratingCount: number = 0;

  solidStar = solidStar;
  regularStar = regularStar;

  get fullStars(): number[] {
    const count = Math.round(this.ratingRate); // o Math.floor, según prefieras
    return Array(count).fill(0);
  }

  get emptyStars(): number[] {
    const count = 5 - Math.round(this.ratingRate);
    return Array(count).fill(0);
  }
}
