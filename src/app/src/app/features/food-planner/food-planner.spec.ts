import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodPlanner } from './food-planner';

describe('FoodPlanner', () => {
  let component: FoodPlanner;
  let fixture: ComponentFixture<FoodPlanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FoodPlanner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FoodPlanner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
