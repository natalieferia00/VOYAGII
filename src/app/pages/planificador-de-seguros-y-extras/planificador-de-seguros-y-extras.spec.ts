import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanificadorDeSegurosYExtras } from './planificador-de-seguros-y-extras';

describe('PlanificadorDeSegurosYExtras', () => {
  let component: PlanificadorDeSegurosYExtras;
  let fixture: ComponentFixture<PlanificadorDeSegurosYExtras>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanificadorDeSegurosYExtras]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanificadorDeSegurosYExtras);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
