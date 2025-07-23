import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanificadorDeAlimentacion } from './planificador-de-alimentacion';

describe('PlanificadorDeAlimentacion', () => {
  let component: PlanificadorDeAlimentacion;
  let fixture: ComponentFixture<PlanificadorDeAlimentacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanificadorDeAlimentacion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanificadorDeAlimentacion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
