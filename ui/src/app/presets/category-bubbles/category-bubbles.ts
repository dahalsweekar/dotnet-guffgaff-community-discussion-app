import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-category-bubbles',
  imports: [],
  templateUrl: './category-bubbles.html',
  styleUrl: './category-bubbles.scss'
})
export class CategoryBubbles {
  @Input() categories: string[] = [];
}

