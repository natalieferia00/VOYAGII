import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportationPlanner } from './transportation-planner';

describe('TransportationPlanner', () => {
  let component: TransportationPlanner;
  let fixture: ComponentFixture<TransportationPlanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransportationPlanner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransportationPlanner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
