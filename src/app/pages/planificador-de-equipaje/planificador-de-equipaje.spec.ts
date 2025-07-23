import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanificadorDeEquipaje } from './planificador-de-equipaje';

describe('PlanificadorDeEquipaje', () => {
  let component: PlanificadorDeEquipaje;
  let fixture: ComponentFixture<PlanificadorDeEquipaje>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanificadorDeEquipaje]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanificadorDeEquipaje);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
