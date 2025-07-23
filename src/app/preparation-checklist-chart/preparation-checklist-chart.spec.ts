import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreparationChecklistChart } from './preparation-checklist-chart';

describe('PreparationChecklistChart', () => {
  let component: PreparationChecklistChart;
  let fixture: ComponentFixture<PreparationChecklistChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreparationChecklistChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreparationChecklistChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
