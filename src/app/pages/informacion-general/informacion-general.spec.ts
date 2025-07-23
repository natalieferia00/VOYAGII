import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformacionGeneral } from './informacion-general';

describe('InformacionGeneral', () => {
  let component: InformacionGeneral;
  let fixture: ComponentFixture<InformacionGeneral>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformacionGeneral]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InformacionGeneral);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
