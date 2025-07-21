import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetCalculator } from './budget-calculator';

describe('BudgetCalculator', () => {
  let component: BudgetCalculator;
  let fixture: ComponentFixture<BudgetCalculator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetCalculator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetCalculator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
