import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanificacionDeTransporte } from './planificacion-de-transporte';

describe('PlanificacionDeTransporte', () => {
  let component: PlanificacionDeTransporte;
  let fixture: ComponentFixture<PlanificacionDeTransporte>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanificacionDeTransporte]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanificacionDeTransporte);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
