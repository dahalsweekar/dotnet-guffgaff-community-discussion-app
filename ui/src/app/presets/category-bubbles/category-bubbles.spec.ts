import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryBubbles } from './category-bubbles';

describe('CategoryBubbles', () => {
  let component: CategoryBubbles;
  let fixture: ComponentFixture<CategoryBubbles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryBubbles]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryBubbles);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
