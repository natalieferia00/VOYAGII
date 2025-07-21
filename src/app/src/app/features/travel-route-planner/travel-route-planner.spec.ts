import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelRoutePlanner } from './travel-route-planner';

describe('TravelRoutePlanner', () => {
  let component: TravelRoutePlanner;
  let fixture: ComponentFixture<TravelRoutePlanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TravelRoutePlanner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravelRoutePlanner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
