import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodStatusChart } from './food-status-chart';

describe('FoodStatusChart', () => {
  let component: FoodStatusChart;
  let fixture: ComponentFixture<FoodStatusChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FoodStatusChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FoodStatusChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
