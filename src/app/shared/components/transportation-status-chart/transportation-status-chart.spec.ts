import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportationStatusChart } from './transportation-status-chart';

describe('TransportationStatusChart', () => {
  let component: TransportationStatusChart;
  let fixture: ComponentFixture<TransportationStatusChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransportationStatusChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransportationStatusChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
