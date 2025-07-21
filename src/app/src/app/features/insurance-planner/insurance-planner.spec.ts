import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsurancePlanner } from './insurance-planner';

describe('InsurancePlanner', () => {
  let component: InsurancePlanner;
  let fixture: ComponentFixture<InsurancePlanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsurancePlanner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsurancePlanner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
