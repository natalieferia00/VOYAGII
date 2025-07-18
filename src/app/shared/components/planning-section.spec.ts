import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningSection } from './planning-section';

describe('PlanningSection', () => {
  let component: PlanningSection;
  let fixture: ComponentFixture<PlanningSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanningSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanningSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
