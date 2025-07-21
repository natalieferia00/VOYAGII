import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccommodationPlanner } from './accommodation-planner';

describe('AccommodationPlanner', () => {
  let component: AccommodationPlanner;
  let fixture: ComponentFixture<AccommodationPlanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccommodationPlanner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccommodationPlanner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
