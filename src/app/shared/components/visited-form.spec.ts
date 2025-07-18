import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitedForm } from './visited-form';

describe('VisitedForm', () => {
  let component: VisitedForm;
  let fixture: ComponentFixture<VisitedForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitedForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitedForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
