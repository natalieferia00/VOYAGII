import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripCountdown } from './trip-countdown';

describe('TripCountdown', () => {
  let component: TripCountdown;
  let fixture: ComponentFixture<TripCountdown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripCountdown]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripCountdown);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
