import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelSeasonChartComponent } from './travel-season-chart.component';

describe('TravelSeasonChartComponent', () => {
  let component: TravelSeasonChartComponent;
  let fixture: ComponentFixture<TravelSeasonChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TravelSeasonChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravelSeasonChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
