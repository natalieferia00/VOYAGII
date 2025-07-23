import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanificadorDeAlojamientos } from './planificador-de-alojamientos';

describe('PlanificadorDeAlojamientos', () => {
  let component: PlanificadorDeAlojamientos;
  let fixture: ComponentFixture<PlanificadorDeAlojamientos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanificadorDeAlojamientos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanificadorDeAlojamientos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
