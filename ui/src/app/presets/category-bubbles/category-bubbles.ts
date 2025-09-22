import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-category-bubbles',
  imports: [],
  templateUrl: './category-bubbles.html',
  styleUrl: './category-bubbles.scss'
})
export class CategoryBubbles {
  @Input() categories: string[] = [];
  @Output() categorySelected = new EventEmitter<string>();

  selectedCategory: string = ''

  onCategoryClick(category: string): void{
    debugger;
    this.selectedCategory = category;
    this.categorySelected.emit(category);
  }
}

