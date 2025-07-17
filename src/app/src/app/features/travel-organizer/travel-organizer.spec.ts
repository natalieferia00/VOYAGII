import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelOrganizer } from './travel-organizer';

describe('TravelOrganizer', () => {
  let component: TravelOrganizer;
  let fixture: ComponentFixture<TravelOrganizer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TravelOrganizer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravelOrganizer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
